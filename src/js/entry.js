import Stats from 'stats-js';
import '../sass/style.sass';
import vertexShader from '../shaders/main.vs';
import fragmentShader from '../shaders/main.fs';
import lineVertexShader from '../shaders/line.vs';
import lineFragmentShader from '../shaders/line.fs';
import latLngsData from '../data/latLngs.csv';
import LatLng from './LatLng';

const latLngs = latLngsData.map(({ lat, lng }) => (new LatLng(lat, lng)));

class Earth {
  constructor(canvas, width, height, stats) {
    this.CAMERA_DISTANCE = 1000;

    this.time = 0;
    this.stats = stats;

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    // this.renderer.setClearColor(0xffffff, 1);

    // シーンを作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(45, width / height);
    this.camera.position.set(0, 0, this.CAMERA_DISTANCE);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 形状データを作成
    this.geometry = new THREE.BufferGeometry();
    this.lines = new THREE.Group();
    this.lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        }
      },
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.lineMaterial.linewidth = 1;

    const SIZE = 300;
    const vertices_base = [];
    const colors_base = [];
    const sizes_base = [];
    latLngs.forEach((latLng) => {
      const vec3 = latLng.toXYZ(SIZE);
      vertices_base.push(vec3.x, vec3.y, vec3.z);
      const h = 0.55;
      const s = 0.8 + (Math.random() * 0.2);
      const v = 0.8 + (Math.random() * 0.2);
      colors_base.push(h, s, v);
      sizes_base.push((Math.random() * 50) + 50);
      if (Math.random() > 0.8) {
        const lineGeometry = new THREE.BufferGeometry();
        const line_vertices_base = [];
        const line_colors_base = [];
        line_vertices_base.push(vec3.x, vec3.y, vec3.z);
        line_vertices_base.push(vec3.x * 1.05, vec3.y * 1.05, vec3.z * 1.05);
        line_colors_base.push(h, s, v);
        line_colors_base.push(h, s, v);
        const line_vertices = new Float32Array(line_vertices_base);
        const line_colors = new Float32Array(line_colors_base);
        const line_is_end = new Float32Array([0, 1]);
        const line_length = new Float32Array([1, 1 + (Math.random() * 0.2)]);
        lineGeometry.addAttribute('position', new THREE.BufferAttribute(line_vertices, 3));
        lineGeometry.addAttribute('color', new THREE.BufferAttribute(line_colors, 3));
        lineGeometry.addAttribute('is_end', new THREE.BufferAttribute(line_is_end, 1));
        lineGeometry.addAttribute('length', new THREE.BufferAttribute(line_length, 1));
        const line = new THREE.Line(lineGeometry, this.lineMaterial, THREE.LineStrip);
        this.lines.add(line);
      }
    });
    const vertices = new Float32Array(vertices_base);
    this.geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const colors = new Float32Array(colors_base);
    this.geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    const sizes = new Float32Array(sizes_base);
    this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // material作成
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        texture: {
          type: 't',
          value: Earth.createTexture()
        }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    // 物体を作成
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
    this.scene.add(this.lines);

    this.tick = this.tick.bind(this);
    this.tick();

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
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
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * アニメーションの毎フレーム呼ばれる
   */
  tick() {
    this.stats.begin();
    this.scene.rotation.set(0, this.scene.rotation.y - 0.003, 0);
    // シェーダーに渡すtime変数の値を変える
    this.material.uniforms.time.value += 0.1;
    this.lineMaterial.uniforms.time.value += 0.1;
    const to = new THREE.Vector3(
      this.mouseX - (window.innerWidth / 2),
      this.mouseY - (window.innerHeight / 2),
      this.CAMERA_DISTANCE
    );
    const currentPosition = this.camera.position;
    this.camera.position.set(
      (currentPosition.x * 0.97) + (to.x * 0.03),
      (currentPosition.y * 0.97) + (to.y * 0.03),
      this.CAMERA_DISTANCE
    );
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // レンダリング
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.tick);
  }
}

const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
window.earth = new Earth(document.querySelector('canvas'), window.innerWidth, window.innerHeight, stats);
window.addEventListener('resize', () => {
  window.earth.resize(window.innerWidth, window.innerHeight);
});
