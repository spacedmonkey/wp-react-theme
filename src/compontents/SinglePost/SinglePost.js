/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { stripHTML } from '../../utils';
import { NotFound, Loading, Content, Comments } from '../index';

/**
 * External dependencies
 */
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

function SinglePost() {
	const {
		state: { posts, loading, loaded },
		actions: { getPosts },
	} = useQuery();
	const { postSlug } = useParams();

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				slug: postSlug,
				per_page: 1,
			} ),
		} );
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
				<Content post={ post } showLink={ true } titleLink={ false } />
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

export default SinglePost;
