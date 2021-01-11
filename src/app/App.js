/**
 * External dependencies
 */
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/**
 * WordPress dependencies
 */
import { Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */
const Home = lazy( () => import( '../compontents/Home' ) );
const Header = lazy( () => import( '../compontents/Header' ) );
const Footer = lazy( () => import( '../compontents/Footer' ) );
const SinglePost = lazy( () => import( '../compontents/SinglePost' ) );
const SinglePage = lazy( () => import( '../compontents/SinglePage' ) );
const TaxonomyArchive = lazy( () =>
	import( '../compontents/TaxonomyArchive' )
);
const AuthorArchive = lazy( () => import( '../compontents/AuthorArchive' ) );
const Search = lazy( () => import( '../compontents/Search' ) );
const DateArchive = lazy( () => import( '../compontents/DateArchive' ) );
const Scroll = lazy( () => import( '../compontents/Scroll' ) );
const Sidebar = lazy( () => import( '../compontents/Sidebar' ) );
const SkipLink = lazy( () => import( '../compontents/SkipLink' ) );
const Navigation = lazy( () => import( '../compontents/Navigation' ) );
import { Loading } from '../compontents';
import { QueryProvider } from './query';
import { CommentProvider } from './comments';
import { ConfigProvider } from './config';

function App( { config } ) {
	const { config: siteConfig } = config;
	const { taxonomies, front } = siteConfig;

	return (
		<>
			<Suspense fallback={ <Loading /> }>
				<ConfigProvider config={ config }>
					<Router>
						<SkipLink />
						<Header />
						<Navigation />
						<main id="primary" className="site-main react-rendered">
							<Scroll />
							<QueryProvider>
								<CommentProvider>
									<Switch>
										<Route exact path="/">
											<Home />
										</Route>
										<Route exact path="/page/:page">
											<Home />
										</Route>
										{ taxonomies &&
											taxonomies.map( ( tax ) => {
												const paths = [
													`${ front }${ tax.rewrite.slug }/:slug/(page)?/:page(\\d+)?`,
												];
												if ( tax.hierarchical ) {
													paths.unshift(
														`${ front }${ tax.rewrite.slug }/:parentSlug/:slug/(page)?/:page(\\d+)?`
													);
													paths.unshift(
														`${ front }${ tax.rewrite.slug }/:granParentSlug/:parentSlug/:slug/(page)?/:page(\\d+)?`
													);
												}

												return (
													<Route
														path={ paths }
														key={
															'page' +
															tax.rest_base
														}
													>
														<TaxonomyArchive
															restBase={
																tax.rest_base
															}
															key={
																'page' +
																tax.rest_base
															}
														/>
													</Route>
												);
											} ) }

										<Route
											path={ `${ front }author/:slug/(page)?/:page?` }
										>
											<AuthorArchive />
										</Route>

										<Route path="/search/:searchTerm/(page)?/:page?">
											<Search />
										</Route>

										<Route
											path={ [
												`${ front }date/:year(\\d+)/:month/:day/(page)?/:page?`,
												`${ front }date/:year(\\d+)/:month/(page)?/:page?`,
												`${ front }date/:year(\\d+)/(page)?/:page?`,
											] }
										>
											<DateArchive />
										</Route>

										<Route path={ `${ front }:postSlug` }>
											<SinglePost />
										</Route>

										<Route path="*">
											<SinglePage />
										</Route>
									</Switch>
								</CommentProvider>
							</QueryProvider>
						</main>
						<Sidebar />
					</Router>
					<Footer />
				</ConfigProvider>
			</Suspense>
		</>
	);
}
export default App;
