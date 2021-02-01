/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Context from './context';

function useBodyClasses() {
	return useContext(Context);
}

export default useBodyClasses;
