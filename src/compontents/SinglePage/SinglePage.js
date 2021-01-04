/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { stripHTML } from '../../utils';
import { NotFound, Loading, ContentPage, Comments } from '../index';

/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

function SinglePage() {
	const {
		state: { posts, loading, loaded },
		actions: { getPosts },
	} = useQuery();
	const location = useLocation();

	useEffect( () => {
		const pieces = location.pathname.split( '/' );
		const filtered = pieces.filter( Boolean );
		const pageSlug = filtered.pop();
		if ( pageSlug ) {
			getPosts( {
				path: addQueryArgs( '/wp/v2/pages', {
					slug: pageSlug,
					perPage: 1,
				} ),
			} );
		}
	}, [ getPosts ] );

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts.length ) {
		const post = posts[ 0 ];
		return (
			<>
				<Helmet>
					<title>{ post.title.rendered }</title>
					<link rel="canonical" href={ post.link } />
					<link rel="shortlink" href={ post.guid.rendered } />
					<meta
						name="description"
						content={ stripHTML( post.excerpt.rendered ) }
					/>
					<link
						rel="alternate"
						type="application/json"
						href={ post._links.self[ 0 ].href }
					/>
				</Helmet>
				<ContentPage post={ post } />
				<Comments
					title={ post.title.rendered }
					status={ post.comment_status }
					postId={ post.id }
				/>
			</>
		);
	}

	return <NotFound />;
}

export default SinglePage;
