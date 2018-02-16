const Jimp = require('jimp');
const fs = require('fs');
const GOAL_LENGTH = 100;
const API_KEY = fs.readFileSync('.apikey');
const outputFilePath = 'src/data/latLngs.csv';

const getUrl = (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=100x100&zoom=1&center=${lat},${lng}&style=feature:landscape%7Celement:geometry.fill%7Ccolor:0x000000&style=feature:water%7Celement:geometry.fill%7Ccolor:0xffffff&style=feature:all%7Celement:labels%7Cvisibility:off&key=${API_KEY}`;
};

const getIsLand = (color) => {
  return color.r + color.g + color.b / 3 < 255;
};

const getLatLngFromXYZ = (x, y, z, radius) => {
  const lat = Math.asin(y / radius) / (Math.PI / 180);
  const distanceFromYAxis = Math.cos(lat * (Math.PI / 180));
  const lng = (z > 0 ? 1 : -1) * Math.acos(x / distanceFromYAxis) / (Math.PI / 180);
  return { lat, lng };
};

const getRandomPosition = () => {
  const unitZ = Math.random() * 2 - 1;
  const radianT = Math.random() * Math.PI * 2;
  const x = Math.sqrt(1 - unitZ * unitZ) * Math.cos(radianT);
  const y = Math.sqrt(1 - unitZ * unitZ) * Math.sin(radianT);
  return getLatLngFromXYZ(x, y, unitZ, 1);
};

let csv = fs.readFileSync(outputFilePath) || 'lat,lng\n';
let length = 0;
let position;

const getPosition = () => {
  position = getRandomPosition();
  Jimp.read(getUrl(position.lat, position.lng), (error, image) => {
    const isLand = getIsLand(Jimp.intToRGBA(image.getPixelColor(image.bitmap.width / 2, image.bitmap.height / 2)));
    console.log(isLand ? 'land' : 'water', length);
    if (isLand) {
      length += 1;
      csv += `${position.lat},${position.lng}\n`;
    }
    if (length >= GOAL_LENGTH) {
      fs.writeFileSync(outputFilePath, csv);
    } else {
      getPosition();
    }
  });
};

getPosition();