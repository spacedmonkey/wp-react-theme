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
import { useBodyClasses } from '../../app/bodyClasses';

function Search() {
	const {
		actions: { getPosts },
		state: { posts },
	} = useQuery();
	const params = useParams();
	const { searchTerm, page = 1 } = params;
	const { settings } = useConfig();
	const { perPage } = settings;

	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect(() => {
		getPosts({
			path: addQueryArgs('/wp/v2/posts', {
				search: searchTerm,
				page,
				per_page: perPage,
			}),
		});
	}, [getPosts]);

	useEffect(() => {
		setupClasses(['search', 'search-result', 'hfeed']);
	}, [posts]);

	return <Archive />;
}

export default Search;
