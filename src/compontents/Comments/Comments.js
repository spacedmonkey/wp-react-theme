/**
 * Internal dependencies
 */
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useConfig } from '../../app/config';
import { useQuery } from '../../app/query';
import { useComments } from '../../app/comments';
import { commentsOpen } from '../../utils';
/**
 * WordPress dependencies
 */
import { sprintf, _nx, __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

function Comments({ post }) {
	const {
		state: { comments, loaded, showMainForm },
		actions: { getComments },
	} = useComments();

	const {
		state: { password },
	} = useQuery();

	const { settings } = useConfig();
	const { commentOrder } = settings;

	const {
		id,
		title: { rendered: postTitle },
	} = post;

	useEffect(() => {
		getComments(id, commentOrder, password);
	}, []);

	if (!loaded) {
		return null;
	}

	const commentTitle = sprintf(
		/* translators: 1: comment count number, 2: title. */
		_nx(
			'%1$s thought on "%2$s"',
			'%1$s thoughts on "%2$s"',
			comments.length,
			'comments title',
			'wp-react-theme'
		),
		comments.length,
		postTitle
	);

	return (
		<div id="comments" className="comments-area">
			{comments.length > 0 && (
				<h2
					className="comments-title"
					dangerouslySetInnerHTML={{ __html: commentTitle }}
				/>
			)}
			{comments.length > 0 && (
				<>
					<CommentList comments={comments} post={post} />
					{commentsOpen(post) && (
						<p className="no-comments">
							{__('Comments are closed.', 'wp-react-theme')}
						</p>
					)}
				</>
			)}
			{showMainForm && commentsOpen(post) && <CommentForm post={post} />}
		</div>
	);
}

export default Comments;
