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
function wp_react_theme_body_classes_filter( $classes ) {
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

	$classes[] = 'no-js';

	return $classes;
}
add_filter( 'body_class', 'wp_react_theme_body_classes_filter' );

/**
 * List of default body classes.
 *
 * @return array
 */
function wp_react_theme_body_classes() {
	$classes = [ 'js' ];

	if ( is_rtl() ) {
		$classes[] = 'rtl';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	if ( ! has_nav_menu( 'menu-1' ) ) {
		$classes[] = 'no-menu';
	}

	if ( is_user_logged_in() ) {
		$classes[] = 'logged-in';
	}

	if ( is_admin_bar_showing() ) {
		$classes[] = 'admin-bar';
		$classes[] = 'no-customize-support';
	}

	if ( current_theme_supports( 'custom-background' ) && ( get_background_color() !== get_theme_support( 'custom-background', 'default-color' ) || get_background_image() ) ) {
		$classes[] = 'custom-background';
	}

	if ( has_custom_logo() ) {
		$classes[] = 'wp-custom-logo';
	}

	if ( current_theme_supports( 'responsive-embeds' ) ) {
		$classes[] = 'wp-embed-responsive';
	}

	$classes = array_map( 'esc_attr', $classes );
	/**
	 * Filters the list of CSS body class names for the current post or page.
	 *
	 * @param string[] $classes An array of body class names.
	 */
	$classes = apply_filters( 'wp_react_theme_body_class', $classes );

	return array_unique( $classes );
}

/**
 * Change output of password form.
 *
 * @param string $output Current output.
 *
 * @return string
 */
function wp_react_theme_the_password_form( $output ) {
	global $post;

	$label  = 'pwbox-' . ( empty( $post->ID ) ? wp_rand() : $post->ID );
	$output = '<form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" class="post-password-form" method="post">
	    <p>' . __( 'This content is password protected. To view it please enter your password below:', 'wp-react-theme' ) . '</p>
	    <p class="post-password-form-inside"><label for="' . $label . '"><span class="screen-reader-text">' . __( 'Password:', 'wp-react-theme' ) . '</span><input name="post_password" id="' . $label . '" type="password" placeholder="' . esc_html__( 'Password', 'wp-react-theme' ) . '" size="20" /></label><button type="submit" name="Submit">' . esc_html__( 'Enter', 'wp-react-theme' ) . '</button></p>
    </form>
    ';

	return $output;
}

add_filter( 'the_password_form', 'wp_react_theme_the_password_form' );

