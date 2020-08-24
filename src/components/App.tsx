import { ChildNode, FunctionalComponent, h, VNode } from "@stencil/core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createStaticRouter, Route, href } from "stencil-router-v2"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Router = createStaticRouter()

export const App: FunctionalComponent<{ label: string }> = (attributes, nodes, utils) => {
	const emptyNode = Object.entries(nodes[0]).reduce<{ [property: string]: any }>((r, entry) => {
		r[entry[0]] = null
		return r
	}, {}) as VNode
	const emptyChild = convertToPublic(emptyNode)[0]
	function convertToPublic(...nodes: VNode[]): (ChildNode & { node: VNode })[] {
		const result: (ChildNode & { node: VNode })[] = []
		utils.forEach(nodes, (child, index) => result.push({ ...child, node: nodes[index] }))
		return result
	}
	const children = convertToPublic(...nodes)
	return (
		<smoothly-app>
			<header>
				<h1>
					<a {...href(resolve("") ?? "/")}>{attributes.label}</a>
				</h1>
				{children.filter(child => child.vattrs.slot == "header").map(child => child.node)}
				<nav>
					<ul>
						{utils
							.map(
								[
									...children.filter(child => child.vattrs.slot == "nav-start"),
									...children.filter(child => child.vattrs.label && child.vattrs.path),
									...children.filter(child => child.vattrs.slot == "nav-end"),
								].map(child => child.node),
								child => {
									if (child.vattrs.label && child.vattrs.path)
										child = {
											...emptyChild,
											vtag: "a",
											vattrs: { href: child.vattrs.path },
											vchildren: utils.map([emptyNode], c => ({ ...c, vtext: child.vattrs.label })),
										}
									console.log(
										JSON.stringify(
											{ ...child, vchildren: child.vchildren && convertToPublic(...child.vchildren) },
											undefined,
											"  "
										)
									)
									const url = resolve(child.vattrs.href)
									return child.vtag != "a"
										? child
										: url
										? {
												...child,
												vattrs: {
													...child.vattrs,
													class: [child.vattrs.class, Router.activePath == url ? "active" : ""].join(" ") || undefined,
													href: url,
												},
										  }
										: { ...child, vattrs: { ...child.vattrs, target: "new" } }
								}
							)
							.map(node => {
								const child = convertToPublic(node)[0]
								return child.vtag == "a" && !child.vattrs.target ? (
									<a {...child.vattrs} {...href(child.vattrs.href)}>
										{child.vchildren}
									</a>
								) : (
									child.node
								)
							})
							.map(child => (
								<li>{child}</li>
							))}
					</ul>
				</nav>
			</header>
			<content>
				<Router.Switch>
					{children
						.filter(child => child.vattrs.path != undefined)
						.map(child =>
							child.vattrs.to ? (
								<Route path={resolve(child.vattrs.path) ?? child.vattrs.path} to={child.vattrs.to}></Route>
							) : (
								<Route path={resolve(child.vattrs.path) ?? child.vattrs.path}>{child.node}</Route>
							)
						)}
				</Router.Switch>
			</content>
		</smoothly-app>
	)
}
function resolve(url: string): string | undefined {
	const u = new URL(url, document.baseURI)
	return url == ""
		? new URL(document.baseURI).pathname
		: u.toString().startsWith(document.baseURI)
		? u.pathname
		: undefined
}
