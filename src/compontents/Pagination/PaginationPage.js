/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

function PaginationPage( { previous, next, url } ) {
	let backLink = '';
	let forwardLink = '';

	if ( previous ) {
		backLink = (
			<div className={ 'nav-previous' }>
				<Link to={ previous.link.replace( url, '' ) } rel="prev">
					<span className="nav-subtitle">
						{ __( 'Previous: ', 'wp-react-theme' ) }
					</span>
					<span className="nav-subtitle">
						{ __( 'Previous: ', 'wp-react-theme' ) }
					</span>
					<span
						className="nav-title"
						dangerouslySetInnerHTML={ {
							__html: previous.title.rendered,
						} }
					/>
				</Link>
			</div>
		);
	}

	if ( next ) {
		forwardLink = (
			<div className={ 'nav-next' }>
				<Link to={ next.link.replace( url, '' ) } rel="next">
					<span className="nav-subtitle">
						{ __( 'Next: ', 'wp-react-theme' ) }
					</span>
					<span
						className="nav-title"
						dangerouslySetInnerHTML={ {
							__html: next.title.rendered,
						} }
					/>
				</Link>
			</div>
		);
	}

	return (
		<nav
			className="navigation posts-navigation"
			role="navigation"
			aria-label={ __( 'Posts', 'wp-react-theme' ) }
		>
			<h2 className="screen-reader-text">
				{ __( 'Posts navigation', 'wp-react-theme' ) }
			</h2>
			<div className={ 'nav-links' }>
				{ backLink }
				{ forwardLink }
			</div>
		</nav>
	);
}

export default PaginationPage;
