const Jimp = require('jimp');
const fs = require('fs');
const GOAL_LENGTH = 10;
const API_KEY = fs.readFileSync('.apikey');

const getUrl = (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=100x100&zoom=1&center=${lat},${lng}&style=feature:landscape%7Celement:geometry.fill%7Ccolor:0x000000&style=feature:water%7Celement:geometry.fill%7Ccolor:0xffffff&style=feature:all%7Celement:labels%7Cvisibility:off&key=${API_KEY}`;
};

const getIsLand = (color) => {
  return color.r + color.g + color.b / 3 < 255 / 2;
};

const getRandomPosition = () => {
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;
  return { lat, lng };
};

let csv = 'lat,lng\n';
let length = 0;
let position;

const getPosition = () => {
  position = getRandomPosition();
  Jimp.read(getUrl(position.lat, position.lng), (error, image) => {
    const isLand = getIsLand(Jimp.intToRGBA(image.getPixelColor(image.bitmap.width / 2, image.bitmap.height / 2)));
    console.log('is land ? ', isLand);
    if (isLand) {
      length += 1;
      csv += `${position.lat},${position.lng}\n`;
    }
    if (length >= GOAL_LENGTH) {
      fs.writeFileSync('src/data/positions.csv', csv);
    } else {
      getPosition();
    }
  });
};

getPosition();