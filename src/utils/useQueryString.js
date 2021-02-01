/**
 * External dependencies
 */
import { useLocation } from 'react-router-dom';

function useQueryString() {
	const { search } = useLocation();
	const params = new URLSearchParams(search);

	const obj = {};

	// iterate over all keys
	for (const key of params.keys()) {
		if (params.getAll(key).length > 1) {
			obj[key] = params.getAll(key);
		} else {
			obj[key] = params.get(key);
		}
	}

	return obj;
}

export default useQueryString;
