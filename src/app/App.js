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
} from '../compontents';
import { QueryProvider } from './query';
import { CommentProvider } from './comments';
import { ConfigProvider } from './config';

/**
 * External dependencies
 */
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App( { config } ) {
	const { config: siteConfig } = config;
	const { taxonomies, front } = siteConfig;

	return (
		<>
			<ConfigProvider config={ config }>
				<Header />
				<main id="primary" className="site-main">
					<Router>
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
										taxonomies.map( ( tax ) => (
											<Route
												path={ `${ front }${ tax.rewrite.slug }/:slug/(page)?/:page?` }
												key={ 'page' + tax.rest_base }
											>
												<TaxonomyArchive
													restBase={ tax.rest_base }
													key={
														'page' + tax.rest_base
													}
												/>
											</Route>
										) ) }

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
					</Router>
				</main>
				<Sidebar />
				<Footer />
			</ConfigProvider>
		</>
	);
}
export default App;
