/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { Content, NotFound, Loading, Pagination, PageHeader } from '../index';

/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

function Search() {
	const {
		state: { posts, loaded, headers },
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { searchTerm, page = 1 } = params;
	const { settings } = useConfig();
	const { perPage } = settings;

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				search: searchTerm,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts ] );

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( posts.length < 1 ) {
		return <NotFound />;
	}

	const postList = posts.map( ( post ) => (
		<Content post={ post } key={ post.id } />
	) );

	const searchTitle = sprintf(
		/* translators: 1: Search term. */
		__( 'Search Results for: %s', 'wp-react-theme' ),
		searchTerm
	);
	const searchDescription = '';
	return (
		<>
			<Helmet>
				<title>{ searchTitle }</title>
			</Helmet>
			<PageHeader
				title={ searchTitle }
				description={ searchDescription }
			/>
			{ postList }
			<Pagination headers={ headers } page={ parseInt( page ) } />
		</>
	);
}

export default Search;
