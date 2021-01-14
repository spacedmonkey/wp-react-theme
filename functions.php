<?php
/**
 * WP React theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WP_React_theme
 */

if ( ! defined( 'WP_REACT_THEME_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( 'WP_REACT_THEME_VERSION', '1.0.0' );
}

if ( ! function_exists( 'wp_react_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function wp_react_theme_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on WP React theme, use a find and replace
		 * to change 'wp-react-theme' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'wp-react-theme', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary', 'wp-react-theme' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'wp_react_theme_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		add_theme_support( 'align-wide' );

		add_theme_support( 'responsive-embeds' );

		add_theme_support( 'wp-block-styles' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'wp_react_theme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function wp_react_theme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'wp_react_theme_content_width', 640 );
}
add_action( 'after_setup_theme', 'wp_react_theme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function wp_react_theme_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'wp-react-theme' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'wp-react-theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'wp_react_theme_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function wp_react_theme_scripts() {
	$asset = wp_react_theme_asset_metadata( 'theme' );
	wp_enqueue_style( 'wp-react-theme-style', get_theme_file_uri( '/assets/theme.css' ), array(), $asset['version'] );
	wp_style_add_data( 'wp-react-theme-style', 'rtl', 'replace' );


	wp_enqueue_script( 'wp-react-theme-script', get_theme_file_uri( '/assets/theme.js' ), $asset['dependencies'], $asset['version'], true );
	wp_localize_script(
		'wp-react-theme-script',
		'react_theme_settings',
		wp_react_theme_settings()
	);
	wp_set_script_translations( 'wp-react-theme-script', 'wp-react-theme' );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'wp_react_theme_scripts' );

/**
 * Get metadata from generated file.
 *
 * @param string $slug Script handle.
 *
 * @return array
 */
function wp_react_theme_asset_metadata( $slug ) {
	$asset_file            = get_theme_file_path( 'assets/' . $slug . '.asset.php' );
	$asset                 = is_readable( $asset_file ) ? require $asset_file : array();
	$asset['dependencies'] = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
	$asset['version']      = isset( $asset['version'] ) ? $asset['version'] : WP_REACT_THEME_VERSION;

	return $asset;
}

/**
 * Get an object of data meta used to populate the react app.
 *
 * @return array[]
 */
function wp_react_theme_settings() {
	global $wp_rewrite;

	$locations      = get_nav_menu_locations();
	$theme_location = 'menu-1';
	$menu_items     = array();
	if ( $locations && isset( $locations[ $theme_location ] ) ) {
		$menu_obj   = wp_get_nav_menu_object( $locations[ $theme_location ] );
		$menu_items = wp_get_nav_menu_items(
			$menu_obj,
			array(
				'update_post_term_cache' => false,
				'suppress_filters'       => false,
			)
		);
	}

	ob_start();
	dynamic_sidebar( 'sidebar-1' );
	$sidebar = (string) ob_get_clean();

	$_theme = wp_get_theme();
	$theme  = array(
		'name'      => $_theme->get( 'Name' ),
		'author'    => $_theme->get( 'Author' ),
		'authorUri' => $_theme->get( 'AuthorURI' ),
	);

	$taxonomies = wp_list_filter( get_object_taxonomies( 'post', 'objects' ), array( 'show_in_rest' => true ) );
	$taxonomies = array_values( $taxonomies );

	$custom_logo_id               = get_theme_mod( 'custom_logo' );
	$image                        = wp_get_attachment_image_src( $custom_logo_id, 'full' );
	list( $src, $width, $height ) = $image;
	$logo                         = compact( 'src', 'width', 'height' );
	$logo                         = array_filter( $logo );

	return array(
		'metadata' => array(
			'name'        => get_bloginfo( 'name' ),
			'description' => get_bloginfo( 'description' ),
			'url'         => get_bloginfo( 'url' ),
			'logo'        => $logo,
		),
		'furniture' => array(
			'sidebar'     => $sidebar,
		),
		'menu' => array(
			'id'        => 'primary-menu',
			'menuItems' => $menu_items,

		),
		'state' => array(
			'isLogged' => is_user_logged_in(),
			'locale'   => str_replace( '_', '-', get_user_locale() ),
		),
		'config' => array(
			'front'      => $wp_rewrite->front,
			'theme'      => $theme,
			'taxonomies' => $taxonomies,
			'embedAPI'   => rest_url( 'oembed/1.0/embed' ),
			'assetPath'  => get_template_directory_uri() . '/assets/',
		),
		'settings' => array(
			'pageOnFront'         => (int) get_option( 'page_on_front' ),
			'pageForPosts'        => (int) get_option( 'page_for_posts' ),
			'perPage'             => (int) get_option( 'posts_per_page' ),
			'commentRegistration' => (bool) get_option( 'comment_registration' ),
			'threadComments'      => (bool) get_option( 'thread_comments' ),
			'threadCommentsDepth' => (int) get_option( 'thread_comments_depth' ),
			'requireNameEmail'    => (bool) get_option( 'require_name_email' ),
			'commentOrder'        => get_option( 'comment_order' ),
			'showAvatars'         => (bool) get_option( 'show_avatars' ),
			'dateFormat'          => get_option( 'date_format' ),
			'timeFormat'          => get_option( 'time_format' ),
		),
	);
}

/**
 * Change the url pattern of date archives to match react.
 */
function wp_react_theme_date_structure() {
	global $wp_rewrite;
	$wp_rewrite->date_structure = $wp_rewrite->front . 'date/%year%/%monthnum%/%day%';
}
add_action( 'init', 'wp_react_theme_date_structure' );

/**
 * Redirect search to pretty url.
 */
function wp_react_theme_change_search_url() {
	if ( is_search() && ! empty( $_GET['s'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		wp_safe_redirect( home_url( '/search/' . urlencode( get_query_var( 's' ) ) ) );
		exit();
	}
}
add_action( 'template_redirect', 'wp_react_theme_change_search_url' );


/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * REST API Tweaks;
 */
require get_template_directory() . '/inc/rest-api.php';

/**
 * Header Tweaks;
 */
require get_template_directory() . '/inc/headers.php';
