function Image( { data } ) {
	const sizes =
		'(max-width: ' +
		data?.media_details.width +
		'px) 100vw, ' +
		data?.media_details.width +
		'px';
	let srcset = '';

	Object.values( data.media_details.sizes ).forEach( function ( value ) {
		srcset += value.source_url + ' ' + value.width + 'w, ';
	} );
	srcset = srcset.slice( 0, -2 );
	return (
		<img
			src={ data.source_url }
			alt={ data.alt_text }
			width={ data?.media_details.width }
			height={ data?.media_details.height }
			sizes={ sizes }
			srcSet={ srcset }
		/>
	);
}

export default Image;
