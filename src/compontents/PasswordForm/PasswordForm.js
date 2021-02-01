/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useQuery } from '../../app/query';

function PasswordForm({ id }) {
	const inputId = `pwbox-${id}`;

	const {
		state: { password },
		actions: { setPassword, getProtectedPost },
	} = useQuery();

	const onSubmit = useCallback(
		(evt) => {
			if (evt) {
				evt.preventDefault();
				getProtectedPost(id, password);
			}
		},
		[id, password]
	);

	return (
		<form className="post-password-form" onSubmit={onSubmit}>
			<p>
				{__(
					'This content is password protected. To view it please enter your password below:',
					'wp-react-theme'
				)}
			</p>
			<p className="post-password-form-inside">
				<label htmlFor={inputId}>
					<span className="screen-reader-text">
						{__('Password:', 'wp-react-theme')}
					</span>
					<input
						name="post_password"
						placeholder={__('Password', 'wp-react-theme')}
						id={inputId}
						type="password"
						size="20"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<button type="submit" name="Submit">
					{__('Enter', 'wp-react-theme')}
				</button>
			</p>
		</form>
	);
}

export default PasswordForm;
