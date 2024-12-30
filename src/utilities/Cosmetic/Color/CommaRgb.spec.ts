import { describe, expect, it } from "vitest"
import { CommaRgb } from "./CommaRgb"

describe("CommaRgb colorTransform", () => {
	it("commaRgb unformated", () => {
		expect(CommaRgb.from("0, 0, 0")).toEqual("0,0,0")
		expect(CommaRgb.from("255, 255, 255")).toEqual("255,255,255")
		expect(CommaRgb.from("255, 0, 0")).toEqual("255,0,0")
		expect(CommaRgb.from(" 0,255, 0")).toEqual("0,255,0")
	})
	it("commaRgb undefined", () => {
		expect(CommaRgb.from(undefined)).toEqual(undefined)
	})
	it("hexToCommaRgb", () => {
		expect(CommaRgb.from("#000000")).toEqual("0,0,0")
		expect(CommaRgb.from(" #ffffff")).toEqual("255,255,255")
		expect(CommaRgb.from("#ff0000")).toEqual("255,0,0")
		expect(CommaRgb.from("#00FF00")).toEqual("0,255,0")
	})
	it("hexToCommaRgb with short hex", () => {
		expect(CommaRgb.from("#000")).toEqual("0,0,0")
		expect(CommaRgb.from("#FFF")).toEqual("255,255,255")
		expect(CommaRgb.from(" #f00")).toEqual("255,0,0")
		expect(CommaRgb.from("#0F0")).toEqual("0,255,0")
	})
	it("rgbToCommaRgb", () => {
		expect(CommaRgb.from("rgb(0,0,0)")).toEqual("0,0,0")
		expect(CommaRgb.from("rgb(255,255,255)")).toEqual("255,255,255")
		expect(CommaRgb.from("RGB(255,0,0)")).toEqual("255,0,0")
		expect(CommaRgb.from("rgb(0,255,0)")).toEqual("0,255,0")
		expect(CommaRgb.from("rgb(-0,0,0)")).toEqual(undefined)
		expect(CommaRgb.from("rgb(0,+30,0)")).toEqual(undefined)
		expect(CommaRgb.from("rgb(256,255,255)")).toEqual(undefined)
		expect(CommaRgb.from("rgb(255,0,0,0)")).toEqual(undefined)
	})
	it("hsl", () => {
		expect(CommaRgb.from("hsl(0, 100%,50%)")).toEqual("255,0,0")
		expect(CommaRgb.from("hsl(120, 100%,50%)")).toEqual("0,255,0")
		expect(CommaRgb.from("hsl(240,100%,50%)")).toEqual("0,0,255")
		expect(CommaRgb.from("hsl(240,100%,0%)")).toEqual("0,0,0")
		expect(CommaRgb.from("hsl(180,100%, 50%)")).toEqual("0,255,255")
		expect(CommaRgb.from("hsl(240,100%,100%)")).toEqual("255,255,255")
	})
	it("colorNames", () => {
		expect(CommaRgb.from("red")).toEqual("255,0,0")
		expect(CommaRgb.from("green")).toEqual("0,128,0")
		expect(CommaRgb.from("blue")).toEqual("0,0,255")
		expect(CommaRgb.from("yellow ")).toEqual("255,255,0")
		expect(CommaRgb.from(" black ")).toEqual("0,0,0")
		expect(CommaRgb.from("white")).toEqual("255,255,255")
		expect(CommaRgb.from("magenta")).toEqual("255,0,255")
		expect(CommaRgb.from("cyan")).toEqual("0,255,255")
		expect(CommaRgb.from("navy")).toEqual("0,0,128")
	})
})
