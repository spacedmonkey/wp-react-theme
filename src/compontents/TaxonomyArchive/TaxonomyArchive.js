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
import { useCallback, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { useBodyClasses } from '../../app/bodyClasses';

function TaxonomyArchive( { restBase, name } ) {
	const {
		actions: { getPosts },
		state: { posts },
	} = useQuery();
	const location = useLocation();
	const { settings } = useConfig();
	const { perPage } = settings;

	const {
		actions: { setupClasses },
	} = useBodyClasses();

	const getNewSlug = useCallback( () => {
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

		return { newSlug, newPage };
	}, [ location ] );

	useEffect( () => {
		const { newSlug, newPage } = getNewSlug();

		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				[ `${ restBase }_slug` ]: newSlug,
				page: newPage,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts, restBase, getNewSlug ] );

	useEffect( () => {
		const { newSlug } = getNewSlug();
		setupClasses( [ 'archive', 'hfeed', name, `${ name }-${ newSlug }` ] );
	}, [ posts, getNewSlug, name ] );

	return <Archive />;
}

export default TaxonomyArchive;
