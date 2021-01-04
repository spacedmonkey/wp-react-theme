/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

function Header() {
	const { metadata } = useConfig();
	const { url, description, name, logo, menu } = metadata;

	return (
		<header id="masthead" className="site-header">
			<div className="site-branding">
				<div dangerouslySetInnerHTML={ { __html: logo } } />
				<h1 className="site-title">
					<a href={ url } rel="home">
						{ name }
					</a>
				</h1>
				{ description && (
					<p className="site-description">{ description }</p>
				) }
			</div>
			<nav
				id="site-navigation"
				className="main-navigation"
				dangerouslySetInnerHTML={ { __html: menu } }
			/>
		</header>
	);
}

export default Header;
