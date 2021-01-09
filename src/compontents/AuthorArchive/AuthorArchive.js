/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';

/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { Archive } from '../';

/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from '@wordpress/element';

function AuthorArchive() {
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
				author_slug: slug,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts ] );

	return <Archive />;
}

export default AuthorArchive;
