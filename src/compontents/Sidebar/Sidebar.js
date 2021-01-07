/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { useHistory } from 'react-router-dom';

function Sidebar() {
	const { furniture, metadata } = useConfig();
	const { sidebar } = furniture;
	const { url } = metadata;

	const history = useHistory();

	useEffect( () => {
		const links = document.querySelectorAll(
			`#secondary a[href^='${ url }']`
		);
		Array.from( links ).forEach( ( link ) => {
			link.addEventListener( 'click', ( evt ) => {
				if ( evt ) {
					evt.preventDefault();
					history.push( link.href.replace( url, '' ) );
				}
			} );
		} );
	}, [ history ] );

	if ( ! sidebar ) {
		return null;
	}

	return (
		<aside
			id="secondary"
			className="widget-area"
			dangerouslySetInnerHTML={ { __html: sidebar } }
		/>
	);
}
export default Sidebar;
