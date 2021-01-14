/**
 * WordPress dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';
import { createInterpolateElement, useMemo } from '@wordpress/element';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

/**
 * Internal dependencies
 */
import { commentsOpen, isProtected } from '../../utils';

const termList = ( termArray, prefix, url ) => {
	return termArray.map( ( { id, link, name }, index ) => (
		<span key={ `${ prefix }-link-${ id }` }>
			<Link to={ link.replace( url, '' ) }>{ name }</Link>
			{ index !== termArray.length - 1 && ', ' }
		</span>
	) );
};

function EntryFooter( { terms, post, url, showCommentLink = true } ) {
	const { id: postId } = post;

	let termArray = [];

	if ( terms ) {
		termArray = terms.flat();
	}

	const catList = useMemo( () => {
		const categories = termArray.filter( ( term ) => {
			return term.taxonomy === 'category';
		} );
		return termList( categories, 'cat', url );
	}, [ termArray ] );
	const tagList = useMemo( () => {
		const postTag = termArray.filter( ( term ) => {
			return term.taxonomy === 'post_tag';
		} );
		return termList( postTag, 'tag', url );
	}, [ termArray ] );

	let commentLink = '';
	if ( showCommentLink && commentsOpen( post ) && ! isProtected( post ) ) {
		let commentText = '';
		if ( ! post.comment_count ) {
			commentText = __( 'Leave a Comment', 'wp-react-theme' );
		} else {
			commentText = sprintf(
				/* translators: 1: Comment count */
				_n(
					'%d Comment',
					'%d Comments',
					post.comment_count,
					'wp-react-theme'
				),
				post.comment_count
			);
		}
		commentLink = createInterpolateElement(
			sprintf(
				/* translators: 1: Comment link text, 2: Title of post */
				__( '<a>%1$s <span> on %2$s</span></a>', 'wp-react-theme' ),
				commentText,
				post.title.rendered
			),
			{
				span: <span className="screen-reader-text" />,
				a: (
					<Link
						to={ {
							pathname: post.link.replace( url, '' ),
							hash: '#respond',
						} }
					/>
				),
			}
		);
	}

	return (
		<footer className="entry-footer" key={ `post-${ postId }` }>
			{ catList.length > 0 && (
				<span className="cat-links" key={ `cat-links-${ postId }` }>
					{ __( 'Posted in ', 'wp-react-theme' ) }
					{ catList }
				</span>
			) }
			{ tagList.length > 0 && (
				<span className="tags-links" key={ `tags-links-${ postId }` }>
					{ __( 'Tagged in ', 'wp-react-theme' ) }
					{ tagList }
				</span>
			) }
			{ commentLink && (
				<span className="comments-link">{ commentLink }</span>
			) }
		</footer>
	);
}

export default EntryFooter;
