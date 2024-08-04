const fs = require('fs')
const path = require('path')

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [ 
    "@babel/transform-runtime",
    [
        "transform-modules",
        {
            "@fe/buss-ui": {
                // "transform": "@fe/buss-ui/transform.js",
                transform(importName, styleName, hasImportName){ 
                  const BUIPATH = `@fe/buss-ui/src/components/${importName}` 
                  const MUIPATH = `@fe/aym-ui/lib/${importName}` 
                  let isExists = (filePath) => fs.existsSync(path.join('node_modules',filePath))

                  let stylePath = ''
                  if (styleName) {
                      if (!hasImportName && importName === styleName) {
                        stylePath =  MUIPATH + importName + '.css'
                      } else {
                        stylePath = MUIPATH + '/' + styleName + '.css'
                      }
                  }
                  if(isExists(BUIPATH)){
                    return BUIPATH
                  }
                  if(stylePath && isExists(stylePath)){
                    return stylePath
                  }
                  return MUIPATH
                },
                "preventFullImport": true,
                "kebabCase": true,
                "style": true
            }
        }
    ]
  ]
}
