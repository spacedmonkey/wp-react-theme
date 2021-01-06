/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

function Sidebar() {
	const { furniture } = useConfig();
	const { sidebar } = furniture;

	if ( ! sidebar ) {
		return null;
	}

	return (
		<aside
			id="secondary"
			className="widget-area"
			dangerouslySetInnerHTML={ { __html: sidebar } }
		/>
	);
}
export default Sidebar;
