/**
 * Internal dependencies
 */
import * as types from './types';

const setComments = (dispatch) => ({ comments }) =>
	dispatch({ type: types.ADD_COMMENTS, payload: { comments } });
const setLoading = (dispatch) => ({ loading }) =>
	dispatch({ type: types.SET_LOADING, payload: { loading } });
const setLoaded = (dispatch) => ({ loaded }) =>
	dispatch({ type: types.SET_LOADED, payload: { loaded } });
const setEmail = (dispatch) => ({ email }) =>
	dispatch({ type: types.SET_EMAIL, payload: { email } });
const setComment = (dispatch) => ({ comment }) =>
	dispatch({ type: types.SET_COMMENT, payload: { comment } });
const setAuthor = (dispatch) => ({ author }) =>
	dispatch({ type: types.SET_AUTHOR, payload: { author } });
const setUrl = (dispatch) => ({ url }) =>
	dispatch({ type: types.SET_URL, payload: { url } });
const setError = (dispatch) => ({ error }) =>
	dispatch({ type: types.SET_ERROR, payload: { error } });
const setShowMainForm = (dispatch) => ({ showMainForm }) =>
	dispatch({ type: types.SET_FORM, payload: { showMainForm } });
const clearForm = (dispatch) => () => dispatch({ type: types.CLEAR_FORM });
const clearComments = (dispatch) => () =>
	dispatch({ type: types.CLEAR_COMMENTS });

export const exposedActions = {
	setComments,
	setLoading,
	setLoaded,
	setEmail,
	setComment,
	setAuthor,
	setUrl,
	setShowMainForm,
	clearForm,
	clearComments,
	setError,
};
