/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { useState, useCallback, useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Context from './context';

function QueryProvider({ children }) {
	const [posts, setPosts] = useState([]);
	const [headers, setHeaders] = useState({});
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [password, setPassword] = useState('');

	const location = useLocation();

	const getPosts = useCallback(
		(config) => {
			if (!loading && !loaded) {
				setLoading(true);
				const options = {
					...config,
					path: addQueryArgs(config.path, {
						_embed: 'author,wp:featuredmedia,wp:term,next,previous',
					}),
					parse: false,
				};

				apiFetch(options)
					.then((results) => {
						const resultsHeaders = {};
						results.headers.forEach(function (value, name) {
							resultsHeaders[name] = value;
						});

						setHeaders(resultsHeaders);
						results
							.json()
							.then(setPosts)
							.finally(() => {
								setLoaded(true);
								setLoading(false);
							});
					})
					.catch(() => {
						setPosts([]);
						setLoaded(true);
						setLoading(false);
					});
			}
		},
		[loading, loaded]
	);

	const getProtectedPost = useCallback((id, passwordRaw) => {
		const options = {
			path: addQueryArgs('/wp/v2/posts/' + id, {
				_embed: 'author,wp:featuredmedia,wp:term,next,previous',
				password: passwordRaw,
			}),
			parse: false,
		};

		apiFetch(options).then((results) => {
			const resultsHeaders = {};
			results.headers.forEach(function (value, name) {
				resultsHeaders[name] = value;
			});

			setHeaders(resultsHeaders);
			results.json().then((post) => setPosts([post]));
		});
	}, []);

	useEffect(() => {
		setLoaded(false);
		setPassword('');
	}, [location.pathname]);

	const state = {
		state: {
			posts,
			loading,
			loaded,
			headers,
			password,
		},
		actions: {
			getPosts,
			setPosts,
			getProtectedPost,
			setLoaded,
			setLoading,
			setPassword,
		},
	};

	return <Context.Provider value={state}>{children}</Context.Provider>;
}

export default QueryProvider;
