const fs = require('fs')
var UglifyJS = require("uglify-js")

const jsFiles = ['index.js', 'asteroid.js', 'ship.js', 'sound.js']

jsFiles.forEach(name => {
  fs.writeFileSync(`./public/${name}`, UglifyJS.minify(fs.readFileSync(`./src/${name}`, "utf8")).code)
})
