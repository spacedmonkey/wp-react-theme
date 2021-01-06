/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { stripHTML } from '../../utils';
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
import { addQueryArgs } from '@wordpress/url';

function TaxonomyArchive( { restBase } ) {
	const {
		state: { posts, loaded, headers },
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { slug, page = 1 } = params;

	const { settings } = useConfig();
	const { perPage } = settings;

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				[ `${ restBase }_slug` ]: slug,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts, restBase ] );

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( posts.length < 1 ) {
		return <NotFound />;
	}

	const postList = posts.map( ( post ) => (
		<Content post={ post } key={ post.id } />
	) );

	const termTitle = headers?.[ 'x-wp-archive-header' ]
		? headers?.[ 'x-wp-archive-header' ]
		: '';
	const termDescription = headers?.[ 'x-wp-archive-description' ]
		? headers?.[ 'x-wp-archive-description' ]
		: '';

	return (
		<>
			<Helmet>
				<title>{ termTitle }</title>
				<meta
					name="description"
					content={ stripHTML( termDescription ) }
				/>
			</Helmet>
			<PageHeader title={ termTitle } description={ termDescription } />
			{ postList }
			<Pagination headers={ headers } page={ parseInt( page ) } />
		</>
	);
}

export default TaxonomyArchive;
