/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { Archive } from '../index';
/**
 * External dependencies
 */
import { useLocation } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

function TaxonomyArchive( { restBase } ) {
	const {
		actions: { getPosts },
	} = useQuery();
	const location = useLocation();
	const { settings } = useConfig();
	const { perPage } = settings;

	useEffect( () => {
		let pieces = location.pathname.split( '/' );
		pieces = pieces.filter( Boolean );
		pieces = pieces.slice( 2, pieces.length );
		let newSlug = '';
		let newPage = 1;
		if ( pieces.length >= 3 && 'page' === pieces[ pieces.length - 2 ] ) {
			newPage = pieces.pop();
			pieces.pop();
			newSlug = pieces.pop();
		} else {
			newSlug = pieces.pop();
		}

		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				[ `${ restBase }_slug` ]: newSlug,
				page: newPage,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts, restBase, location ] );

	return <Archive />;
}

export default TaxonomyArchive;
