/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';
/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import { Redirect } from 'react-router-dom';

function SearchForm() {
	const elId = uuid();

	const [ search, setSearch ] = useState( '' );
	const [ submitted, setSubmitted ] = useState( false );

	const onSubmit = useCallback( ( evt ) => {
		if ( evt ) {
			evt.preventDefault();
			setSubmitted( true );
		}
	}, [] );

	if ( submitted && search ) {
		return <Redirect to={ `/search/${ search }` } />;
	}

	return (
		<form role="search" className="search-form" onSubmit={ onSubmit }>
			<label htmlFor={ `search-${ elId }` }>
				<span className="screen-reader-text">
					{ __( 'Search for: ', 'wp-react-theme' ) }
				</span>
				<input
					type="search"
					className="search-field"
					placeholder={ __( 'Search …', 'wp-react-theme' ) }
					value={ search }
					onChange={ ( e ) => setSearch( e.target.value ) }
					name="s"
					id={ `search-${ elId }` }
				/>
			</label>
			<input
				type="submit"
				className="search-submit"
				value={ __( 'Search', 'wp-react-theme' ) }
			/>
		</form>
	);
}
export default SearchForm;
