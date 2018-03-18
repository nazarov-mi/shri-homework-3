const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: ['babel-polyfill', './src/app.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': __dirname + '/src'
		}
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['env']
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /^bundle\.js$/,
			minimize: true
		})
	]
}