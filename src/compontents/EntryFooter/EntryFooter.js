/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

function EntryFooter( { terms, postId, url } ) {
	const dataTerm = {
		category: [],
		post_tag: [],
	};
	terms.forEach( function ( tax ) {
		tax.forEach( function ( term ) {
			dataTerm[ term.taxonomy ].push( term );
		} );
	} );

	const catList = dataTerm.category.map( ( term ) => (
		<span key={ `cat-link-${ term.id }` }>
			<Link to={ term.link.replace( url, '' ) }>{ term.name }</Link>,{ ' ' }
		</span>
	) );

	const tagList = dataTerm.post_tag.map( ( term ) => (
		<span key={ `tags-links-${ term.id }` }>
			<Link to={ term.link.replace( url, '' ) }>{ term.name }</Link>,{ ' ' }
		</span>
	) );

	return (
		<footer className="entry-footer" key={ `post-${ postId }` }>
			{ dataTerm.category.length > 0 && (
				<span className="cat-links" key={ `cat-links-${ postId }` }>
					{ __( 'Posted in ', 'wp-react-theme' ) }
					{ catList }
				</span>
			) }
			{ dataTerm.post_tag.length > 0 && tagList && (
				<span className="tags-links" key={ `tags-links-${ postId }` }>
					{ __( 'Tagged in ', 'wp-react-theme' ) }
					{ tagList }
				</span>
			) }
		</footer>
	);
}

export default EntryFooter;
