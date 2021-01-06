/**
 * WordPress dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

/**
 * Internal dependencies
 */
import { commentsOpen, isProtected } from '../../utils';
import { createInterpolateElement } from '@wordpress/element';

function EntryFooter( { terms, post, url, showCommentLink = true } ) {
	const dataTerm = {
		category: [],
		post_tag: [],
	};

	const { id } = post;

	terms.forEach( function ( tax ) {
		tax.forEach( function ( term ) {
			dataTerm[ term.taxonomy ].push( term );
		} );
	} );

	const catList = dataTerm.category.map( ( term ) => (
		<span key={ `cat-link-${ term.id }` }>
			<Link to={ term.link.replace( url, '' ) }>{ term.name }</Link>,{ ' ' }
		</span>
	) );

	const tagList = dataTerm.post_tag.map( ( term ) => (
		<span key={ `tags-links-${ term.id }` }>
			<Link to={ term.link.replace( url, '' ) }>{ term.name }</Link>,{ ' ' }
		</span>
	) );

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
		<footer className="entry-footer" key={ `post-${ id }` }>
			{ dataTerm.category.length > 0 && (
				<span className="cat-links" key={ `cat-links-${ id }` }>
					{ __( 'Posted in ', 'wp-react-theme' ) }
					{ catList }
				</span>
			) }
			{ dataTerm.post_tag.length > 0 && tagList && (
				<span className="tags-links" key={ `tags-links-${ id }` }>
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
