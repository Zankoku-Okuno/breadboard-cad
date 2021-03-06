const path = require('path')

module.exports =
    { entry: 
        [ "babel-polyfill"
        , "./src/main.js"
        ]
    , output:
        { filename: 'app.js'
        , path: path.resolve(__dirname, 'dist')
        }
    , module:
        { rules:
            [ { test: /\.js/
              , include: [ path.resolve(__dirname, 'src') ]
              , use: { loader: "babel-loader" }
            }]
        }
    , mode: "development"
    , devtool: "source-map"
    }
