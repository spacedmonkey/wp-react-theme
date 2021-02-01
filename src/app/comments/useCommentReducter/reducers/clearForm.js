export const clearForm = (state) => {
	return {
		...state,
		author: '',
		url: '',
		email: '',
		comment: '',
		error: false,
	};
};
