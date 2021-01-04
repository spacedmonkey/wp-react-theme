function PageHeader( { title, description } ) {
	return (
		<header className="page-header">
			<h1 className="page-title">{ title }</h1>
			<div className="archive-description">{ description }</div>
		</header>
	);
}

export default PageHeader;
