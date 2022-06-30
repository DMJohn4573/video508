const path = require('path');
const fs = require('fs');

module.exports = {
  encode: (config, iconsFile) => {
    let fontName = config.fontName;
    let fontFiles = {
      woff: path.join(config.dest, `${fontName}.woff`)
    };
    let scssContents = fs.readFileSync(iconsFile).toString();
    Object.keys(fontFiles).forEach( font => {
      let fontFile = fontFiles[font];
      let fontContent = fs.readFileSync(fontFile);

      let regex = new RegExp(`(url.*font-${font}.*base64,)([^\\s]+)(\\).*)`);
      scssContents = scssContents.replace(regex, `$1${fontContent.toString('base64')}$3`);
    });

    fs.writeFileSync(iconsFile, scssContents);
  }
}


