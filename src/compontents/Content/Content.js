/**
 * Internal dependencies
 */
import { EntryMeta, Image, EntryFooter, PaginationPage } from '../index';
import { useConfig } from '../../app/config';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

function Content( { post, showLink = false, titleLink = true } ) {
	const {
		id,
		link,
		status,
		type,
		title: { rendered: titleRendered },
		content: { rendered: contentRendered },
		date,
		_embedded: embedded,
	} = post;

	const author = embedded?.author?.[ 0 ];
	const featuredmedia = embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
	const terms = embedded?.[ 'wp:term' ];
	const next = embedded?.next?.[ 0 ];
	const previous = embedded?.previous?.[ 0 ];
	const { link: authorLink, name: authorName } = author;
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
							<Link to={ link.replace( url, '' ) } rel="bookmark">
								{ titleRendered }
							</Link>
						</h2>
					) : (
						<h1 className="entry-title">{ titleRendered }</h1>
					) }
				</header>
				<EntryMeta
					link={ link }
					date={ date }
					authorLink={ authorLink }
					authorName={ authorName }
					url={ url }
				/>
				{ featuredmedia && <Image data={ featuredmedia } /> }
				<div
					className="entry-content"
					dangerouslySetInnerHTML={ { __html: contentRendered } }
				/>
				<EntryFooter terms={ terms } postId={ id } url={ url } />
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
