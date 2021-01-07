/**
 * Internal dependencies
 */
import { Image, PasswordForm } from '../';
import { isProtected } from '../../utils';

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

function ContentPage( { post } ) {
	const {
		id,
		type,
		status,
		title: { rendered: titleRendered },
		content: { rendered: contentRendered },
		_embedded: embedded,
	} = post;
	const featuredmedia = embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
	return (
		<article
			id={ `post-${ id }` }
			className={ `post-${ id } post hentry type-${ type } status-${ status }` }
		>
			<header className="entry-header">
				<h1 className="entry-title">{ titleRendered }</h1>
			</header>
			<RawHTML></RawHTML>
			{ featuredmedia && <Image data={ featuredmedia } /> }
			{ ! isProtected( post ) ? (
				<RawHTML className="entry-content">{ contentRendered }</RawHTML>
			) : (
				<PasswordForm id={ post.id } />
			) }
		</article>
	);
}

export default ContentPage;
