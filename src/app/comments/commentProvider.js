/**
 * Internal dependencies
 */
import Context from './context';
import useCommentReducer from './useCommentReducter';
/**
 * WordPress dependencies
 */
import { useCallback, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
/**
 * External dependencies
 */
import { useLocation } from 'react-router-dom';

function CommentProvider( { children } ) {
	const { state, actions } = useCommentReducer();

	const location = useLocation();

	const { loading, loaded, comment, author, url, comments, email } = state;
	const {
		setLoaded,
		setLoading,
		setComments,
		clearForm,
		clearComments,
	} = actions;

	const getComments = useCallback(
		( id, order = 'asc', password ) => {
			if ( ! loading && ! loaded ) {
				setLoading( { loading: true } );
				const config = {
					path: addQueryArgs( '/wp/v2/comments', {
						post: id,
						per_page: -1,
						order,
						password,
					} ),
				};

				apiFetch( config )
					.then( ( newComments ) => {
						setComments( {
							comments: [ ...newComments ],
						} );
					} )
					.finally( () => {
						setLoaded( { loaded: true } );
						setLoading( { loading: false } );
					} );
			}
		},
		[ loading, loaded ]
	);

	const submitComment = useCallback(
		( { post, parent = 0 } ) => {
			return apiFetch( {
				path: '/wp/v2/comments',
				data: {
					post,
					content: comment,
					author_name: author,
					author_email: email,
					author_url: url,
					parent,
				},
				method: 'POST',
			} );
		},
		[ comment, author, email, url ]
	);

	const addComment = useCallback(
		( newComment ) => {
			setComments( {
				comments: [ ...comments, newComment ],
			} );
			clearForm();
		},
		[ comments ]
	);

	useEffect( () => {
		clearComments();
		clearForm();
	}, [ location.pathname ] );

	const data = {
		state,
		actions: {
			...actions,
			addComment,
			submitComment,
			getComments,
		},
	};

	return <Context.Provider value={ data }>{ children }</Context.Provider>;
}

export default CommentProvider;
