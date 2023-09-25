export function redirect(path: string): void {
	const state = { smoothlyPath: path }
	const url = new URL(window.location.href)
	url.pathname = path
	window.history.pushState(state, "", path)
	window.dispatchEvent(new PopStateEvent("popstate", { state }))
}
