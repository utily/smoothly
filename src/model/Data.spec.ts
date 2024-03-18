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
	it("Data.set multiple", () => {
		const input = {
			"name.last": "Smith",
			"name.first": "John",
			"address.city": "Uppsala",
			"address.zip": "75320",
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
		})
	})
})
