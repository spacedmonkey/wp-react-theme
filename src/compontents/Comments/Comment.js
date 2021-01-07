/**
 * Internal dependencies
 */
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useConfig } from '../../app/config';
import { useComments } from '../../app/comments';
import { commentsOpen, isEven } from '../../utils';
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useMemo, RawHTML } from '@wordpress/element';

function Comment( { comment, depth, num, post } ) {
	const { settings, state } = useConfig();
	const {
		threadComments,
		commentRegistration,
		threadCommentsDepth,
		showAvatars,
	} = settings;
	const { isLogged } = state;

	const {
		state: { comments, showMainForm },
		actions: { setShowMainForm },
	} = useComments();

	const [ showForm, setShowForm ] = useState( false );

	const {
		date_time: {
			date: { rendered: commentDateFormat },
			time: { rendered: commentTimeFormat },
		},
	} = comment;

	const newDepth = depth + 1;

	const oddEvenClass = useMemo( () => {
		return isEven( num ) ? 'even' : 'odd';
	}, [ num ] );

	const replyText = showForm
		? __( 'Cancel reply', 'wp-react-theme' )
		: __( 'Reply', 'wp-react-theme' );

	let showReply = false;
	if ( threadComments && commentsOpen( post ) ) {
		showReply = true;
	}
	if ( commentRegistration && ! isLogged ) {
		showReply = false;
	}
	if ( depth > threadCommentsDepth ) {
		showReply = false;
	}

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
						{ showAvatars && (
							<>
								<img
									alt=""
									src={ comment.author_avatar_urls[ '24' ] }
									className="avatar avatar-24 photo"
									height="24"
									width="24"
									loading="lazy"
								/>{ ' ' }
							</>
						) }
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
				<RawHTML className="comment-content">
					{ comment.content.rendered }
				</RawHTML>

				{ showReply && (
					<div className="reply">
						<button
							className="comment-reply-link"
							onClick={ () => {
								setShowForm( ! showForm );
								setShowMainForm( {
									showMainForm: ! showMainForm,
								} );
							} }
						>
							{ replyText }
						</button>
					</div>
				) }
				{ showForm && (
					<CommentForm
						post={ post }
						parent={ comment.id }
						onComplete={ () => {
							setShowForm( false );
							setShowMainForm( { showMainForm: true } );
						} }
					/>
				) }
			</article>
			<CommentList
				className="children"
				comments={ comments }
				parent={ comment.id }
				post={ post }
				depth={ newDepth }
			/>
		</li>
	);
}
export default Comment;
