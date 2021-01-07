/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function SkipLink() {
	return (
		<a className="skip-link screen-reader-text" href="#primary">
			{ __( 'Skip to content', 'wp-react-theme' ) }
		</a>
	);
}
export default SkipLink;
