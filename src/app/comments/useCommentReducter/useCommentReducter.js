/**
 * WordPress dependencies
 */
import { useReducer, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { exposedActions } from './actions';
import reducer from './reducer';

const INITIAL_STATE = {
	comments: [],
	loading: false,
	loaded: false,
	email: '',
	comment: '',
	author: '',
	url: '',
	showMainForm: true,
	error: false,
};

function useCommentReducer() {
	const [state, dispatch] = useReducer(reducer, {
		...INITIAL_STATE,
	});

	const { actions } = useMemo(() => {
		const wrapWithDispatch = (apis) =>
			Object.keys(apis).reduce(
				(collection, action) => ({
					...collection,
					[action]: apis[action](dispatch),
				}),
				{}
			);

		return {
			actions: wrapWithDispatch(exposedActions, dispatch),
		};
	}, [dispatch]);

	return {
		state,
		actions,
	};
}

export default useCommentReducer;
