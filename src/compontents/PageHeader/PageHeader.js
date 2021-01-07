/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

function PageHeader( { title, description } ) {
	return (
		<header className="page-header">
			<h1
				className="page-title"
				dangerouslySetInnerHTML={ {
					__html: title,
				} }
			/>
			<RawHTML className="archive-description">{ description }</RawHTML>
		</header>
	);
}

export default PageHeader;
