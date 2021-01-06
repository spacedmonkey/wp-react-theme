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
import { Loading, PageHeader, Pagination, NotFound, Content } from '../index';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

function DateArchive() {
	const {
		state: { posts, loaded, headers },
		actions: { getPosts },
	} = useQuery();
	const params = useParams();
	const { year, month = 0, day = 0, page = 1 } = params;

	const { settings } = useConfig();
	const { perPage } = settings;

	useEffect( () => {
		getPosts( {
			path: addQueryArgs( '/wp/v2/posts', {
				year,
				month,
				day,
				page,
				per_page: perPage,
			} ),
		} );
	}, [ getPosts ] );

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( posts.length < 1 ) {
		return <NotFound />;
	}

	const postList = posts.map( ( post ) => (
		<Content post={ post } key={ post.id } />
	) );

	const dataTitle = headers?.[ 'x-wp-archive-header' ]
		? headers?.[ 'x-wp-archive-header' ]
		: '';
	const dateDescription = headers?.[ 'x-wp-archive-description' ]
		? headers?.[ 'x-wp-archive-description' ]
		: '';

	return (
		<>
			<Helmet>
				<title>{ dataTitle }</title>
			</Helmet>
			<PageHeader title={ dataTitle } description={ dateDescription } />
			{ postList }
			<Pagination headers={ headers } page={ parseInt( page ) } />
		</>
	);
}
export default DateArchive;
