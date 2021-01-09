/**
 * External dependencies
 */
import { useParams } from 'react-router-dom';

/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';
import { useConfig } from '../../app/config';
import { Archive } from '../index';
/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

function DateArchive() {
	const {
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

	return <Archive />;
}
export default DateArchive;
