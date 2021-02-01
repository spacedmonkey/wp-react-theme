/**
 * External dependencies
 */
import { Link } from 'react-router-dom';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function EntryMeta({ post, url }) {
	const {
		link,
		date,
		date_time: {
			date: { rendered: postDateFormat },
		},
		_embedded: embedded,
	} = post;
	const author = embedded?.author?.[0];
	const { link: authorLink, name: authorName } = author;

	return (
		<div className="entry-meta">
			<span className="posted-on">
				{__('Posted on', 'wp-react-theme')}{' '}
				<Link to={link.replace(url, '')} rel="bookmark">
					<time className="entry-date published" dateTime={date}>
						{postDateFormat}
					</time>
				</Link>
			</span>
			<span className="byline">
				{__(' by ', 'wp-react-theme')}
				<span className="author vcard">
					<Link className="url fn n" to={authorLink.replace(url, '')}>
						{authorName}
					</Link>
				</span>
			</span>
		</div>
	);
}

export default EntryMeta;
