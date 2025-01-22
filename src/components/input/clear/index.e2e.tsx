import { newE2EPage } from "@stencil/core/testing"
import { Input } from "../Input"

describe("smoothly-input-clear", () => {
	it("smoothly-input", async () => {
		const page = await newE2EPage()
		await page.setContent(`<smoothly-input name="test">
			<smoothly-input-clear slot="end" />
		</smoothly-input>`)
		const input = await page.find("smoothly-input")
		expect(input.tagName).toEqual("SMOOTHLY-INPUT")
		const clear = await page.find("smoothly-input-clear[slot='end']")
		expect(clear.tagName).toEqual("SMOOTHLY-INPUT-CLEAR")

		input.type("Hello")
		expect(Input.Element.is(input)).toBeTruthy()
	})
})
