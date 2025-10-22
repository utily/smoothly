import { DateFormat } from "./DateFormat"

describe("DateFormat", () => {
	it.each([
		[{ Y: "2024", M: "02" }, 29],
		[{ Y: "2023", M: "02" }, 28],
		[{ Y: "2024", M: "01" }, 31],
		[{ Y: "2024", M: "04" }, 30],
		[{ M: "02" }, 29],
		[{ M: "01" }, 31],
		[{ M: "04" }, 30],
		[{}, 31],
	])("Parts.lastDay %p", (parts, expected) => {
		expect(DateFormat.Parts.lastDay(parts)).toBe(expected)
	})

	it.each([
		[{ Y: "2024", M: "02", D: "29" }, "2024-02-29"],
		[{ Y: "2023", M: "02", D: "29" }, "2023-02-28"],
		[{ Y: "2024", M: "04", D: "31" }, "2024-04-30"],
		[{ Y: "2024", M: "04" }, undefined],
		[{ Y: "2024" }, undefined],
		[{ M: "04", D: "31" }, undefined],
		[{ D: "31" }, undefined],
		[{}, undefined],
		[{ Y: "201", M: "01", D: "01" }, undefined], // Not padded
	])("Part.toDate %p", (parts: DateFormat.Parts, expected: string | undefined) => {
		expect(DateFormat.Parts.toDate(parts)).toBe(expected)
		expect(DateFormat.Parts.toDate(parts)).not.toBe(null)
	})
})
