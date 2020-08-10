// tslint:disable-next-line: no-implicit-dependencies
import { FunctionalComponent, h } from "@stencil/core"
// tslint:disable-next-line: no-implicit-dependencies
import { createStaticRouter, Route, href } from "stencil-router-v2"

const Router = createStaticRouter()

export const App: FunctionalComponent<{ label: string }> = (attributes, children, utils) => (
	<smoothly-app>
		<header>
			<h1><a { ...href("/") }>{ attributes.label }</a></h1>
			{ children.filter(child => child.$attrs$.slot == "header") }
			<nav>
				<ul>
					{
						[
							...children.filter(child => child.$attrs$.slot == "nav-start"),
						...children.map(child => [child.$attrs$.label, child.$attrs$.path]).filter(e => e[0] && e[1]).map(e => <a href={ e[1] }>{ e[0] }</a>),
							...children.filter(child => child.$attrs$.slot == "nav-end"),
						].map(e => e.$tag$ = "a" ? <a { ...href(e.$attrs$.href) } class={ Router.activePath.endsWith(e.$attrs$.href) ? "active" : "" }>{ e.$children$ }</a> : e).map(e => <li>{ e }</li>)
					}
				</ul>
			</nav>
		</header>
		<content>
			<Router.Switch>
				{ children.filter(child => child.$attrs$.path).map(child => <Route path={ child.$attrs$.path }>{ child }</Route>) }
			</Router.Switch>
		</content>
	</smoothly-app>
)
