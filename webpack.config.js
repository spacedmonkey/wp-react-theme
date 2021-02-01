/**
 * WordPress dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
/**
 * External dependencies
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackRTLPlugin = require('webpack-rtl-plugin');
const WebpackBar = require('webpackbar');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		theme: path.resolve(process.cwd(), 'src', 'theme.js'),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(process.cwd(), 'assets'),
	},
	optimization: {
		...defaultConfig.optimization,
		minimizer: [
			...defaultConfig.optimization.minimizer,
			new OptimizeCSSAssetsPlugin({}),
		],
		splitChunks: {
			...defaultConfig.optimization.splitChunks,
			cacheGroups: {
				...defaultConfig.optimization.splitChunks.cacheGroups,
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					enforce: true,
				},
			},
		},
	},
	plugins: [
		...defaultConfig.plugins,
		new WebpackRTLPlugin({
			filename: 'theme-rtl.css',
		}),
		new WebpackBar({
			name: 'Theme',
			color: '#fddb33',
		}),
	],
};
