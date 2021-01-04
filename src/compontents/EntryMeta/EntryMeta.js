/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import { date } from '@wordpress/date';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

function EntryMeta( { link, date: postDate, authorLink, authorName, url } ) {
	const { settings } = useConfig();
	const { dateFormat } = settings;
	const postDateFormat = date( dateFormat, postDate );
	return (
		<div className="entry-meta">
			<span className="posted-on">
				Posted on{ ' ' }
				<Link to={ link.replace( url, '' ) } rel="bookmark">
					<time
						className="entry-date published"
						dateTime={ postDate }
					>
						{ postDateFormat }
					</time>
				</Link>
			</span>
			<span className="byline">
				{ ' ' }
				by{ ' ' }
				<span className="author vcard">
					<Link
						className="url fn n"
						to={ authorLink.replace( url, '' ) }
					>
						{ authorName }
					</Link>
				</span>
			</span>
		</div>
	);
}

export default EntryMeta;
