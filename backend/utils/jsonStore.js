const fs = require('fs');
const path = require('path');

const memoryStore = {};

const readData = (filename) => {
  if (memoryStore[filename]) {
    return memoryStore[filename];
  }
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryStore[filename] = parsed;
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return memoryStore[filename] || [];
  }
};

const writeData = (filename, data) => {
  memoryStore[filename] = data;
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // In serverless environments (like Vercel), disk might be read-only (EROFS).
    // Memory store retains the data during runtime.
    console.warn(`Filesystem write skipped for ${filename} (${err.message}). Data held in memory.`);
    return true;
  }
};

module.exports = { readData, writeData };
