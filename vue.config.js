const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    productionSourceMap: false,
    configureWebpack:{
        plugins:[
            new CopyPlugin([
                { from: "src/assets/capas/", to: "capas/" }
            ])
        ]
    }
}