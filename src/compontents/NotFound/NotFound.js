/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { Helmet } from 'react-helmet';

function NotFound() {
	return (
		<section className="error-404 not-found">
			<Helmet>
				<title>
					{ __(
						"Oops! That page can't be found.",
						'wp-react-theme'
					) }
				</title>
			</Helmet>
			<header className="page-header">
				<h1 className="page-title">
					{ __(
						"Oops! That page can't be found.",
						'wp-react-theme'
					) }
				</h1>
			</header>
			<div className="page-content">
				<p>
					{ __(
						'It looks like nothing was found at this location.',
						'wp-react-theme'
					) }
				</p>
			</div>
		</section>
	);
}

export default NotFound;
