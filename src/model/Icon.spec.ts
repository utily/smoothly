import { Icon } from "./Icon"

describe("Icon.symbol", () => {
	const svg = (path: string, viewBox = "0 0 512 512") =>
		`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="${viewBox}"><path d="${path}"/></svg>`
	beforeEach(() => {
		globalThis.fetch = vi.fn(
			async (url: string) =>
				new Response(url.endsWith("/square.svg") ? svg("M0 0h1", "0 0 24 24") : svg("M1 1h1"), { status: 200 })
		) as unknown as typeof fetch
	})
	afterEach(() => vi.restoreAllMocks())
	const symbols = () => Array.from(document.querySelectorAll("svg[data-smoothly-icons] > symbol"))

	it("adds the icon to the shared sprite once and returns its id and viewBox", async () => {
		const first = await Icon.symbol("circle")
		const second = await Icon.symbol("circle")
		expect(first).toEqual(second)
		expect(first?.viewBox).toEqual("0 0 512 512")
		const symbol = document.getElementById(first?.id ?? "")
		expect(symbol?.localName).toEqual("symbol")
		expect(symbol?.getAttribute("viewBox")).toEqual("0 0 512 512")
		expect(symbol?.innerHTML).toContain('d="M1 1h1"')
		expect(symbols().filter(s => s.id == first?.id)).toHaveLength(1)
	})
	it("gives each icon its own symbol and keeps its viewBox", async () => {
		const circle = await Icon.symbol("circle")
		const square = await Icon.symbol("square")
		expect(square?.id).not.toEqual(circle?.id)
		expect(square?.viewBox).toEqual("0 0 24 24")
		expect(document.querySelectorAll("svg[data-smoothly-icons]")).toHaveLength(1)
	})
	it("returns undefined when the icon cannot be loaded", async () => {
		globalThis.fetch = vi.fn(async () => new Response("", { status: 404 })) as unknown as typeof fetch
		vi.spyOn(console, "warn").mockImplementation(() => undefined)
		expect(await Icon.symbol("missing-icon")).toBeUndefined()
	})
})
