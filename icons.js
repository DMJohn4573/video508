const webfontsGenerator = require('webfonts-generator');
const base64 = require('./scripts/base64');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

// App root
const appDir = __dirname;
// Read icons configuration file
let config = JSON.parse(fs.readFileSync(path.join(appDir, 'icons.json')));
let defaultPath = config.path;
let icons = config.icons;
let iconsFiles = icons.map(icon => (icon.path ? icon.path : defaultPath) + icon.svg);

webfontsGenerator(
  {
    files: iconsFiles,
    dest: config.dest,
    fontName: config.fontName,
    cssDest: 'scss/_font.scss',
    cssTemplate: 'scss/font.hbs',
    rename: filePath => {
      let fileName = path.basename(filePath);
      let name = _.result(_.find(icons, icon => path.basename(icon.svg) === fileName), 'name');
      return name;
    },
    types: ['svg', 'woff', 'ttf']
  },
  error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    base64.encode(config, 'scss/_font.scss');
  }
);
process.exit();
