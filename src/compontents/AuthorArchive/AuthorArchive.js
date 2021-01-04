/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { stripHTML } from '../../utils';
import { Content, NotFound, Loading, Pagination, PageHeader } from '../index';
/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { createInterpolateElement, useEffect } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

function AuthorArchive() {
	const {
		state: { posts, loading, loaded, headers },
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

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts.length ) {
		const postList = posts.map( ( post ) => (
			<Content post={ post } key={ post.id } />
		) );
		const author = posts[ 0 ]._embedded.author[ 0 ];
		let authorTitle = '';
		let authorDescription = '';
		if ( author ) {
			authorTitle = createInterpolateElement(
				sprintf(
					/* translators: 1: Title. */
					__( 'Author: <span>%s</span>', 'wp-react-theme' ),
					author.name
				),
				{ span: <span /> }
			);
			authorDescription = author.description;
		}
		return (
			<>
				<Helmet>
					<title>
						{ sprintf(
							/* translators: 1: Title. */
							__( 'Author: %s', 'wp-react-theme' ),
							author.name
						) }
					</title>
					<meta
						name="description"
						content={ stripHTML( authorDescription ) }
					/>
				</Helmet>
				<PageHeader
					title={ authorTitle }
					description={ authorDescription }
				/>
				{ postList }
				<Pagination headers={ headers } page={ parseInt( page ) } />
			</>
		);
	}

	return <NotFound />;
}

export default AuthorArchive;
