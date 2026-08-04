import { Range } from "./Range"

describe("Range", () => {
	it("is() distinguishes range objects from numbers/undefined", () => {
		expect(Range.is({ start: 1, end: 2 })).toBe(true)
		expect(Range.is(5)).toBe(false)
		expect(Range.is(undefined)).toBe(false)
	})
	it("clamp() constrains to [min, max]", () => {
		expect(Range.clamp(-5, 0, 100)).toBe(0)
		expect(Range.clamp(150, 0, 100)).toBe(100)
		expect(Range.clamp(42, 0, 100)).toBe(42)
	})
	it("round() mirrors step decimals (undefined step -> integer)", () => {
		expect(Range.round(0.12345, 0.01)).toBe(0.12)
		expect(Range.round(3.7, 1)).toBe(4)
		expect(Range.round(3.7, undefined)).toBe(4)
	})
	it("setPart() hard-stops start at end and end at start", () => {
		const current = { start: 30, end: 70 }
		expect(Range.setPart(current, "start", 90, 0, 100)).toEqual({ start: 70, end: 70 })
		expect(Range.setPart(current, "end", 10, 0, 100)).toEqual({ start: 30, end: 30 })
	})
	it("setPart() clamps to [min, max] before comparing", () => {
		const current = { start: 30, end: 70 }
		expect(Range.setPart(current, "start", -5, 0, 100)).toEqual({ start: 0, end: 70 })
		expect(Range.setPart(current, "end", 150, 0, 100)).toEqual({ start: 30, end: 100 })
	})
	it("equals() compares both shapes and undefined", () => {
		expect(Range.equals({ start: 1, end: 2 }, { start: 1, end: 2 })).toBe(true)
		expect(Range.equals({ start: 1, end: 2 }, { start: 1, end: 3 })).toBe(false)
		expect(Range.equals(5, 5)).toBe(true)
		expect(Range.equals(undefined, undefined)).toBe(true)
		expect(Range.equals(5, undefined)).toBe(false)
	})
	it("defined() requires number(s)", () => {
		expect(Range.defined(5)).toBe(true)
		expect(Range.defined({ start: 1, end: 2 })).toBe(true)
		expect(Range.defined(undefined)).toBe(false)
	})
	it("percent() maps value to 0-100 within range", () => {
		expect(Range.percent(50, 0, 100)).toBe(50)
		expect(Range.percent(0, 0, 100)).toBe(0)
		expect(Range.percent(75, 50, 100)).toBe(50)
	})
})
