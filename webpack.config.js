/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
/**
 * External dependencies
 */
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );

module.exports = {
	...defaultConfig,
	optimization: {
		...defaultConfig.optimization,
		minimizer: [
			...defaultConfig.optimization.minimizer,
			new OptimizeCSSAssetsPlugin( {} ),
		],
	},
};
