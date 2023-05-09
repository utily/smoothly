export namespace Icon {
	const names: Record<string, string | undefined> & { "*": string } = {
		"*": "https://site-icons.pages.dev/ionicons@5.0.0/dist/svg/${name}.svg",
	}
	const cache: { [url: string]: Promise<string | undefined> | undefined } = {}
	async function fetch(url: string): Promise<string | undefined> {
		const response = await globalThis.fetch(url)
		return response.ok ? response.text() : undefined
	}
	export async function load(name: string): Promise<string | undefined> {
		const url = (names[name] ?? names["*"]).replace("${name}", name)
		return cache[url] ?? (cache[url] = fetch(url))
	}
	export function add(url: string, ...name: string[]): void {
		for (const n of name)
			names[n] = url
	}
}
