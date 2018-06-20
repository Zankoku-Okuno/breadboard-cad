const path = require('path')

module.exports =
    { entry: 
        [ "babel-polyfill"
        , "./src/test.js"
        ]
    , output:
        { filename: 'main.js'
        , path: path.resolve(__dirname, 'dist')
        }
    , module:
        { rules:
            [ { test: /\.js/
              , include: [ path.resolve(__dirname, 'src') ]
              , use: { loader: "babel-loader" }
            }]
        }
    , devtool: "source-map"
    }
