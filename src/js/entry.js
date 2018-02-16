import latLngsData from '../data/latLngs.csv';
import LatLng from './LatLng';

const { THREE } = window;

const latLngs = latLngsData.map(({ lat, lng }) => (new LatLng(lat, lng)));

class Earth {
  constructor(canvas, width, height) {
    this.rot = 0; // 角度

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    // シーンを作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.camera = new THREE.PerspectiveCamera(45, width / height);

    // 形状データを作成
    this.geometry = new THREE.Geometry();
    // 配置する範囲
    // 配置する個数
    const SIZE = 200;
    latLngs.forEach((latLng) => {
      this.geometry.vertices.push(latLng.toXYZ(SIZE));
    });

    // マテリアルを作成
    this.material = new THREE.PointsMaterial({
      // 一つ一つのサイズ
      size: 10,
      // 色
      color: 0xFFFFFF
    });

    // 物体を作成
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

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
    // レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }
}

window.earth = new Earth(document.querySelector('canvas'), 960, 540);
