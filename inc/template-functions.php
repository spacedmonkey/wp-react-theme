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

