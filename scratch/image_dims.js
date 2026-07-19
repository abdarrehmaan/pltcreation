const fs = require('fs');
const path = require('path');

function getDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.png') {
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
  } else if (ext === '.jpg' || ext === '.jpeg') {
    let offset = 2;
    while (offset < buffer.length) {
      const marker = buffer.readUInt16BE(offset);
      offset += 2;
      if (marker === 0xFFC0 || marker === 0xFFC2) {
        const height = buffer.readUInt16BE(offset + 3);
        const width = buffer.readUInt16BE(offset + 5);
        return { width, height };
      }
      const length = buffer.readUInt16BE(offset);
      offset += length;
    }
  }
  return null;
}

['banner1.jpg', 'banner2.png', 'banner3.png', 'banner4.png'].forEach(file => {
  const p = path.join('public', file);
  if (fs.existsSync(p)) {
    console.log(file, getDimensions(p));
  } else {
    console.log(file, 'not found');
  }
});
