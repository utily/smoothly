import { Blob } from "web-file-polyfill"
import { Data } from "./Data"
globalThis.Blob = Blob

describe("Data", () => {
	it("is", () => {
		expect(Data.type.is({ aaa: "bbb" })).toEqual(true)
		expect(Data.type.is({ aaa: new Blob(), bbb: { ccc: new Blob() } })).toEqual(true)
		expect(Data.type.is(null)).toEqual(false)
	})
	it("Data.set", () => expect(Data.set({}, "name.last".split("."), "Smith")).toEqual({ name: { last: "Smith" } }))
	it("Data.convertArrays", () => {
		const input = {
			"1": "one",
			"0": "zero",
			"2": "two",
			"3": "three",
		}
		const output = Data.convertArrays(input)
		expect(output).toEqual(["zero", "one", "two", "three"])
	})
	it("Data.convertArrays incomplete array", () => {
		const input = {
			"0": "zero",
			"1": "one",
			"3": "three",
		}
		const output = Data.convertArrays(input)
		expect(output).toEqual(["zero", "one", undefined, "three"])
	})
	it("Data.set multiple", () => {
		const file = new File(["PDF"], "my file")
		const input: any = {
			"name.last": "Smith",
			"name.first": "John",
			"address.city": "Uppsala",
			"address.zip": "75320",
			"favoriteColors.0": "teal",
			"favoriteColors.1": "orange",
			"pets.1.name": "Mr Meow",
			"pets.1.type": "cat",
			"pets.0.name": "Barky",
			"pets.0.type": "dog",
			"pets.2.type": "turtle",
			"pets.2.name": "Speedster",
			"work.duration": {},
			// file: new File(["PDF"], "my file"),
			"receipts.0.file": file,
		}
		const output = Data.deepen(input)
		expect(output).toEqual({
			address: {
				city: "Uppsala",
				zip: "75320",
			},
			name: {
				first: "John",
				last: "Smith",
			},
			favoriteColors: { 0: "teal", 1: "orange" },
			pets: {
				0: { name: "Barky", type: "dog" },
				1: { name: "Mr Meow", type: "cat" },
				2: { name: "Speedster", type: "turtle" },
			},
			receipts: { 0: { file } },
			work: { duration: {} },
		})
		const outputWithArrays = Data.convertArrays(output)
		expect(outputWithArrays).toEqual({
			address: {
				city: "Uppsala",
				zip: "75320",
			},
			name: {
				first: "John",
				last: "Smith",
			},
			favoriteColors: ["teal", "orange"],
			pets: [
				{ name: "Barky", type: "dog" },
				{ name: "Mr Meow", type: "cat" },
				{ name: "Speedster", type: "turtle" },
			],
			work: { duration: {} },
			receipts: [{ file }],
		})
	})
})
