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

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

const initialize = () => {
	const config = window?.react_theme_settings;
	render(
		<StrictMode>
			<App config={ config } />
		</StrictMode>,
		document.getElementById( 'page' )
	);
};

domReady( initialize );
