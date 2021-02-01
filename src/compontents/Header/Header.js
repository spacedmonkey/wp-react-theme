/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

/**
 * External dependencies
 */
import { Link } from 'react-router-dom';

function Header() {
	const { metadata } = useConfig();
	const { description, name, logo } = metadata;

	return (
		<header id="masthead" className="site-header">
			<div className="site-branding">
				{logo && logo.src && (
					<Link to={`/`} rel="home" className="custom-logo-link">
						<img
							{...logo}
							alt={name}
							className="custom-logo"
							loading="lazy"
						/>
					</Link>
				)}
				<h1 className="site-title">
					<Link to={`/`} rel="home">
						{name}
					</Link>
				</h1>
				{description && (
					<p className="site-description">{description}</p>
				)}
			</div>
		</header>
	);
}

export default Header;
