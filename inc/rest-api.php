<?php
/**
 * Tweaks to the REST API to get data.
 *
 * @package WP_React_theme
 */

/**
 * Add some extra params to the post rest api request to make get data easier.
 *
 * @param array  $query_params Current Query params.
 * @param string $post_type Post type.
 *
 * @return mixed
 */
function wp_react_theme_extra_query_params( array $query_params, $post_type ) {
	$taxonomies = wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		$base = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;

		$query_params[ $base . '_slug' ] = array(
			/* translators: %s: Taxonomy name. */
			'description' => sprintf( __( 'Limit result set to all items that have the specified term assigned in the %s taxonomy.', 'wp-react-theme' ), $base ),
			'type'        => 'array',
			'items'       => array(
				'type' => 'string',
			),
			'default'     => array(),
		);
	}

	$query_params['author_slug'] = array(
		/* translators: %s: Taxonomy name. */
		'description' => __( 'Limit result set to all items that have the specified user name.', 'wp-react-theme' ),
		'type'        => 'string',
		'default'     => '',
	);

	$query_params['year'] = array(
		'description' => __( 'Filter posts by year', 'wp-react-theme' ),
		'type'        => 'string',
		'default'     => '0',
	);

	$query_params['month'] = array(
		'description' => __( 'Filter posts by month', 'wp-react-theme' ),
		'type'        => 'string',
		'default'     => '0',
	);

	$query_params['day'] = array(
		'description' => __( 'Filter posts by day', 'wp-react-theme' ),
		'type'        => 'string',
		'default'     => '0',
	);

	return $query_params;
}
add_filter( 'rest_post_collection_params', 'wp_react_theme_extra_query_params', 10, 2 );

/**
 * Filter the query to read in the params.
 *
 * @param array           $args WP_Query args.
 * @param WP_REST_Request $request REST Request object.
 *
 * @return array
 */
function wp_react_theme_rest_query( $args, $request ) {
	$post_type  = $args['post_type'];
	$taxonomies = wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		$base     = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
		$tax_slug = $base . '_slug';
		if ( ! empty( $request[ $tax_slug ] ) ) {
			$slug = $request[ $tax_slug ];
			if ( 'post_format' === $taxonomy->name ) {
				$slug = 'post-format-' . $request[ $tax_slug ];
			}
			$args['tax_query'][] = array(
				'taxonomy'         => $taxonomy->name,
				'field'            => 'slug',
				'terms'            => $slug,
				'include_children' => true,
			);
		}
	}

	if ( ! empty( $request['author_slug'] ) ) {
		$args['author_name'] = $request['author_slug'];
	}

	if ( ! empty( $request['year'] ) ) {
		$args['date_query'][0]['year'] = $request['year'];
		if ( ! empty( $request['month'] ) ) {
			$args['date_query'][0]['month'] = $request['month'];
			if ( ! empty( $request['day'] ) ) {
				$args['date_query'][0]['day'] = $request['day'];
			}
		}
	}

	return $args;
}

add_filter( 'rest_post_query', 'wp_react_theme_rest_query', 10, 2 );

/**
 * Filter the post request to add a next and back link that is embedded.
 *
 * @param WP_REST_Response $response Current response.
 *
 * @return mixed
 */
function wp_react_theme_prepare_post( $response ) {

	$previous_post = get_previous_post(); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_adjacent_post_get_previous_post
	if ( $previous_post ) {
		$previous = rest_url( 'wp/v2/posts/' . $previous_post->ID );
		$response->add_link( 'previous', $previous, array( 'embeddable' => true ) );
	}
	$next_post = get_next_post(); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_adjacent_post_get_next_post
	if ( $next_post ) {
		$next = rest_url( 'wp/v2/posts/' . $next_post->ID );
		$response->add_link( 'next', $next, array( 'embeddable' => true ) );
	}

	return $response;
}

add_filter( 'rest_prepare_post', 'wp_react_theme_prepare_post', 10 );


/**
 * Add post formats to rest api.
 *
 * @param array  $args register args for taxonomy.
 * @param string $taxonomy taxonomy name.
 *
 * @return array
 */
function wp_react_theme_add_format_to_api( $args, $taxonomy ) {
	if ( 'post_format' === $taxonomy ) {
		$args['show_in_rest']          = current_theme_supports( 'post-formats' );
		$args['rest_base']             = 'formats';
		$args['rest_controller_class'] = 'WP_REST_Terms_Controller';
	}

	return $args;
}

add_filter( 'register_taxonomy_args', 'wp_react_theme_add_format_to_api', 10, 2 );

/**
 * Add some extra fields to the rest apis.
 */
