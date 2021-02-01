/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { stripHTML, isProtected } from '../../utils';
import { NotFound, Loading, Content, Comments } from '../';

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
import { useBodyClasses } from '../../app/bodyClasses';

function SinglePost() {
	const {
		state: { posts, loaded },
		actions: { getPosts },
	} = useQuery();
	const { postSlug } = useParams();

	const { metadata, config } = useConfig();
	const { name } = metadata;
	const { embedAPI } = config;

	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				slug: postSlug,
				per_page: 1,
			} ),
		} );
	}, [ getPosts ] );

	useEffect( () => {
		if ( posts.length === 1 ) {
			const post = posts[ 0 ];
			const template = post.template ? post.template : 'default';
			setupClasses( [
				'single',
				`single-${ post.type }`,
				`postid-${ post.id }`,
				`single-format-${ post.format }`,
				`single-template-${ template }`,
			] );
		}
	}, [ posts ] );

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( posts.length < 1 ) {
		return <NotFound />;
	}

	const post = posts[ 0 ];

	return (
		<>
			<Helmet>
				<title>
					{ post?.title.rendered }
					{ ' - ' }
					{ name }
				</title>
				<link rel="canonical" href={ post?.link } />
				<link rel="shortlink" href={ post?.guid.rendered } />
				<meta
					name="description"
					content={ stripHTML( post?.excerpt.rendered ) }
				/>
				<link
					rel="alternate"
					type="application/json"
					href={ post._links.self[ 0 ].href }
				/>
				<link
					rel="alternate"
					type="application/json+oembed"
					href={ addQueryArgs( embedAPI, {
						url: post?.link,
					} ) }
				/>
				<link
					rel="alternate"
					type="text/xml+oembed"
					href={ addQueryArgs( embedAPI, {
						url: post?.link,
						format: 'xml',
					} ) }
				/>
			</Helmet>
			<Content
				post={ post }
				showLink={ true }
				showCommentLink={ false }
				titleLink={ false }
			/>
			{ ! isProtected( post ) && <Comments post={ post } /> }
		</>
	);
}

export default SinglePost;
