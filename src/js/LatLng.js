export default class LatLng {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  toXYZ(radius, center = new THREE.Vector3()) {
    const y = Math.sin(this.lat * (Math.PI / 180));
    const distanceFromYAxis = Math.cos(this.lat * (Math.PI / 180));
    const x = Math.cos(this.lng * (Math.PI / 180)) * distanceFromYAxis;
    const z = Math.sin(this.lng * (Math.PI / 180)) * distanceFromYAxis;
    return new THREE.Vector3(x, y, z).multiplyScalar(radius).add(center);
  }
}
