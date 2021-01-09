/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { Archive } from '../index';
/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

function TaxonomyArchive( { restBase } ) {
	const {
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { slug, page = 1 } = params;

	const { settings } = useConfig();
	const { perPage } = settings;

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				[ `${ restBase }_slug` ]: slug,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts, restBase ] );

	return <Archive />;
}

export default TaxonomyArchive;
