/**
 * Internal dependencies
 */
import Image from '../Image/Image';

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
			{ featuredmedia && <Image data={ featuredmedia } /> }
			<div
				className="entry-content"
				dangerouslySetInnerHTML={ { __html: contentRendered } }
			/>
		</article>
	);
}

export default ContentPage;
