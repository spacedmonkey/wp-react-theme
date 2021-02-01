/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { Helmet } from 'react-helmet';
/**
 * Internal dependencies
 */
import { useBodyClasses } from '../../app/bodyClasses';

function Loading() {
	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect(() => {
		setupClasses(['loading']);
	}, []);

	return (
		<div className={`loading-message`}>
			<Helmet>
				<title>{__('Loading…', 'wp-react-theme')}</title>
			</Helmet>
			<h4>{__('Loading…', 'wp-react-theme')}</h4>
		</div>
	);
}

export default Loading;
