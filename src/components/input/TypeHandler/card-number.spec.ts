import { TypeHandler } from "./"

describe("card-number", () => {
	const component = { type: "card-number" }
	it("exists", () => {
		expect(TypeHandler.create(component)).toBeTruthy()
	})
	it("key event first key", () => {
		const type = TypeHandler.create(component)
		const result = type.keyEventHandler({ value: "", selectionStart: 0, selectionEnd: 0 }, { key: "1" })
		expect(result.value).toEqual("1")
	})
	it("key event full visa number", () => {
		const type = TypeHandler.create(component)
		let result = { value: "", selectionStart: 0, selectionEnd: 0 }
		for (const character of "4242424242424242")
			result = type.keyEventHandler(result, { key: character })
		expect(result.value).toEqual("4242 4242 4242 4242")
	})
	it("key event full visa number with extra chars", () => {
		const type = TypeHandler.create(component)
		let result = { value: "", selectionStart: 0, selectionEnd: 0 }
		for (const character of "4242 424a 2424(242429999")
			result = type.keyEventHandler(result, { key: character })
		expect(result.value).toEqual("4242 4242 4242 4242")
	})
	it("key event backspace", () => {
		const type = TypeHandler.create(component)
		let result = { value: "4242 4242 4242 4242", selectionStart: 19, selectionEnd: 19 }
		result = type.keyEventHandler(result, { key: "Backspace" })
		expect(result.value).toEqual("4242 4242 4242 424")
	})
	it("key event backspace past formatting character", () => {
		const type = TypeHandler.create(component)
		let result = { value: "4242 4242 4242 ", selectionStart: 15, selectionEnd: 15 }
		result = type.keyEventHandler(result, { key: "Backspace" })
		expect(result.value).toEqual("4242 4242 424")
	})
})
