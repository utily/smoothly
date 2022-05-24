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
	const emptyChild = nodeToChild(emptyNode)
	function nodeToChild(node: VNode): ChildNode {
		let result: ChildNode | undefined
		utils.forEach([node], child => (result = child))
		return result ?? emptyChild
	}

	const children = nodes.map(node => ({ ...nodeToChild(node), node }))
	function filterNavigation(): VNode[] {
		return utils.map(
			[
				...children.filter(child => child.vattrs?.slot == "nav-start"),
				...children.filter(child => child.vattrs?.label && child.vattrs?.path),
				...children.filter(child => child.vattrs?.slot == "nav-end"),
			].map(child => child.node),
			c => c
		)
	}
	function nodeToListItem(node: VNode): HTMLLIElement {
		const child = nodeToChild(node)
		const url = child.vattrs?.href ? resolveLocalUrl(child.vattrs.href) : resolveLocalUrl(child.vattrs?.path)
		return (
			<li>
				{url && !child.vattrs?.target ? (
					<a
						{...child.vattrs}
						{...href(url)}
						class={[child.vattrs?.class, Router.activePath == url ? "active" : ""].join(" ") || undefined}>
						{child?.vattrs.icon ? (
							<smoothly-icon toolTip={child.vattrs?.label} name={child.vattrs?.icon} size="medium"></smoothly-icon>
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
				)}
			</li>
		)
	}

	return (
		<smoothly-app>
			<header>
				<h1>
					<a {...href(resolveLocalUrl("") ?? "/")}>{attributes.label}</a>
				</h1>
				<nav>
					<ul>{filterNavigation().map(nodeToListItem)}</ul>
				</nav>
				{children.filter(child => child.vattrs?.slot == "header").map(child => child.node)}
			</header>
			<main>
				<Router.Switch>
					{children
						.filter(child => child.vattrs?.path != undefined)
						.map(child =>
							child.vattrs?.to ? (
								<Route path={resolveLocalUrl(child.vattrs?.path) ?? child.vattrs?.path} to={child.vattrs?.to}></Route>
							) : (
								<Route path={resolveLocalUrl(child.vattrs?.path) ?? child.vattrs?.path}>{child.node}</Route>
							)
						)}
				</Router.Switch>
			</main>
		</smoothly-app>
	)
}

function resolveLocalUrl(url: string): string | undefined {
	const u = new URL(url, document.baseURI)
	return url == ""
		? new URL(document.baseURI).pathname
		: u.toString().startsWith(document.baseURI)
		? u.pathname
		: undefined
}
