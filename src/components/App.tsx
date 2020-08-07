// tslint:disable-next-line: no-implicit-dependencies
import { FunctionalComponent, h } from "@stencil/core"
// tslint:disable-next-line: no-implicit-dependencies
import { createStaticRouter, Route, href } from "stencil-router-v2"

const Router = createStaticRouter()

export const App: FunctionalComponent<{ title: string }> = (attributes, children, utils) => (
	<smoothly-app>
		<header>
			<h1><a { ...href("/") }>{ attributes.title }</a></h1>
			<p>test</p>
			<nav>
				<ul>
					{ children.map(child => [child.$attrs$.title, child.$attrs$.path]).filter(e => e[0]).map(e => <li><a { ...href(e[1]) }>{ e[0] }</a></li>) }
				</ul>
			</nav>
		</header>
		<content>
			<Router.Switch>
				{ children.map(child => <Route path={ child.$attrs$.path }>{child}</Route>) }
			</Router.Switch>
		</content>
	</smoothly-app>
)
