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
import { useBodyClasses } from '../../app/bodyClasses';

function DateArchive() {
	const {
		actions: { getPosts },
		state: { posts },
	} = useQuery();
	const params = useParams();
	const { year, month = 0, day = 0, page = 1 } = params;

	const { settings } = useConfig();
	const { perPage } = settings;

	const {
		actions: { setupClasses },
	} = useBodyClasses();

	useEffect(() => {
		setupClasses(['archive', 'date', 'hfeed']);
	}, [posts]);

	useEffect(() => {
		getPosts({
			path: addQueryArgs('/wp/v2/posts', {
				year,
				month,
				day,
				page,
				per_page: perPage,
			}),
		});
	}, [getPosts]);

	return <Archive />;
}
export default DateArchive;
