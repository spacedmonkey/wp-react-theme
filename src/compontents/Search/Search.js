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
import { createInterpolateElement, useEffect } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

function Search() {
	const {
		state: { posts, loading, loaded, headers },
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

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts.length ) {
		const postList = posts.map( ( post ) => (
			<Content post={ post } key={ post.id } />
		) );

		const searchTitle = createInterpolateElement(
			sprintf(
				/* translators: 1: Search term. */
				__( 'Search Results for: <span>%s</span>', 'wp-react-theme' ),
				searchTerm
			),
			{ span: <span /> }
		);
		const searchDescription = '';
		return (
			<>
				<Helmet>
					<title>
						{ sprintf(
							/* translators: 1: Search term. */
							__( 'Search Results for: %s', 'wp-react-theme' ),
							searchTerm
						) }
					</title>
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

	return <NotFound />;
}

export default Search;
