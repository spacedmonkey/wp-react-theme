/**
 * Internal dependencies
 */
import Comment from './Comment';

function CommentList( {
	className = 'comment-list',
	parent = 0,
	depth = 1,
	comments = [],
	post,
} ) {
	const commentFilters = comments.filter( ( comment ) => {
		return comment.parent === parent;
	} );

	if ( ! commentFilters.length ) {
		return null;
	}

	return (
		<ol className={ className }>
			{ commentFilters.map( ( comment, index ) => (
				<Comment
					key={ comment.id }
					comment={ comment }
					depth={ depth }
					post={ post }
					num={ index }
				/>
			) ) }
		</ol>
	);
}
export default CommentList;
