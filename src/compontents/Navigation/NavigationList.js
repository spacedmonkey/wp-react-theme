/**
 * Internal dependencies
 */
import NavigationItem from './NavigationItem';
/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

function NavigationList( {
	className = 'menu',
	parent = 0,
	depth = 1,
	menuItems = [],
	id = '',
} ) {
	const menuItemsFilters = useMemo( () => {
		return menuItems.filter( ( thisItem ) => {
			return parseInt( thisItem.menu_item_parent ) === parseInt( parent );
		} );
	}, [ parent ] );

	if ( ! menuItemsFilters.length ) {
		return null;
	}

	return (
		<ul id={ id } className={ className }>
			{ menuItemsFilters.map( ( menuItem, index ) => (
				<NavigationItem
					key={ menuItem.id }
					menuItem={ menuItem }
					menuItems={ menuItems }
					depth={ depth }
					num={ index }
				/>
			) ) }
		</ul>
	);
}
export default NavigationList;
