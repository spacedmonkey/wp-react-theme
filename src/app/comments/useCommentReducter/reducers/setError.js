export const setError = ( state, { error } ) => {
	console.log(error);
	return {
		...state,
		error,
	};
};
