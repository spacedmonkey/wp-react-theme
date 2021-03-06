/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { StrictMode } from '@wordpress/element';
import { render } from 'react-dom';

/**
 * Internal dependencies
 */
import './theme.css';
import { App } from './app';
import { domReady } from './utils';

// eslint-disable-next-line camelcase,no-undef
__webpack_public_path__ = window.react_theme_settings.config.assetPath;

const initialize = () => {
	const config = window?.react_theme_settings;
	render(
		<StrictMode>
			<App config={config} />
		</StrictMode>,
		document.getElementById('page')
	);
};

domReady(initialize);
