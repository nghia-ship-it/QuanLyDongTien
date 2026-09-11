const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src');
const pattern1 = /'https:\/\/quanlydongtien\.onrender\.com(.*?)'/g;
const pattern2 = /"https:\/\/quanlydongtien\.onrender\.com(.*?)"/g;
const pattern3 = /`https:\/\/quanlydongtien\.onrender\.com(.*?)`/g;

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync(dirPath).filter(f => f.endsWith('.jsx'));

files.forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  content = content.replace(pattern1, '`${import.meta.env.VITE_API_URL}$1`');
  content = content.replace(pattern2, '`${import.meta.env.VITE_API_URL}$1`');
  content = content.replace(pattern3, '`${import.meta.env.VITE_API_URL}$1`');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
  }
});
