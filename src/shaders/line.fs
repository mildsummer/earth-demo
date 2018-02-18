varying vec4 vMvPosition;
varying vec3 vColor;
varying float vStrength;
varying float vNearEnd;

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 custom_color = hsv2rgb(vColor);
  float opacity = 200.0 / (length(vMvPosition.xyz) - 600.0) * vStrength * vStrength * vStrength * (1.0 - vNearEnd);

  gl_FragColor = vec4(custom_color, opacity);
}