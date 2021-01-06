/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useComments } from '../../app/comments';
import { useConfig } from '../../app/config';

function CommentForm( { post, parent = 0, onComplete = () => {} } ) {
	const {
		state: { email, comment, author, url, error },
		actions: {
			submitComment,
			addComment,
			setEmail,
			setComment,
			setAuthor,
			setUrl,
			setError,
		},
	} = useComments();

	const { state, settings } = useConfig();
	const { isLogged } = state;
	const { commentRegistration, requireNameEmail } = settings;

	const elId = uuid();

	const changeEmail = useCallback(
		( e ) => {
			setEmail( { email: e.target.value } );
		},
		[ setEmail ]
	);
	const changeComment = useCallback(
		( e ) => {
			setComment( { comment: e.target.value } );
		},
		[ setComment ]
	);
	const changeAuthor = useCallback(
		( e ) => {
			setAuthor( { author: e.target.value } );
		},
		[ setAuthor ]
	);
	const changeUrl = useCallback(
		( e ) => {
			setUrl( { url: e.target.value } );
		},
		[ setUrl ]
	);

	const onSubmit = useCallback(
		( evt ) => {
			if ( evt ) {
				evt.preventDefault();
				submitComment( {
					post,
					parent,
				} )
					.then( ( newComment ) => {
						addComment( newComment );
						onComplete();
					} )
					.catch( ( e ) => {
						setError( { error: e } );
					} );
			}
		},
		[ email, comment, author, url ]
	);

	if ( commentRegistration && ! isLogged ) {
		return (
			<div id="respond" className="comment-respond">
				<h3
					id={ `reply-title-${ elId }` }
					className="comment-reply-title"
				>
					{ __( 'Leave a Reply', 'wp-react-theme' ) }
				</h3>
				<p className="must-log-in">
					{ __(
						'You must be logged in to post a comment.',
						'wp-react-theme'
					) }
				</p>
			</div>
		);
	}

	return (
		<div id="respond" className="comment-respond">
			<h3 id={ `reply-title-${ elId }` } className="comment-reply-title">
				{ __( 'Leave a Reply', 'wp-react-theme' ) }
			</h3>
			{ error && (
				<h5
					className={ `comment-error` }
					dangerouslySetInnerHTML={ {
						__html: error?.message,
					} }
				/>
			) }
			<form
				id={ `commentform-${ elId }` }
				className="comment-form"
				noValidate=""
				onSubmit={ onSubmit }
			>
				<p className="comment-notes">
					<span id={ `email-notes-${ elId }` }>
						{ __(
							'Your email address will not be published.',
							'wp-react-theme'
						) }
					</span>
					{ requireNameEmail &&
						__( 'Required fields are marked', 'wp-react-theme' ) }
					{ requireNameEmail && <span className="required">*</span> }
				</p>
				<p className="comment-form-comment">
					<label htmlFor={ `comment-${ elId }` }>
						{ __( 'Comment', 'wp-react-theme' ) }
					</label>
					<textarea
						id={ `comment-${ elId }` }
						name="comment"
						cols="45"
						rows="8"
						maxLength="65525"
						required="required"
						onChange={ changeComment }
						value={ comment }
					/>
				</p>
				{ ! isLogged && (
					<p className="comment-form-author">
						<label htmlFor={ `author-${ elId }` }>
							{ __( 'Name', 'wp-react-theme' ) }
							{ requireNameEmail && (
								<span className="required">*</span>
							) }
						</label>
						<input
							id={ `author-${ elId }` }
							name="author"
							type="text"
							size="30"
							maxLength="245"
							required={ requireNameEmail }
							onChange={ changeAuthor }
							value={ author }
						/>
					</p>
				) }
				{ ! isLogged && (
					<p className="comment-form-email">
						<label htmlFor={ `email-${ elId }` }>
							{ __( 'Email', 'wp-react-theme' ) }
							{ requireNameEmail && (
								<span className="required">*</span>
							) }
						</label>
						<input
							id={ `email-${ elId }` }
							name="email"
							type="email"
							size="30"
							maxLength="100"
							aria-describedby="email-notes"
							required={ requireNameEmail }
							onChange={ changeEmail }
							value={ email }
						/>
					</p>
				) }
				{ ! isLogged && (
					<p className="comment-form-url">
						<label htmlFor={ `url-${ elId }` }>
							{ __( 'Website', 'wp-react-theme' ) }
						</label>
						<input
							id={ `url-${ elId }` }
							name="url"
							type="url"
							onChange={ changeUrl }
							value={ url }
							size="30"
							maxLength="200"
						/>
					</p>
				) }
				<p className="form-submit">
					<input
						name="submit"
						type="submit"
						id={ `submit-${ elId }` }
						className="submit"
						value={ __( 'Post Comment', 'wp-react-theme' ) }
					/>
				</p>
			</form>
		</div>
	);
}
export default CommentForm;
