/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

function Footer() {
	const { config } = useConfig();
	const { theme } = config;

	return (
		<footer id="colophon" className="site-footer">
			<div className="site-info">
				<a href={ __( 'https://wordpress.org/', 'wp-react-theme' ) }>
					{ sprintf(
						/* translators: %s: CMS name, i.e. WordPress. */
						__( 'Proudly powered by %s', 'wp-react-theme' ),
						'WordPress'
					) }
				</a>
				<span className="sep"> | </span>
				{ createInterpolateElement(
					sprintf(
						/* translators: 1: Theme name, 2: Theme author. */
						__( 'Theme: %1$s by <a>%2$s</a>.', 'wp-react-theme' ),
						theme.name,
						theme.author
					),
					// eslint-disable-next-line jsx-a11y/anchor-has-content
					{ a: <a href={ theme.authorUri } /> }
				) }
			</div>
		</footer>
	);
}

export default Footer;
