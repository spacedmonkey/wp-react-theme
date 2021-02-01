function PageHeader({ title, description }) {
	return (
		<header className="page-header">
			<h1
				className="page-title"
				dangerouslySetInnerHTML={{
					__html: title,
				}}
			/>
			<div
				className="archive-description"
				dangerouslySetInnerHTML={{
					__html: description,
				}}
			/>
		</header>
	);
}

export default PageHeader;
