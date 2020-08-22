import { FunctionalComponent, h } from "@stencil/core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createStaticRouter, Route, href } from "stencil-router-v2"

const Router = createStaticRouter()

export const App: FunctionalComponent<{ label: string }> = (attributes, children, utils) => (
	<smoothly-app>
		<header>
			<h1>
				<a {...href(resolve("") ?? "/")}>{attributes.label}</a>
			</h1>
			{children.filter(child => child.$attrs$.slot == "header")}
			<nav>
				<ul>
					{[
						...children.filter(child => child.$attrs$.slot == "nav-start"),
						...children
							.map(child => [child.$attrs$.label, child.$attrs$.path])
							.filter(e => e[0] && e[1])
							.map(e => <a href={e[1]}>{e[0]}</a>),
						...children.filter(child => child.$attrs$.slot == "nav-end"),
					]
						.map(e => {
							const url = resolve(e.$attrs$.href)
							return e.$tag$ != "a" ? (
								e
							) : url ? (
								<a {...href(url)} class={Router.activePath == url ? "active" : ""}>
									{e.$children$}
								</a>
							) : (
								<a target="new" {...e.$attrs$}>
									{e.$children$}
								</a>
							)
						})
						.map(e => (
							<li>{e}</li>
						))}
				</ul>
			</nav>
		</header>
		<content>
			<Router.Switch>
				{children
					.filter(child => child.$attrs$.path != undefined)
					.map(child =>
						child.$attrs$.to ? (
							<Route path={resolve(child.$attrs$.path) ?? child.$attrs$.path} to={child.$attrs$.to}></Route>
						) : (
							<Route path={resolve(child.$attrs$.path) ?? child.$attrs$.path}>{child}</Route>
						)
					)}
			</Router.Switch>
		</content>
	</smoothly-app>
)
function resolve(url: string): string | undefined {
	const u = new URL(url, document.baseURI)
	return url == ""
		? new URL(document.baseURI).pathname
		: u.toString().startsWith(document.baseURI)
		? u.pathname
		: undefined
}
