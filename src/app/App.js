/**
 * External dependencies
 */
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/**
 * Internal dependencies
 */
import {
	Header,
	Footer,
	SinglePost,
	SinglePage,
	TaxonomyArchive,
	AuthorArchive,
	Search,
	Home,
	DateArchive,
	Scroll,
	Sidebar,
	SkipLink,
	Navigation,
} from '../compontents';
import { QueryProvider } from './query';
import { CommentProvider } from './comments';
import { ConfigProvider } from './config';
import { BodyClassesProvider } from './bodyClasses';

function App( { config } ) {
	const { config: siteConfig } = config;
	const { taxonomies, front } = siteConfig;

	return (
		<>
			<ConfigProvider config={ config }>
				<BodyClassesProvider>
					<Router>
						<SkipLink />
						<Header />
						<Navigation />
						<main id="primary" className="site-main">
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
															name={ tax.name }
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
				</BodyClassesProvider>
			</ConfigProvider>
		</>
	);
}
export default App;
