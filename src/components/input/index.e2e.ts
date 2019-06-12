// tslint:disable-next-line: no-submodule-imports
import { newE2EPage } from "@stencil/core/testing"

const complete = "<smoothly-input name='name' value='value' type='text' required>Label</smoothly-input>"
describe("smoothly-input", () => {
	it("renders", async () => {
		const page = await newE2EPage()
		await page.setContent("<smoothly-input></smoothly-input>")
		const element = await page.find("smoothly-input")
		expect(element).toHaveClass("hydrated")
	})
	it("attributes", async () => {
		const page = await newE2EPage()
		await page.setContent(complete)
		const element = await page.find("smoothly-input")
		expect(element.getAttribute("name")).toEqual("name")
		expect(element.getAttribute("type")).toEqual("text")
		expect(element).toHaveAttribute("required")
	})
	it("input", async () => {
		const page = await newE2EPage()
		await page.setContent(complete)
		const input = await page.find("smoothly-input > input")
		expect(input.outerHTML).toEqual("<input name=\"name\" class=\"sc-smoothly-input\">")
		expect(input.getAttribute("name")).toEqual("name")
	})
	it("label", async () => {
		const page = await newE2EPage()
		await page.setContent("<smoothly-input name='name' value='value'>Label</smoothly-input>")
		const label = await page.find("smoothly-input > label")
		expect(label).toBeTruthy()
		expect(label).toHaveAttribute("for")
		expect(label.getAttribute("for")).toEqual("name")
		expect(label.textContent).toEqual("Label")
	})
})
it("fill out", async () => {
	const page = await newE2EPage()
	await page.setContent(complete)
	const input = await page.find("smoothly-input > input")
	await input.type("1234")
	expect(await input.getProperty("value")).toEqual("1234")
})
it("fill out valid", async () => {
	const page = await newE2EPage()
	await page.setContent("<smoothly-input name='name' type='text' required>Label</smoothly-input>")
	const input = await page.find("smoothly-input > input")
	expect(await input.getProperty("value")).toEqual("")
	await input.type("1234 ")
	expect(await input.getProperty("value")).toEqual("1234 ")
	await input.type("5678")
	expect(await input.getProperty("value")).toEqual("1234 5678")
})
