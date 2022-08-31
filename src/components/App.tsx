import { ChildNode, FunctionalComponent, h, VNode } from "@stencil/core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createRouter, href, Route } from "stencil-router-v2"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Router = createRouter()
export function redirect(url: string) {
	const destination = resolve(url)
	destination ? Router.push(destination) : (window.location.href = url)
}
export const App: FunctionalComponent<{ label: string }> = (attributes, nodes, utils) => {
	const emptyNode = Object.entries(nodes[0]).reduce<{ [property: string]: any }>((r, entry) => {
		r[entry[0]] = null
		return r
	}, {}) as VNode
	const emptyChild = nodeToChild(emptyNode)
	function nodeToChild(node: VNode): ChildNode {
		let result: ChildNode | undefined
		utils.forEach([node], child => (result = child))
		return result ?? emptyChild
	}
	function childToNode(child: ChildNode): VNode {
		return utils.map([emptyNode], c => ({ ...c, ...child }))[0]
	}
	const children = nodes.map(node => ({ ...nodeToChild(node), node }))
	return (
		<smoothly-app>
			<header>
				<h1>
					<a {...href(resolve("") ?? "/")}>{attributes.label}</a>
				</h1>
				<nav>
					<ul>
						{utils
							.map(
								[
									...children.filter(child => child.vattrs?.slot == "nav-start"),
									...children.filter(
										child => child.vattrs?.label && child.vattrs?.path && typeof child.vattrs?.path == "string"
									),
									...children.filter(child => child.vattrs?.slot == "nav-end"),
								].map(child => child.node),
								child => {
									if (child.vattrs?.label && child.vattrs?.path)
										child = {
											...emptyChild,
											vtag: "a",
											vattrs: { href: child.vattrs?.path },
											vchildren: [
												child.vattrs?.icon
													? childToNode({
															vtag: "smoothly-icon",
															vattrs: {
																toolTip: child.vattrs?.label,
																name: child.vattrs?.icon,
																size: "medium",
															},
													  })
													: childToNode({ vtext: child.vattrs?.label }),
											],
										}
									const url = resolve(child.vattrs?.href)
									return child.vtag != "a"
										? child
										: url
										? {
												...child,
												vattrs: {
													...child.vattrs,
													class: [child.vattrs?.class, Router.activePath == url ? "active" : ""].join(" ") || undefined,
													href: url,
												},
										  }
										: { ...child, vattrs: { ...child.vattrs, target: "new" } }
								}
							)
							.map(node => {
								const child = nodeToChild(node)
								return child.vtag == "a" && !child.vattrs?.target ? (
									<a {...child.vattrs} {...href(child.vattrs?.href)}>
										{child.vchildren}
									</a>
								) : (
									node
								)
							})
							.map(child => (
								<li>{child}</li>
							))}
					</ul>
				</nav>
				{children.filter(child => child.vattrs?.slot == "header").map(child => child.node)}
			</header>
			<main>
				<Router.Switch>
					{children
						.filter(child => child.vattrs?.path != undefined)
						.map(child => {
							const path = typeof child.vattrs?.path == "string" ? resolve(child.vattrs?.path) : child.vattrs?.path
							return child.vattrs?.to ? (
								<Route path={path} to={child.vattrs?.to}></Route>
							) : (
								<Route path={path}>{child.node}</Route>
							)
						})}
				</Router.Switch>
			</main>
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
