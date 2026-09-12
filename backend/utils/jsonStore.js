const fs = require('fs');
const path = require('path');

const readData = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
};

module.exports = { readData, writeData };
