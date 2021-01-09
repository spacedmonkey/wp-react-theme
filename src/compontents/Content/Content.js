/**
 * Internal dependencies
 */
import {
	EntryMeta,
	Image,
	EntryFooter,
	PaginationPage,
	PasswordForm,
} from '../';
import { isProtected } from '../../utils';
import { useConfig } from '../../app/config';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

function Content( {
	post,
	showLink = false,
	titleLink = true,
	showCommentLink = true,
} ) {
	const {
		id,
		link,
		status,
		type,
		title: { rendered: titleRendered },
		content: { rendered: contentRendered },
		_embedded: embedded,
	} = post;

	const featuredmedia = embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
	const terms = embedded?.[ 'wp:term' ];
	const next = embedded?.next?.[ 0 ];
	const previous = embedded?.previous?.[ 0 ];
	const { metadata } = useConfig();
	const { url } = metadata;
	return (
		<>
			<article
				id={ `post-${ id }` }
				className={ `post-${ id } post hentry type-${ type } status-${ status }` }
			>
				<header className="entry-header">
					{ titleLink ? (
						<h2 className="entry-title">
							<Link
								to={ link.replace( url, '' ) }
								rel="bookmark"
								dangerouslySetInnerHTML={ {
									__html: titleRendered,
								} }
							/>
						</h2>
					) : (
						<h1
							className="entry-title"
							dangerouslySetInnerHTML={ {
								__html: titleRendered,
							} }
						/>
					) }
				</header>
				<EntryMeta post={ post } url={ url } />
				{ featuredmedia && (
					<div className="post-thumbnail">
						<Image data={ featuredmedia } />
					</div>
				) }
				{ ! isProtected( post ) ? (
					<RawHTML className="entry-content">
						{ contentRendered }
					</RawHTML>
				) : (
					<PasswordForm id={ post.id } />
				) }
				<EntryFooter
					terms={ terms }
					post={ post }
					url={ url }
					showCommentLink={ showCommentLink }
				/>
			</article>
			{ showLink && (
				<PaginationPage
					previous={ previous }
					next={ next }
					url={ url }
				/>
			) }
		</>
	);
}

export default Content;
