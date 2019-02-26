// tslint:disable-next-line: no-submodule-imports
import { newE2EPage } from "@stencil/core/testing"

const complete = "<smoothly-input name='name' value='value' type='text' placeholder='xxxx xxxx' autocomplete='tel-extension' required pattern='\d{4}\s\d{4}'>Label</smoothly-input>"
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
		expect(element.getAttribute("placeholder")).toEqual("xxxx xxxx")
		expect(element).toHaveAttribute("required")
		expect(element.getAttribute("autocomplete")).toEqual("tel-extension")
		expect(element.getAttribute("pattern")).toEqual("\d{4}\s\d{4}")
	})
	it("input", async () => {
		const page = await newE2EPage()
		await page.setContent(complete)
		const input = await page.find("smoothly-input > input")
		expect(input.outerHTML).toEqual("<input name=\"name\" type=\"text\" placeholder=\"xxxx xxxx\" required=\"\" autocomplete=\"tel-extension\" pattern=\"d{4}sd{4}\" class=\"sc-smoothly-input\">")
		expect(input.getAttribute("name")).toEqual("name")
		expect(input.getAttribute("type")).toEqual("text")
		expect(input.getAttribute("placeholder")).toEqual("xxxx xxxx")
		expect(input).toHaveAttribute("required")
		expect(input.getAttribute("autocomplete")).toEqual("tel-extension")
		expect(input.getAttribute("pattern")).toEqual("\d{4}\s\d{4}")
	})
	it("label", async () => {
		const page = await newE2EPage()
		await page.setContent("<smoothly-input name='name' value='value'>Label</smoothly-input>")
		const label = await page.find("smoothly-input > label")
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
	expect(await input.getProperty("value")).toEqual("value1234")
})
it("fill out valid", async () => {
	const page = await newE2EPage()
	await page.setContent(complete)
	const input = await page.find("smoothly-input > input")
	await input.setProperty("value", "")
	await page.waitForChanges()
	expect(await input.getProperty("value")).toEqual("")
	await input.type("1234 ")
	expect(await input.getProperty("value")).toEqual("1234 ")
	await input.type("5678")
	expect(await input.getProperty("value")).toEqual("1234 5678")
})
it("fill out valid formated", async () => {
	const page = await newE2EPage()
	await page.setContent(`
<smoothly-input name='name' value='value' type='text' placeholder='xxxx xxxx' autocomplete='tel-extension' required pattern='\d{4}\s\d{4}'>Label</smoothly-input>
<script>
const inputCard = document.querySelector("smoothly-input[name='name']")
inputCard.addEventListener("valueChanged", event => {
	const value = event.detail.value
	let result = ""
	let counter = 0
	for (const character of value)
		if (character >= "0" && character <= 9) {
			result += character
			if (counter++ % 4 == 3)
				result += " "
		}
	event.detail.value = result
})
</script>
`)
	const input = await page.find("smoothly-input > input")
	await input.setProperty("value", "")
	await page.waitForChanges()
	expect(await input.getProperty("value")).toEqual("")
	await input.type("1234")
	expect(await input.getProperty("value")).toEqual("1234 ")
	await input.type("5678")
	expect(await input.getProperty("value")).toEqual("1234 5678 ")
})
