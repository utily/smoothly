import { Deep } from "./Deep"

describe("Deep", () => {
	it.each([
		[1, 1, true],
		[1, 2, false],
		[{ a: 1 }, { a: 1 }, true],
		[{ a: 1 }, { a: 2 }, false],
		[{ a: 1 }, { b: 1 }, false],
		[{ a: 1 }, { b: 2 }, false],
		[{ a: 1, b: 2 }, { a: 1, b: 2 }, true],
		[{ a: 1, b: 2 }, { a: 1, b: 3 }, false],
		[{ a: 1, b: 2 }, { a: 1, c: 2 }, false],
	])("equal(%p, %p)", (a: any, b: any, isEqual: boolean) => {
		expect(Deep.equal(a, b)).toEqual(isEqual)
		expect(Deep.notEqual(a, b)).toEqual(!isEqual)
	})
})
