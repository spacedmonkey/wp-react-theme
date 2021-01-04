/**
 * Internal dependencies
 */
import CommentList from './CommentList';
/**
 * WordPress dependencies
 */
import { sprintf, _nx } from '@wordpress/i18n';
import { useComments } from '../../app/comments';
import { useEffect } from '@wordpress/element';
import CommentForm from './CommentForm';

function Comments( { title, postId, status } ) {
	const {
		state: { comments, loaded, showMainForm },
		actions: { getComments },
	} = useComments();

	useEffect( () => {
		getComments( postId );
	}, [] );

	if ( ! loaded ) {
		return null;
	}

	return (
		<div id="comments" className="comments-area">
			{ comments.length > 0 && (
				<h2 className="comments-title">
					{ sprintf(
						/* translators: 1: comment count number, 2: title. */
						_nx(
							'%1$s thought on "%2$s"',
							'%1$s thoughts on "%2$s"',
							comments.length,
							'comments title',
							'wp-react-theme'
						),
						comments.length,
						title
					) }
				</h2>
			) }
			{ comments.length > 0 && (
				<CommentList comments={ comments } status={ status } />
			) }
			{ showMainForm && status === 'open' && (
				<CommentForm post={ postId } />
			) }
		</div>
	);
}

export default Comments;
