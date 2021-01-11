/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { isProtected, stripHTML } from '../../utils';
import {
	NotFound,
	Loading,
	Content,
	ContentPage,
	Pagination,
	Comments,
} from '../index';

/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from '@wordpress/element';

function Home() {
	const {
		state: { posts, loaded, headers },
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { page = 1 } = params;

	const { metadata, settings } = useConfig();
	const { pageOnFront, perPage } = settings;
	const { name } = metadata;

	useEffect( () => {
		if ( pageOnFront > 0 ) {
			getPosts( {
				path: addQueryArgs( '/wp/v2/pages', {
					include: pageOnFront,
					per_page: perPage,
				} ),
			} );
		} else {
			getPosts( {
				path: addQueryArgs( '/wp/v2/posts', {
					page,
					per_page: perPage,
				} ),
			} );
		}
	}, [ getPosts ] );

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( ! posts ) {
		return <NotFound />;
	}

	if ( pageOnFront ) {
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
				</Helmet>
				<ContentPage post={ post } />
				{ ! isProtected( post ) && <Comments post={ post } /> }
			</>
		);
	} else if ( posts.length ) {
		const postList = posts.map( ( post ) => (
			<Content post={ post } key={ post.id } />
		) );
		return (
			<>
				<Helmet>
					<title>
						{ metadata.name }
						{ ' - ' }
						{ name }
					</title>
					<meta name="description" content={ metadata.description } />
				</Helmet>
				{ postList }
				<Pagination headers={ headers } page={ parseInt( page ) } />
			</>
		);
	}
}

export default Home;
