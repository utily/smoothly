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
	it("normalize() rounds each bound and passes undefined/NaN through as undefined", () => {
		expect(Range.normalize({ start: 0.126, end: 99.874 }, 0.01)).toEqual({ start: 0.13, end: 99.87 })
		expect(Range.normalize(3.7, 1)).toBe(4)
		expect(Range.normalize(undefined, 1)).toBe(undefined)
		expect(Range.normalize(NaN, 1)).toBe(undefined)
	})
	it("normalize() is value-idempotent so the value watcher converges (no infinite re-round)", () => {
		// The @Watch("value") handler reassigns this.value = normalize(value) only while it
		// differs BY VALUE. If normalize weren't idempotent, an object branch would produce a
		// new reference every fire and recurse forever. Simulate the watch loop:
		for (const seed of [{ start: 30, end: 70 } as Range.Value, 42, undefined]) {
			let value = seed
			let normalized = Range.normalize(value, 1)
			let iterations = 0
			while (!Range.equals(normalized, value)) {
				value = normalized
				normalized = Range.normalize(value, 1)
				if (++iterations > 3) {
					break
				}
			}
			expect(iterations).toBeLessThanOrEqual(1)
		}
	})
	it("setPart is idempotent — re-applying a bound's own value yields an equal range (guards the setRange loop)", () => {
		// setRange no-ops when setPart(current, part, value) equals the current value. That guard
		// only converges if setPart is idempotent at its own result; otherwise writing the value
		// back into the field would recurse ("too much recursion" when editing dual fields).
		const r: Range = { start: 30, end: 70 }
		expect(Range.equals(Range.setPart(r, "start", r.start, 0, 100), r)).toBe(true)
		expect(Range.equals(Range.setPart(r, "end", r.end, 0, 100), r)).toBe(true)
		// after a cross-over clamp, re-applying the clamped bound is also stable
		const clamped = Range.setPart(r, "end", 10, 0, 100) // end below start -> { start: 30, end: 30 }
		expect(clamped).toEqual({ start: 30, end: 30 })
		expect(Range.equals(Range.setPart(clamped, "end", clamped.end, 0, 100), clamped)).toBe(true)
	})
})
