/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import NavigationList from './NavigationList';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

function Navigation() {
	const { menu } = useConfig();
	const { id, menuItems } = menu;

	const [ expanded, setExpanded ] = useState( false );

	const className = expanded ? 'toggled main-navigation' : 'main-navigation';

	if ( ! menuItems ) {
		return null;
	}

	return (
		<nav id="site-navigation" className={ className }>
			<button
				className="menu-toggle"
				aria-controls={ id }
				onClick={ () => setExpanded( ! expanded ) }
				aria-expanded={ expanded }
			>
				{ __( 'Menu', 'wp-react-theme' ) }
			</button>
			<NavigationList id={ id } menuItems={ menuItems } parent="0" />
		</nav>
	);
}

export default Navigation;
