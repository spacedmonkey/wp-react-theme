/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { stripHTML } from '../../utils';
import { NotFound, Loading, Content, ContentPage, Pagination } from '../index';

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
		state: { posts, loading, loaded, headers },
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { page = 1 } = params;

	const { metadata, settings } = useConfig();
	const { pageOnFront, perPage } = settings;

	useEffect( () => {
		if ( pageOnFront > 0 ) {
			getPosts( {
				path: 'wp/v2/pages/' + pageOnFront,
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

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts ) {
		if ( pageOnFront && posts.id ) {
			return (
				<>
					<Helmet>
						<title>{ posts.title.rendered }</title>
						<link rel="canonical" href={ posts.link } />
						<link rel="shortlink" href={ posts.guid.rendered } />
						<meta
							name="description"
							content={ stripHTML( posts.excerpt.rendered ) }
						/>
						<link
							rel="alternate"
							type="application/json"
							href={ posts._links.self[ 0 ].href }
						/>
					</Helmet>
					<ContentPage post={ posts } />
				</>
			);
		} else if ( posts.length ) {
			const postList = posts.map( ( post ) => (
				<Content post={ post } key={ post.id } />
			) );
			return (
				<>
					<Helmet>
						<title>{ metadata.name }</title>
						<meta
							name="description"
							content={ metadata.description }
						/>
					</Helmet>
					{ postList }
					<Pagination headers={ headers } page={ parseInt( page ) } />
				</>
			);
		}
	}

	return <NotFound />;
}

export default Home;
