import { ChildNode, FunctionalComponent, h, VNode } from "@stencil/core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createRouter, href, Route } from "stencil-router-v2"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Router = createRouter()

export const App: FunctionalComponent<{ label: string }> = (attributes, nodes, utils) => {
	const emptyNode = Object.entries(nodes[0]).reduce<{ [property: string]: any }>((r, entry) => {
		r[entry[0]] = null
		return r
	}, {}) as VNode
	console.log("emptyNode", emptyNode)
	const emptyChild = nodeToChild(emptyNode)
	function nodeToChild(node: VNode): ChildNode {
		let result: ChildNode | undefined
		utils.forEach([node], child => (result = child))
		return result ?? emptyChild
	}
	function childToNode(child: ChildNode): VNode {
		return utils.map([emptyNode], c => ({ ...c, ...child }))[0]
	}
	function filterNavigation(kids: (ChildNode & { node: VNode })[]): VNode[] {
		return [
			...kids.filter(child => child.vattrs?.slot == "nav-start"),
			...kids.filter(child => child.vattrs?.label && child.vattrs?.path),
			...kids.filter(child => child.vattrs?.slot == "nav-end"),
		].map(child => child.node)
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
							.map(filterNavigation(children), c => c)
							.map(node => {
								const child = nodeToChild(node)
								const url = child.vattrs?.href ? resolve(child.vattrs.href) : resolve(child.vattrs?.path)
								return url && !child.vattrs?.target ? (
									<a
										{...child.vattrs}
										{...href(url)}
										class={[child.vattrs?.class, Router.activePath == url ? "active" : ""].join(" ") || undefined}>
										{child?.vattrs.icon ? (
											<smoothly-icon
												toolTip={child.vattrs?.label}
												name={child.vattrs?.icon}
												size="medium"></smoothly-icon>
										) : (
											child.vattrs?.label ?? child.vchildren
										)}
									</a>
								) : child.vtag == "a" ? (
									<a {...child.vattrs} target="new">
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
						.map(child =>
							child.vattrs?.to ? (
								<Route path={resolve(child.vattrs?.path) ?? child.vattrs?.path} to={child.vattrs?.to}></Route>
							) : (
								<Route path={resolve(child.vattrs?.path) ?? child.vattrs?.path}>{child.node}</Route>
							)
						)}
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
