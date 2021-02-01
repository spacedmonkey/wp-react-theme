/**
 * Internal dependencies
 */
import Comment from './Comment';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

function CommentList({
	className = 'comment-list',
	parent = 0,
	depth = 1,
	comments = [],
	post,
}) {
	const commentFilters = useMemo(() => {
		return comments.filter((comment) => {
			return comment.parent === parent;
		});
	}, [parent, comments]);

	if (!commentFilters.length) {
		return null;
	}

	return (
		<ol className={className}>
			{commentFilters.map((comment, index) => (
				<Comment
					key={comment.id}
					comment={comment}
					depth={depth}
					post={post}
					num={index}
				/>
			))}
		</ol>
	);
}
export default CommentList;
