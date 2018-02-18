attribute vec3 color;
attribute float size;

uniform float time;

varying vec4 vMvPosition;
varying vec3 vColor;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
  float noiseValue = noise(vec3(position.x / 300.0 + time / 10.0, position.y / 300.0 + time / 10.0, position.z / 300.0 + time / 10.0)) * 0.1;
  float scalar = noiseValue + 1.0;
  vec3 position = vec3(position.x * scalar, position.y * scalar, position.z * scalar);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vMvPosition = mvPosition;
  float h = max(0.0, color.x - noiseValue * noiseValue * 10.0);
  vColor = vec3(h, color.yz);

  gl_PointSize = 10.0 + (noiseValue * noiseValue * 10000.0) * (200.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}