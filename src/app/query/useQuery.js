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

function useQuery() {
	return useContext( Context );
}

export default useQuery;
