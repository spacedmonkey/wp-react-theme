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

function TaxonomyArchive( { taxononmy, restBase, taxLabel } ) {
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
				[ `${ restBase }_slug` ]: slug,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts, restBase ] );

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts.length ) {
		const postList = posts.map( ( post ) => (
			<Content post={ post } key={ post.id } />
		) );

		const terms = posts[ 0 ]._embedded[ 'wp:term' ];
		let termTitle = '';
		let termDescription = '';
		if ( terms ) {
			const term = terms.flat().filter( ( cat ) => {
				return cat.slug === slug && cat.taxonomy === taxononmy;
			} );

			if ( term && term.length ) {
				termTitle = sprintf(
					/* translators: 1: Taxonony single name, 2: Term name */
					__( '%1$s: %2$s', 'wp-react-theme' ),
					taxLabel,
					term[ 0 ].name
				);
				termDescription = term[ 0 ].description;
			}
		}
		return (
			<>
				<Helmet>
					<title>{ termTitle }</title>
					<meta name="description" content={ termDescription } />
				</Helmet>
				<PageHeader
					title={ termTitle }
					description={ termDescription }
				/>
				{ postList }
				<Pagination headers={ headers } page={ parseInt( page ) } />
			</>
		);
	}

	return <NotFound />;
}

export default TaxonomyArchive;
