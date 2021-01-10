<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package WP_React_theme
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function wp_react_theme_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	if ( ! has_nav_menu( 'menu-1' ) ) {
		$classes[] = 'no-menu';
	}

	return $classes;
}
add_filter( 'body_class', 'wp_react_theme_body_classes' );
