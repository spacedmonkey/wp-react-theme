<?php

/**
 * @param $query_params
 * @param $post_type
 *
 * @return mixed
 */
function wp_react_theme_extra_query_params( $query_params, $post_type ) {
	$taxonomies = wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		$base = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;

		$query_params[ $base . '_slug' ] = array(
			/* translators: %s: Taxonomy name. */
			'description' => sprintf( __( 'Limit result set to all items that have the specified term assigned in the %s taxonomy.' ), $base ),
			'type'        => 'array',
			'items'       => array(
				'type' => 'string',
			),
			'default'     => array(),
		);
	}

	$query_params['author_slug'] = array(
		/* translators: %s: Taxonomy name. */
		'description' => __( 'Limit result set to all items that have the specified user name.' ),
		'type'        => 'string',
		'default'     => '',
	);

	$query_params['year'] = array(
		'description' => __( 'Filter posts by year' ),
		'type'        => 'string',
		'default'     => '0',
	);

	$query_params['month'] = array(
		'description' => __( 'Filter posts by month' ),
		'type'        => 'string',
		'default'     => '0',
	);

	$query_params['day'] = array(
		'description' => __( 'Filter posts by day' ),
		'type'        => 'string',
		'default'     => '0',
	);

	return $query_params;
}

add_filter( 'rest_post_collection_params', 'wp_react_theme_extra_query_params', 10, 2 );

/**
 * @param $args
 * @param $request
 *
 * @return mixed
 */
function wp_react_theme_rest_query( $args, $request ) {
	$post_type  = $args['post_type'];
	$taxonomies = wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) );

	foreach ( $taxonomies as $taxonomy ) {
		$base     = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
		$tax_slug = $base . '_slug';
		if ( ! empty( $request[ $tax_slug ] ) ) {
			$args['tax_query'][] = array(
				'taxonomy'         => $taxonomy->name,
				'field'            => 'slug',
				'terms'            => $request[ $tax_slug ],
				'include_children' => false,
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
 * @param $response
 * @param $post
 *
 * @return mixed
 */
function wp_react_theme_prepare_post( $response, $post ) {

	$previous_post = get_previous_post();
	if ( $previous_post ) {
		$previous = rest_url( 'wp/v2/posts/' . $previous_post->ID );
		$response->add_link( 'previous', $previous, array( 'embeddable' => true, ) );
	}
	$next_post = get_next_post();
	if ( $next_post ) {
		$next = rest_url( 'wp/v2/posts/' . $next_post->ID );
		$response->add_link( 'next', $next, array( 'embeddable' => true, ) );
	}

	$replies_url = rest_url( 'wp/v2/comments' );
	$replies_url = add_query_arg( array(
		'post'     => $post->ID,
		'per_page' => 100,
		'order'    => 'asc',
	), $replies_url );

	$response->remove_link( 'replies' );
	$response->add_link( 'replies', $replies_url, array( 'embeddable' => true, ) );

	return $response;
}

add_filter( 'rest_prepare_post', 'wp_react_theme_prepare_post', 10, 2 );

function wp_react_theme_extra_fields() {
	$taxonomies = get_taxonomies( array( 'show_in_rest' => true ) );
	$taxonomies = array_keys( $taxonomies );
	foreach ( $taxonomies as $taxonomy ) {
		add_filter( "rest_prepare_{$taxonomy}", "wp_react_theme_rest_prepare_taxonomy", 10, 3 );
	}
}

add_action( 'init', 'wp_react_theme_extra_fields' );

function wp_react_theme_rest_prepare_taxonomy( $response, $item, $request ) {
	$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
	if ( 'embed' === $context && ! isset( $request['_fields'] ) ) {
		$data                = $response->get_data();
		$data['description'] = $item->description;
		$response->set_data( $data );
	}

	return $response;
}

function wp_react_theme_rest_preload_api_request( $memo, $path ) {
	// array_reduce() doesn't support passing an array in PHP 5.2,
	// so we need to make sure we start with one.
	if ( ! is_array( $memo ) ) {
		$memo = [];
	}

	if ( empty( $path ) ) {
		return $memo;
	}

	$method = 'GET';
	if ( is_array( $path ) && 2 === count( $path ) ) {
		$method = end( $path );
		$path   = reset( $path );

		if ( ! in_array( $method, [ 'GET', 'OPTIONS' ], true ) ) {
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
		$query_params = [];
		parse_str( $path_parts['query'], $query_params );
		$embed = isset( $query_params['_embed'] ) ? $query_params['_embed'] : false;
		$request->set_query_params( $query_params );
	}

	$response = rest_do_request( $request );
	if ( 200 === $response->status ) {
		$server = rest_get_server();
		$data   = $server->response_to_data( $response, $embed );

		if ( 'OPTIONS' === $method ) {
			$response = rest_send_allow_header( $response, $server, $request );

			$memo[ $method ][ $path ] = [
				'body'    => $data,
				'headers' => $response->headers,
			];
		} else {
			$memo[ $path ] = [
				'body'    => $data,
				'headers' => $response->headers,
			];
		}
	}

	return $memo;
}


function wp_react_theme_preload(){
	global $post;

	// Preload common data.
	$preload_paths = [];

	$embed = urlencode( 'author,wp:featuredmedia,wp:term,next,previous' );

	if ( is_single() ) {
		$preload_paths[] = sprintf( '/wp/v2/posts?_embed=%s&per_page=%d&slug=', $embed, 1, $post->post_name );
	}

	if ( is_page() ) {
		$preload_paths[] = sprintf( '/wp/v2/pages?_embed=%s&per_page=%d&slug=', $embed, 1, $post->post_name );
	}

	if ( is_author() ) {
		$user            = get_queried_object();
		$paged           = get_query_var( 'page', 1 );
		$preload_paths[] = sprintf( '/wp/v2/posts?author_slug=%s&page=%d&_embed=%s', $user->user_login, $paged, $embed );
	}

	if ( is_search() ) {
		$search          = get_query_var( 's', '' );
		$paged           = get_query_var( 'page', 1 );
		$preload_paths[] = sprintf( '/wp/v2/posts?search=%s&page=%d&_embed=%s', $search, $paged, $embed );
	}


	if ( is_tax() || is_tag() || is_category() ) {
		$term            = get_queried_object();
		$paged           = get_query_var( 'page', 1 );
		$taxonomy        = get_taxonomy( $term->taxonomy );
		$base            = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
		$preload_paths[] = sprintf( '/wp/v2/posts?%s_slug=%s&page=%d&_embed=%s', $base, $term->slug, $paged, $embed );
	}


	if ( is_date() ) {
		$paged = get_query_var( 'page', 1 );
		$year  = get_query_var( 'year', 0 );
		$month = get_query_var( 'month', 0 );
		$day   = get_query_var( 'day', 0 );
		$preload_paths[] = sprintf( '/wp/v2/posts?year=%s&month=%s&day=%s&page=%d&_embed=%s', $year, $month, $day, $paged, $embed );
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
		[]
	);


	// Restore the global $post as it was before API preloading.
	$post = $backup_global_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

	wp_add_inline_script(
		'wp-api-fetch',
		sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
		'after'
	);

}
add_action('template_redirect', 'wp_react_theme_preload' );


add_filter( 'rest_allow_anonymous_comments', '__return_true' );
