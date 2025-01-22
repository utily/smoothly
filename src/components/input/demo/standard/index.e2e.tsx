import { newE2EPage } from "@stencil/core/testing"

describe("smoothly-input-demo-standard", () => {
	it("should render my component 2", async () => {
		const page = await newE2EPage()
		await page.setContent("<smoothly-input-demo-standard />")
		const element = await page.find("smoothly-input-demo-standard > div.description")
		expect(element).not.toBeNull()
		expect(element.tagName).toBe("DIV")
	})
})
