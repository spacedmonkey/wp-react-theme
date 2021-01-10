/**
 * External dependencies
 */
import { Link, useLocation } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function Pagenation( { headers, page } ) {
	const location = useLocation();
	const totalPage = headers?.[ 'x-wp-totalpages' ];
	let backLink = '';
	let forwardLink = '';

	const getLink = ( num ) => {
		let { pathname } = location;
		if ( ! pathname.endsWith( '/' ) ) {
			pathname += '/';
		}
		if ( ! pathname.endsWith( 'page/' + page + '/' ) ) {
			pathname += 'page/' + page + '/';
		}
		pathname = pathname.replace(
			'page/' + page + '/',
			'page/' + ( page + num )
		);
		return pathname.replace( 'page/1', '' );
	};

	if ( page <= totalPage ) {
		// eslint-disable-next-line eqeqeq
		if ( page != totalPage ) {
			backLink = (
				<div className={ 'nav-previous' }>
					<Link to={ getLink( 1 ) }>
						<span className="meta-nav"
							  dangerouslySetInnerHTML={ {
								  __html: '&larr;',
							  } }
						/> { __( 'Older posts', 'wp-react-theme' ) }
					</Link>
				</div>
			);
		}
		if ( page !== 1 ) {
			forwardLink = (
				<div className={ 'nav-next' }>
					<Link to={ getLink( -1 ) }>
						{ __( 'Newer posts', 'wp-react-theme' ) } <span className="meta-nav"
																		dangerouslySetInnerHTML={ {
																			__html: '&rarr;',
																		} }
					/>
					</Link>
				</div>
			);
		}
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

export default Pagenation;