function wp_react_theme_extra_fields() {
	$post_types          = get_post_types( array( 'show_in_rest' => true ) );
	$post_types          = array_values( $post_types );
	$_post_types         = get_post_types_by_support( array( 'comments' ) );
	$post_types_comments = array_intersect( $post_types, $_post_types );

	foreach ( $post_types_comments as $post_type ) {
		register_rest_field(
			$post_type,
			'comment_count',
			array(
				'schema' => array(
					'description' => __( 'Comment count', 'wp-react-theme' ),
					'type'        => 'number',
					'default'     => 0,
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'get_callback' => function ( $prepared ) {
					$post = get_post( $prepared['id'] );

					return (int) $post->comment_count;
				},
			)
		);

		register_rest_field(
			$post_type,
			'date_time',
			array(
				'schema' => array(
					'description' => __( 'Date time', 'wp-react-theme' ),
					'type'        => 'object',
					'readonly'    => true,
					'properties'  => array(
						'date' => array(
							'description' => __( 'Date', 'wp-react-theme' ),
							'type'        => 'object',
							'readonly'    => true,
							'default'     => array(),
							'context'     => array( 'view', 'embed' ),
							'properties'  => array(
								'rendered' => array(
									'description' => __( 'Rendered date', 'wp-react-theme' ),
									'type'        => 'string',
									'context'     => array( 'view', 'edit', 'embed' ),
									'readonly'    => true,
								),
							),
						),
						'time' => array(
							'description' => __( 'Time', 'wp-react-theme' ),
							'type'        => 'object',
							'readonly'    => true,
							'default'     => array(),
							'context'     => array( 'view', 'edit', 'embed' ),
							'properties'  => array(
								'rendered' => array(
									'description' => __( 'Rendered time', 'wp-react-theme' ),
									'type'        => 'string',
									'context'     => array( 'view', 'edit', 'embed' ),
									'readonly'    => true,
								),
							),
						),

					),
					'default'     => array(),
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'get_callback' => function ( $prepared ) {
					$post = get_post( $prepared['id'] );
					$time = get_the_time( get_option( 'time_format' ), $post );
					$date = get_the_date( get_option( 'date_format' ), $post );

					return array(
						'time' => array(
							'rendered' => $time,
						),
						'date' => array(
							'rendered' => $date,
						),
					);
				},
			)
		);
	}

	register_rest_field(
		'comment',
		'date_time',
		array(
			'schema' => array(
				'description' => __( 'Date time', 'wp-react-theme' ),
				'type'        => 'object',
				'readonly'    => true,
				'properties'  => array(
					'date' => array(
						'description' => __( 'Date', 'wp-react-theme' ),
						'type'        => 'object',
						'readonly'    => true,
						'default'     => array(),
						'context'     => array( 'view', 'edit', 'embed' ),
						'properties'  => array(
							'rendered' => array(
								'description' => __( 'Rendered date', 'wp-react-theme' ),
								'type'        => 'string',
								'context'     => array( 'view', 'edit', 'embed' ),
								'readonly'    => true,
							),
						),
					),
					'time' => array(
						'description' => __( 'Time', 'wp-react-theme' ),
						'type'        => 'object',
						'readonly'    => true,
						'default'     => array(),
						'context'     => array( 'view', 'edit', 'embed' ),
						'properties'  => array(
							'rendered' => array(
								'description' => __( 'Rendered time', 'wp-react-theme' ),
								'type'        => 'string',
								'context'     => array( 'view', 'edit', 'embed' ),
								'readonly'    => true,
							),
						),
					),

				),
				'default'     => array(),
				'context'     => array( 'view', 'edit', 'embed' ),
			),
			'get_callback' => function ( $prepared ) {
				$comment = get_comment( $prepared['id'] );
				$time = wp_react_theme_get_comment_time( get_option( 'time_format' ), false, true, $comment );
				$date = get_comment_date( get_option( 'date_format' ), $comment );

				return array(
					'time' => array(
						'rendered' => $time,
					),
					'date' => array(
						'rendered' => $date,
					),
				);
			},
		)
	);
}
add_action( 'rest_api_init', 'wp_react_theme_extra_fields' );


/**
 * Retrieves the comment time of the current comment.
 *
 * @param string         $format    Optional. PHP time format. Defaults to the 'time_format' option.
 * @param bool           $gmt       Optional. Whether to use the GMT date. Default false.
 * @param bool           $translate Optional. Whether to translate the time (for use in feeds).
 *                                  Default true.
 * @param int|WP_Comment $comment_id WP_Comment or ID of the comment for which to get the date.
 *                                   Default current comment.
 * @return string The formatted time.
 */
function wp_react_theme_get_comment_time( $format = '', $gmt = false, $translate = true, $comment_id = 0 ) {
	$comment = get_comment( $comment_id );

	$comment_date = $gmt ? $comment->comment_date_gmt : $comment->comment_date;

	$_format = ! empty( $format ) ? $format : get_option( 'time_format' );

	$date = mysql2date( $_format, $comment_date, $translate );

	return apply_filters( 'get_comment_time', $date, $format, $gmt, $translate, $comment ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
}

/**
 * Tweaked version of rest_preload_api_request, so that number of things work better like, adding headings and embeds.
 *
 * @see rest_preload_api_request
 *
 * @param array  $memo Reduce accumulator.
 * @param string $path REST API path to preload.
 * @return array Modified reduce accumulator.
 */
function wp_react_theme_rest_preload_api_request( $memo, $path ) {
	// array_reduce() doesn't support passing an array in PHP 5.2,
	// so we need to make sure we start with one.
	if ( ! is_array( $memo ) ) {
		$memo = array();
	}

	if ( empty( $path ) ) {
		return $memo;
	}

	$method = 'GET';
	if ( is_array( $path ) && 2 === count( $path ) ) {
		$method = end( $path );
		$path   = reset( $path );

		if ( ! in_array( $method, array( 'GET', 'OPTIONS' ), true ) ) {
			$method = 'GET';
		}
	}

	$path_parts = wp_parse_url( $path );
	if ( false === $path_parts ) {
		return $memo;
	}

	$request = new WP_REST_Request( $method, untrailingslashit( $path_parts['path'] ) );
	$embed   = false;
	if ( ! empty( $path_parts['query'] ) ) {
		$query_params = array();
		parse_str( $path_parts['query'], $query_params );
		$embed = isset( $query_params['_embed'] ) ? $query_params['_embed'] : false;
		$request->set_query_params( $query_params );
	}

	$response = rest_do_request( $request );
	if ( 200 === $response->status ) {
		$server   = rest_get_server();
		$response = wp_react_theme_archive_header( $response, $server, $request );
		$data     = $server->response_to_data( $response, $embed );

		if ( 'OPTIONS' === $method ) {
			$response = rest_send_allow_header( $response, $server, $request );

			$memo[ $method ][ $path ] = array(
				'body'    => $data,
				'headers' => $response->headers,
			);
		} else {
			$memo[ $path ] = array(
				'body'    => $data,
				'headers' => $response->headers,
			);
		}
	}

	return $memo;
}

/**
 * Add archive headers to header of the rest api request.
 *
 * @param WP_REST_Response $result Current rest response.
 * @param WP_REST_Server   $server Server object.
 * @param WP_REST_Request  $request Current rest request.
 *
 * @return mixed
 */
function wp_react_theme_archive_header( $result, $server, $request ) {
	$title       = '';
	$description = '';

	if ( ! empty( $request['year'] ) ) {
		$date   = $request['year'] . '/01/01';
		$prefix = _x( 'Year:', 'date archive title prefix', 'wp-react-theme' );
		$format = _x( 'Y', 'yearly archives date format', 'wp-react-theme' );
		if ( ! empty( $request['month'] ) ) {
			$date   = $request['year'] . '/' . $request['month'] . '/01';
			$prefix = _x( 'Month:', 'date archive title prefix', 'wp-react-theme' );
			$format = _x( 'F Y', 'monthly archives date format', 'wp-react-theme' );
			if ( ! empty( $request['day'] ) ) {
				$date   = $request['year'] . '/' . $request['month'] . '/' . $request['day'];
				$prefix = _x( 'Day:', 'date archive title prefix', 'wp-react-theme' );
				$format = _x( 'F j, Y', 'daily archives date format', 'wp-react-theme' );
			}
		}
		$timestamp = strtotime( $date );
		$title     = date( $format, $timestamp ); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
	}

	$post_type  = 'post';
	$taxonomies = wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		$base = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;

		$tax_slug = $base . '_slug';
		if ( ! empty( $request[ $tax_slug ] ) ) {
			$slug = $request[ $tax_slug ];
			if ( 'post_format' === $taxonomy->name ) {
				$slug = 'post-format-' . $request[ $tax_slug ];
			}
			$term = get_term_by( 'slug', $slug, $taxonomy->name );
			if ( $term ) {
				$title  = $term->name;
				$prefix = sprintf(
				/* translators: %s: Taxonomy singular name. */
					_x( '%s:', 'taxonomy term archive title prefix', 'wp-react-theme' ),
					$taxonomy->labels->singular_name
				);
				$description = term_description( $term );
			}
		}
	}

	if ( ! empty( $request['author_slug'] ) ) {
		$authordata = get_user_by( 'slug', $request['author_slug'] );
		if ( $authordata ) {
			$title       = $authordata->display_name;
			$prefix      = _x( 'Author:', 'author archive title prefix', 'wp-react-theme' );
			$description = get_the_author_meta( 'description', $authordata->ID );
		}
	}

	if ( ! empty( $request['search'] ) ) {
		$prefix = _x( 'Search Results for: ', 'search results title prefix', 'wp-react-theme' );
		$title  = $request['search'];
	}

	if ( $title && $prefix ) {
		/**
		 * Filters the archive title prefix.
		 *
		 * @param string $prefix Archive title prefix.
		 */
		$prefix = apply_filters( 'get_the_archive_title_prefix', $prefix ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
		if ( $prefix ) {
			$title = sprintf(
			/* translators: 1: Title prefix. 2: Title. */
				_x( '%1$s %2$s', 'archive title', 'wp-react-theme' ),
				$prefix,
				$title
			);
			$result->header( 'X-WP-Archive-Header', wp_strip_all_tags( $title ) );
		}
	}

	if ( $description ) {
		$result->header( 'X-WP-Archive-Description', wp_strip_all_tags( $description ) );
	}

	return $result;
}

add_filter( 'rest_post_dispatch', 'wp_react_theme_archive_header', 10, 3 );

/**
 * Preload data for different requests.
 */
function wp_react_theme_preload() {
	global $post;

	// Preload common data.
	$preload_paths = array();

	$embed          = urlencode( 'author,wp:featuredmedia,wp:term,next,previous' );
	$posts_per_page = (int) get_option( 'posts_per_page' );


	if ( is_single() ) {
		$preload_paths[] = sprintf( '/wp/v2/posts?_embed=%s&per_page=%d&slug=%s', $embed, 1, $post->post_name );
	}

	if ( is_page() ) {
		$preload_paths[] = sprintf( '/wp/v2/pages?_embed=%s&per_page=%d&slug=%s', $embed, 1, $post->post_name );
	}

	if ( is_home() ) {
		$paged           = get_query_var( 'page', 1 );
		$preload_paths[] = sprintf( '/wp/v2/posts?page=%d&per_page=%d&_embed=%s', $paged, $posts_per_page, $embed );
	}

	if ( is_author() ) {
		$user            = get_queried_object();
		$paged           = get_query_var( 'page', 1 );
		$preload_paths[] = sprintf( '/wp/v2/posts?author_slug=%s&page=%d&per_page=%d&_embed=%s', $user->user_login, $paged, $posts_per_page, $embed );
	}

	if ( is_search() ) {
		$search          = get_query_var( 's', '' );
		$paged           = get_query_var( 'page', 1 );
		$preload_paths[] = sprintf( '/wp/v2/posts?search=%s&page=%d&per_page=%d&_embed=%s', $search, $paged, $posts_per_page, $embed );
	}

	if ( is_tax() || is_tag() || is_category() ) {
		$term            = get_queried_object();
		$paged           = get_query_var( 'page', 1 );
		$taxonomy        = get_taxonomy( $term->taxonomy );
		$base            = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
		$preload_paths[] = sprintf( '/wp/v2/posts?%s_slug=%s&page=%d&per_page=%d&_embed=%s', $base, $term->slug, $paged, $posts_per_page, $embed );
	}


	if ( is_date() ) {
		$paged           = get_query_var( 'page', 1 );
		$year            = get_query_var( 'year', 0 );
		$month           = get_query_var( 'month', 0 );
		$day             = get_query_var( 'day', 0 );
		$preload_paths[] = sprintf( '/wp/v2/posts?year=%s&month=%s&day=%s&page=%d&per_page=%d&_embed=%s', $year, $month, $day, $paged, $posts_per_page, $embed );
	}

	/**
	 * Preload common data by specifying an array of REST API paths that will be preloaded.
	 *
	 * Filters the array of paths that will be preloaded.
	 *
	 * @param string[] $preload_paths Array of paths to preload.
	 * @param WP_Post  $post          Post being edited.
	 */
	$preload_paths = apply_filters( 'wp_react_theme_preload_paths', $preload_paths, $post );

	/*
	 * Ensure the global $post remains the same after API data is preloaded.
	 * Because API preloading can call the_content and other filters, plugins
	 * can unexpectedly modify $post.
	 */
	$backup_global_post = $post;

	$preload_data = array_reduce(
		$preload_paths,
		'wp_react_theme_rest_preload_api_request',
		array()
	);


	// Restore the global $post as it was before API preloading.
	$post = $backup_global_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

	wp_add_inline_script(
		'wp-api-fetch',
		sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
		'after'
	);

}
add_action( 'template_redirect', 'wp_react_theme_preload' );

// Allow anonymouse comments in the rest api.
add_filter( 'rest_allow_anonymous_comments', '__return_true' );
