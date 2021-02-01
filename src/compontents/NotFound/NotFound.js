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
import { SearchForm } from '../';
import { useBodyClasses } from '../../app/bodyClasses';

function NotFound() {
	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect(() => {
		setupClasses(['error404']);
	}, []);

	return (
		<section className="error-404 not-found">
			<Helmet>
				<title>
					{__("Oops! That page can't be found.", 'wp-react-theme')}
				</title>
			</Helmet>
			<header className="page-header">
				<h1 className="page-title">
					{__("Oops! That page can't be found.", 'wp-react-theme')}
				</h1>
			</header>
			<div className="page-content">
				<p>
					{__(
						'It looks like nothing was found at this location. Maybe try one of the links below or a search?',
						'wp-react-theme'
					)}
				</p>
				<SearchForm />
			</div>
		</section>
	);
}

export default NotFound;
