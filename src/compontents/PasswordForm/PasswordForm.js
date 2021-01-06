/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';

function PasswordForm( { id } ) {
	const inputId = `pwbox-${ id }`;

	const {
		state: { password },
		actions: { setPassword, getProtectedPost },
	} = useQuery();

	const onSubmit = useCallback(
		( evt ) => {
			if ( evt ) {
				evt.preventDefault();
				getProtectedPost( id, password );
			}
		},
		[ id, password ]
	);

	return (
		<form className="post-password-form" onSubmit={ onSubmit }>
			<p>
				{ __(
					'This content is password protected. To view it please enter your password below:',
					'wp-react-theme'
				) }
			</p>
			<p>
				<label htmlFor={ inputId }>
					{ __( 'Password:', 'wp-react-theme' ) }{ ' ' }
					<input
						name="post_password"
						id={ inputId }
						type="password"
						size="20"
						value={ password }
						onChange={ ( e ) => setPassword( e.target.value ) }
					/>
				</label>
				<input
					type="submit"
					name="Submit"
					value={ __( 'Enter', 'wp-react-theme' ) }
				/>
			</p>
		</form>
	);
}

export default PasswordForm;
