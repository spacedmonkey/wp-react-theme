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
import { sprintf, __, _x } from '@wordpress/i18n';
import { date } from '@wordpress/date';

function DateArchive() {
	const {
		state: { posts, loading, loaded, headers },
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

	if ( loading ) {
		return <Loading />;
	}

	if ( loaded && posts.length ) {
		const postList = posts.map( ( post ) => (
			<Content post={ post } key={ post.id } />
		) );

		let dateString = '';
		let dateRaw = '';
		let dateFormat = '';

		if ( year ) {
			/* translators: 1: Year */
			dateString = __( 'Year: %s', 'wp-react-theme' );
			dateRaw = `${ year }-01-01`;
			dateFormat = _x(
				'Y',
				'yearly archives date format',
				'wp-react-theme'
			);
			if ( month ) {
				/* translators: 1: Year, month */
				dateString = __( 'Month: %s', 'wp-react-theme' );
				dateRaw = `${ year }-${ month }-01`;
				dateFormat = _x(
					'F Y',
					'monthly archives date format',
					'wp-react-theme'
				);
				if ( day ) {
					/* translators: 1: Year,Month, Day */
					dateString = __( 'Day: %s ', 'wp-react-theme' );
					dateRaw = `${ year }-${ month }-${ day }`;
					dateFormat = _x(
						'F j, Y',
						'daily archives date format',
						'wp-react-theme'
					);
				}
			}
		}
		const dataTitle = sprintf( dateString, date( dateFormat, dateRaw ) );
		const dateDescription = '';

		return (
			<>
				<Helmet>
					<title>{ dataTitle }</title>
				</Helmet>
				<PageHeader
					title={ dataTitle }
					description={ dateDescription }
				/>
				{ postList }
				<Pagination headers={ headers } page={ parseInt( page ) } />
			</>
		);
	}

	return <NotFound />;
}

export default DateArchive;
