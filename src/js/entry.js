import latLngsData from '../data/latLngs.csv';
import LatLng from './LatLng';

const { THREE } = window;

const latLngs = latLngsData.map(({ lat, lng }) => (new LatLng(lat, lng)));

class Earth {
  constructor(canvas, width, height) {
    this.rot = 0; // 角度
    this.time = 0;

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xffffff, 1);

    // シーンを作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(45, width / height);

    // 形状データを作成
    this.geometry = new THREE.BufferGeometry();

    const SIZE = 300;
    const vertices_base = [];
    const colors_base = [];
    latLngs.forEach((latLng) => {
      const vec3 = latLng.toXYZ(SIZE);
      vertices_base.push(vec3.x, vec3.y, vec3.z);
      const h = 0.55;
      const s = 0.8 + (Math.random() * 0.2);
      const v = 0.8 + (Math.random() * 0.2);
      colors_base.push(h, s, v);
    });
    const vertices = new Float32Array(vertices_base);
    this.geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const colors = new Float32Array(colors_base);
    this.geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    // material作成
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        size: {
          type: 'f',
          value: 100.0
        },
        texture: {
          type: 't',
          value: Earth.createTexture()
        }
      },
      vertexShader: document.getElementById('vs').textContent,
      fragmentShader: document.getElementById('fs').textContent,
      transparent: true,
      depthWrite: false
      // blending: THREE.AdditiveBlending
    });
    // 物体を作成
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);

    this.tick = this.tick.bind(this);
    this.tick();
  }

  /**
   * ランダムな緯度経度を生成
   * @returns {LatLng}
   */
  static getRandomLatLng() {
    const lat = (Math.random() * 180) - 90;
    const lng = (Math.random() * 360) - 180;
    return new LatLng(lat, lng);
  }

  /**
   * パーティクルのテクスチャを生成
   * @returns {THREE.Texture}
   */
  static createTexture() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 128;
    canvas.height = 128;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(64, 64, 64, 0, Math.PI / 180, true);
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * アニメーションの毎フレーム呼ばれる
   */
  tick() {
    this.rot += 1;
    // ラジアンに変換する
    const radian = this.rot * (Math.PI / 180);
    // 角度に応じてカメラの位置を設定
    this.camera.position.x = 1000 * Math.sin(radian);
    this.camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // シェーダーに渡すtime変数の値を変える
    this.time += 0.0001;
    this.material.uniforms.time.value += this.time % 1;
    // レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }
}

window.earth = new Earth(document.querySelector('canvas'), 960, 540);
