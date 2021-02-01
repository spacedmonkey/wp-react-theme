/**
 * Internal dependencies
 */
import NavigationList from './NavigationList';
import { useConfig } from '../../app/config';

/**
 * External dependencies
 */
import { Link, useLocation } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

function NavigationItem({ menuItem }) {
	const location = useLocation();
	const { menu, metadata } = useConfig();
	const { url } = metadata;
	const { menuItems } = menu;

	const {
		ID,
		url: linkUrl,
		target,
		attr_title: attrTitle,
		classes,
		xfn,
		title,
		type,
		object,
	} = menuItem;

	let DisplayLink = '';
	if (linkUrl.startsWith(url) || linkUrl.startsWith('/')) {
		DisplayLink = (
			<Link
				to={linkUrl.replace(url, '')}
				target={target}
				title={attrTitle}
				className={classes}
				rel={xfn}
			>
				{title}
			</Link>
		);
	} else {
		DisplayLink = (
			<a
				href={linkUrl}
				target={target}
				title={attrTitle}
				className={classes}
				rel={xfn}
			>
				{title}
			</a>
		);
	}

	const menuItemsFilters = useMemo(() => {
		return menuItems.filter((thisItem) => {
			return parseInt(thisItem.menu_item_parent) === parseInt(ID);
		});
	}, [ID, menuItems]);

	const hasChildren =
		menuItemsFilters.length > 0 ? 'menu-item-has-children' : '';
	const currrentClass =
		linkUrl.replace(url, '') === location.pathname
			? 'current-menu-item'
			: '';

	return (
		<li
			className={`menu-item ${hasChildren} ${currrentClass} menu-item-object-${object} menu-item-type-${type} menu-item-${ID}`}
			id={`menu-item-${ID}`}
		>
			{DisplayLink}
			<NavigationList
				className="sub-menu"
				menuItems={menuItems}
				parent={ID}
				id={`sub-menu-${ID}`}
			/>
		</li>
	);
}
export default NavigationItem;
