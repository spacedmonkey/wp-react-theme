/**
 * External dependencies
 */
import { useLocation } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

function Scroll() {
	const location = useLocation();

	useEffect( () => {
		window.scrollTo( 0, 0 );
	}, [ location ] );

	return null;
}
export default Scroll;
