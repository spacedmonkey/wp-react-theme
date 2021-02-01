function Image({ data }) {
	const {
		media_details: mediaDetails,
		alt_text: alt,
		source_url: sourceUrl,
	} = data;
	const { height, width, sizes: imageSizes } = mediaDetails;

	const sizes = `(max-width: ${width}px) 100vw, ${width}px`;
	let srcset = '';

	Object.values(imageSizes).forEach(function (
		{ source_url: sourceUrlImage, width: sourceWidth },
		index
	) {
		srcset += `${sourceUrlImage} ${sourceWidth}w`;
		srcset += index !== imageSizes.length - 1 ? ', ' : '';
	});

	return (
		<img
			src={sourceUrl}
			alt={alt}
			width={width}
			height={height}
			sizes={sizes}
			srcSet={srcset}
			loading="lazy"
		/>
	);
}

export default Image;
