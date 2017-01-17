var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: "./src/index.js",  //náš vstupní bod aplikace
    output: {
        filename: "bundle.js"   //výstupní balík všech zdrojových kódů
    },
    module: { //sem budeme zanedlouho vkládat transformační moduly
        loaders : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /.scss$/,
                loaders: [ "style", "css", "sass" ],
                exclude: "node_modules"
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};
