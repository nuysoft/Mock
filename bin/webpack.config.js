var webpack = require('webpack');
var NODE_ENV = process.env.NODE_ENV;
var plugins = [];
var config = {
	entry:'./src/mock.js',
	output:{
		path: './dist',
    filename: 'mock.js',
    library: 'Mock',
    libraryTarget: 'umd'
	}
};

if (NODE_ENV === 'product') {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		minimize: true
	}));
	config.output.filename = 'mock-min.js';
	config.devtool = 'source-map';
	config.plugins = plugins;
}

module.exports = config;
