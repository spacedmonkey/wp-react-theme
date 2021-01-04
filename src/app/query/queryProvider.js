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

function QueryProvider( { children } ) {
	const [ posts, setPosts ] = useState( [] );
	const [ headers, setHeaders ] = useState( {} );
	const [ loading, setLoading ] = useState( false );
	const [ loaded, setLoaded ] = useState( false );

	const location = useLocation();

	const getPosts = useCallback(
		( config ) => {
			if ( ! loading && ! loaded ) {
				setLoading( true );
				config.path = addQueryArgs( config.path, {
					_embed: 'author,wp:featuredmedia,wp:term,next,previous',
				} );
				config.parse = false;
				apiFetch( config ).then( ( results ) => {
					const resultsHeaders = {};
					results.headers.forEach( function ( value, name ) {
						resultsHeaders[ name ] = value;
					} );

					setHeaders( resultsHeaders );
					results
						.json()
						.then( setPosts )
						.finally( () => {
							setLoaded( true );
							setLoading( false );
						} );
				} );
			}
		},
		[ posts.length, loading, loaded ]
	);

	useEffect( () => {
		setLoaded( false );
	}, [ location.pathname ] );

	const state = {
		state: {
			posts,
			loading,
			loaded,
			headers,
		},
		actions: {
			getPosts,
			setLoaded,
			setLoading,
		},
	};

	return <Context.Provider value={ state }>{ children }</Context.Provider>;
}

export default QueryProvider;
