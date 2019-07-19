import { State } from "./State"
import { StateEditor } from "./StateEditor"

describe("StateEditor", () => {
	it("create", () => {
		expect(StateEditor.create()).toMatchObject({ value: "", selectionStart: 0, selectionEnd: 0 })
	})
	it("modify", () => {
		const state: State = { value: "abcdefg", selectionStart: 3, selectionEnd: 4 }
		const result = StateEditor.modify(state)
		expect(result).toMatchObject(state)
		result.insert("0", 0)
		expect(result).toMatchObject(state)
		expect(result).toMatchObject({ value: "0abcdefg" })
	})
	it("copy", () => {
		const state: State = { value: "abcdefg", selectionStart: 3, selectionEnd: 4 }
		const result = StateEditor.copy(state)
		expect(result).toMatchObject(state)
		result.insert("0", 0)
		expect(result).not.toMatchObject(state)
		expect(result).toMatchObject({ value: "0abcdefg" })
	})
	it("insert", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 4 })
		result.insert("0", 0)
		expect(result.value).toEqual("0abcdefg")
		expect(result.selectionStart).toEqual(4)
		expect(result.selectionEnd).toEqual(5)
	})
	it("replace before selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 4 })
		result.replace("0", 2, 3)
		expect(result.value).toEqual("ab0defg")
		expect(result.selectionStart).toEqual(3)
		expect(result.selectionEnd).toEqual(4)
	})
	it("replace after selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 4 })
		result.replace("0", 4, 6)
		expect(result.value).toEqual("abcd0g")
		expect(result.selectionStart).toEqual(3)
		expect(result.selectionEnd).toEqual(4)
	})
	it("replace in selection", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 5 })
		result.replace("0", 3, 5)
		expect(result.value).toEqual("abc0fg")
		expect(result.selectionStart).toEqual(3)
		expect(result.selectionEnd).toEqual(4)
	})
	it("replace overlaps selection start", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 5 })
		result.replace("0", 2, 4)
		expect(result.value).toEqual("ab0efg")
		expect(result.selectionStart).toEqual(3)
		expect(result.selectionEnd).toEqual(4)
	})
	it("replace overlaps selection end", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 2, selectionEnd: 5 })
		result.replace("0", 3, 6)
		expect(result.value).toEqual("abc0g")
		expect(result.selectionStart).toEqual(2)
		expect(result.selectionEnd).toEqual(4)
	})
	it("delete", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 4 })
		result.delete(0, 2)
		expect(result.value).toEqual("cdefg")
		expect(result.selectionStart).toEqual(1)
		expect(result.selectionEnd).toEqual(2)
	})
	it("delete one argument", () => {
		const result = StateEditor.modify({ value: "abcdefg", selectionStart: 3, selectionEnd: 3 })
		result.delete(2)
		expect(result.value).toEqual("abdefg")
		expect(result.selectionStart).toEqual(2)
		expect(result.selectionEnd).toEqual(2)
	})
})
