/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useBodyClasses } from '../../app/bodyClasses';
import { isProtected, stripHTML } from '../../utils';
import { useConfig } from '../../app/config';
import { NotFound, Loading, ContentPage, Comments } from '../';

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
		state: { posts, loaded },
		actions: { getPosts },
	} = useQuery();
	const location = useLocation();

	const { metadata, config } = useConfig();
	const { name } = metadata;
	const { embedAPI } = config;

	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect( () => {
		const pieces = location.pathname.split( '/' );
		const filtered = pieces.filter( Boolean );
		const pageSlug = filtered.pop();
		if ( pageSlug ) {
			getPosts( {
				path: addQueryArgs( '/wp/v2/pages', {
					slug: pageSlug,
					per_page: 1,
				} ),
			} );
		}
	}, [ getPosts ] );

	useEffect( () => {
		if ( posts.length === 1 ) {
			const post = posts[ 0 ];
			const template = post.template ? post.template : 'default';
			setupClasses( [
				'page',
				`page-id-${ post.id }`,
				`page-template-${ template }`,
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
			<ContentPage post={ post } />
			{ ! isProtected( post ) && <Comments post={ post } /> }
		</>
	);
}

export default SinglePage;
