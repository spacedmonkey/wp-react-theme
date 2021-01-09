/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { stripHTML } from '../../utils';
import { Content, NotFound, Loading, Pagination, PageHeader } from '../index';
/**
 * External dependencies
 */
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

function Archive() {
	const {
		state: { posts, loaded, headers },
	} = useQuery();

	const params = useParams();
	const { page = 1 } = params;

	if ( ! loaded ) {
		return <Loading />;
	}

	if ( posts.length < 1 ) {
		return <NotFound />;
	}

	const postList = posts.map( ( post ) => (
		<Content post={ post } key={ post.id } />
	) );

	const archiveTitle = headers?.[ 'x-wp-archive-header' ]
		? headers?.[ 'x-wp-archive-header' ]
		: '';
	const archiveDescription = headers?.[ 'x-wp-archive-description' ]
		? headers?.[ 'x-wp-archive-description' ]
		: '';

	return (
		<>
			<Helmet>
				<title>{ archiveTitle }</title>
				<meta
					name="description"
					content={ stripHTML( archiveDescription ) }
				/>
			</Helmet>
			<PageHeader
				title={ archiveTitle }
				description={ archiveDescription }
			/>
			{ postList }
			<Pagination headers={ headers } page={ parseInt( page ) } />
		</>
	);
}

export default Archive;
