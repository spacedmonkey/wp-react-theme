export const clearComments = ( state ) => {
	return {
		...state,
		comments: [],
		loading: false,
		loaded: false,
	};
};
