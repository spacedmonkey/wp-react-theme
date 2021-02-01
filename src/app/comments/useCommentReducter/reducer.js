/**
 * Internal dependencies
 */
import * as types from './types';
import * as reducers from './reducers';

function reducer(state, { type, payload }) {
	switch (type) {
		case types.ADD_COMMENTS: {
			return reducers.setComments(state, payload);
		}
		case types.SET_COMMENT: {
			return reducers.setComment(state, payload);
		}
		case types.SET_AUTHOR: {
			return reducers.setAuthor(state, payload);
		}
		case types.SET_EMAIL: {
			return reducers.setEmail(state, payload);
		}
		case types.SET_FORM: {
			return reducers.setShowMainForm(state, payload);
		}
		case types.SET_LOADED: {
			return reducers.setLoaded(state, payload);
		}
		case types.SET_LOADING: {
			return reducers.setLoading(state, payload);
		}
		case types.SET_URL: {
			return reducers.setUrl(state, payload);
		}
		case types.SET_ERROR: {
			return reducers.setError(state, payload);
		}
		case types.CLEAR_FORM: {
			return reducers.clearForm(state);
		}
		case types.CLEAR_COMMENTS: {
			return reducers.clearComments(state);
		}

		default:
			return state;
	}
}

export default reducer;
