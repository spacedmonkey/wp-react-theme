/**
 * Internal dependencies
 */
import Context from './context';
import { useConfig } from '../config';
/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

function BodyClassesProvider( { children } ) {
	const { state: configState } = useConfig();
	const { classes } = configState;
	const [ bodyClasses, setBodyClasses ] = useState( [ ...classes ] );

	useEffect( () => {
		const body = document.body;
		body.classList.remove( ...body.classList );
		const newBodyClasses = bodyClasses.sort();
		body.classList.add( ...newBodyClasses );
	}, [ bodyClasses ] );

	const setupClasses = useCallback(
		( newClassNames ) => {
			setBodyClasses( [ ...classes, ...newClassNames ] );
		},
		[ classes ]
	);

	const state = {
		state: {
			bodyClasses,
		},
		actions: {
			setupClasses,
		},
	};

	return <Context.Provider value={ state }>{ children }</Context.Provider>;
}

export default BodyClassesProvider;
