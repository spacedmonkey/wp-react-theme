/**
 * Internal dependencies
 */
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useConfig } from '../../app/config';
import { useComments } from '../../app/comments';
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { date } from '@wordpress/date';

function Comment( { comment, depth, num, status } ) {
	const { settings } = useConfig();
	const { threadComments, dateFormat, timeFormat } = settings;

	const {
		state: { comments, showMainForm },
		actions: { setShowMainForm },
	} = useComments();

	const [ showForm, setShowForm ] = useState( false );

	const commentDateFormat = date( dateFormat, comment.date );
	const commentTimeFormat = date( timeFormat, comment.date );

	const newDepth = depth + 1;
	const isEven = ( n ) => {
		// eslint-disable-next-line eqeqeq
		return n % 2 == 0;
	};

	const oddEvenClass = isEven( num ) ? 'even' : 'odd';
	const replyText = showForm
		? __( 'Cancel reply', 'wp-react-theme' )
		: __( 'Reply', 'wp-react-theme' );

	return (
		<li
			id={ `comment-${ comment.id }` }
			className={ `comment depth-${ depth } ${ oddEvenClass }` }
		>
			<article
				id={ `div-comment-${ comment.id }` }
				className="comment-body"
			>
				<footer className="comment-meta">
					<div className="comment-author vcard">
						<img
							alt=""
							src={ comment.author_avatar_urls[ '24' ] }
							className="avatar avatar-24 photo"
							height="24"
							width="24"
							loading="lazy"
						/>{ ' ' }
						<b className="fn">
							<a
								href={ comment.author_url }
								rel="external nofollow ugc"
								className="url"
							>
								{ comment.author_name }
							</a>
						</b>{ ' ' }
						<span className="says">
							{ __( 'says:', 'wp-react-theme' ) }
						</span>
					</div>

					<div className="comment-metadata">
						<a href={ comment.link }>
							<time dateTime={ comment.date }>
								{ sprintf(
									/* translators: 1: Comment date, 2: Comment time. */
									__( '%1$s at %2$s', 'wp-react-theme' ),
									commentDateFormat,
									commentTimeFormat
								) }
							</time>
						</a>
					</div>

					{ comment.status === 'hold' && (
						<em className="comment-awaiting-moderation">
							{ __(
								'Your comment is awaiting moderation. This is a preview; your comment will be visible after it has been approved. ',
								'wp-react-theme'
							) }
						</em>
					) }
				</footer>
				<div
					className="comment-content"
					dangerouslySetInnerHTML={ {
						__html: comment.content.rendered,
					} }
				/>
				{ threadComments && status === 'open' && (
					<div className="reply">
						<button
							className="comment-reply-link"
							onClick={ () => {
								setShowForm( ! showForm );
								setShowMainForm( ! showMainForm );
							} }
						>
							{ replyText }
						</button>
					</div>
				) }
				{ showForm && (
					<CommentForm
						post={ comment.post }
						parent={ comment.id }
						onComplete={ () => {
							setShowForm( false );
							setShowMainForm( true );
						} }
					/>
				) }
			</article>
			<CommentList
				className="children"
				comments={ comments }
				parent={ comment.id }
				status={ status }
				depth={ newDepth }
			/>
		</li>
	);
}
export default Comment;
