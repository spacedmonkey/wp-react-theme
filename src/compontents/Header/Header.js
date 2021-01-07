/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

function Header() {
	const { metadata } = useConfig();
	const { url, description, name, logo } = metadata;

	return (
		<header id="masthead" className="site-header">
			<div className="site-branding">
				{ logo && logo.src && (
					<a href={ url } rel="home" className="custom-logo-link">
						<img
							{ ...logo }
							alt={ name }
							className="custom-logo"
							loading="lazy"
						/>
					</a>
				) }
				<h1 className="site-title">
					<a href={ url } rel="home">
						{ name }
					</a>
				</h1>
				{ description && (
					<p className="site-description">{ description }</p>
				) }
			</div>
		</header>
	);
}

export default Header;
