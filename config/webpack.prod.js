var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        "vendor": "./src/vendor.ts",
        "app": "./src/app/main.ts"
    },
    output: {
        path: "./dist",
        filename: "scripts/[name].[hash].bundle.js",
        //sourceMapFilename: "scripts/[name].[hash].map"
    },
    resolve: {
        extensions: ["", ".js", ".ts"]
    },
    module: {
        loaders: [
            { test: /\.ts/, loaders: ["ts-loader"], exclude: /node_modules/ },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ["raw-loader", "sass-loader"] },
            { test: /\.html$/, loader: "html-loader", exclude: ["src/index.html"] },
            { test: /\.css$/, loader: "style!css" },
            { test: /bootstrap\/js\//, loader: "imports?jQuery=jquery" },
            { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000" },
            { test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: "file" },
			{ test: /\.(png|jpg|gif)$/, loader: "url-loader?limit=50000&name=images/[name].[ext]" },
            { test: /bootstrap-sass\/assets\/javascripts\//, loader: "imports?jQuery=jquery" },
            { test: require.resolve("jquery"), loader: "imports?jQuery=jquery" },
            { test: /jsqrcode-master/, loader: "script-loader" },
			{ test: /google/, loader: "script-loader" },
            { test: /\.swf$/, loader: "file?name=[path][name].[ext]" }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ filename: "index.html", template: "src/index.html", favicon: "src/favicon.ico" }),
        new webpack.optimize.CommonsChunkPlugin({ name: ["app", "vendor"] }),
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false, //prod 
			mangle: { 
				screw_ie8 : true, 
				keep_fnames: true 
			}, //prod 
			compress: { 
				screw_ie8: true 
			}, //prod 
			comments: false //prod 

		})
		//new webpack.optimize.OccurrenceOrderPlugin()
    ],
    htmlLoader: { 
    	minimize: true, 
    	removeAttributeQuotes: false, 
    	caseSensitive: true, 
    	customAttrSurround: [ 
		[/#/, /(?:)/], 
		[/\*/, /(?:)/], 
		[/\[?\(?/, /(?:)/] 
    	], 
    	customAttrAssign: [/\)?\]?=/] 
    },
    devServer: {
        port: 8080,
        historyApiFallback: true
    }
};