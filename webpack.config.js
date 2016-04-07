var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        "vendor": "./src/vendor.ts",
        "app": "./src/app/main.ts"
    },
    output: {
        path: "./dist",
        filename: "scripts/[name].bundle.js",
        sourceMapFilename: "[name].map",
    },
    resolve: {
        extensions: ["", ".js", ".ts"]
    },
    module: {
        loaders: [
            { test: /\.ts/, loaders: ["ts-loader"], exclude: /node_modules/ },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ["raw-loader", "sass-loader", "resolve-url"] },
            { test: /\.html$/, loader: "raw-loader", exclude: ["src/index.html"] },
            { test: /\.css$/, loader: "style!css" },
            { test: /bootstrap\/js\//, loader: "imports?jQuery=jquery" },
            { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000" },
            { test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: "file" },
            { test: /bootstrap-sass\/assets\/javascripts\//, loader: "imports?jQuery=jquery" },
            { test: require.resolve("jquery"), loader: "imports?jQuery=jquery" },
            { test: /jsqrcode-master/, loader: "script-loader" },
            { test: /\.swf$/, loader: "file?name=[path][name].[ext]" }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ filename: "index.html", template: "src/index.html" }),
        new webpack.optimize.CommonsChunkPlugin({ name: ["app", "vendor"] }),
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" })
    ]
};