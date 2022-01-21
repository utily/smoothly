import { GoogleFont } from "./GoogleFont"

describe("GoogleFont", () => {
	it("GoogleFont.is", () => {
		expect(GoogleFont.is("Rubik+Beastly")).toEqual(true)
		expect(GoogleFont.is("Roboto:ital")).toEqual(true)
		expect(GoogleFont.is("Lexend:wght@300")).toEqual(true)
		expect(GoogleFont.is("Lexend:wght@500;600;700")).toEqual(true)
		expect(GoogleFont.is("Roboto:wght@0,400;0,700")).toEqual(true)
		expect(GoogleFont.is("Roboto:ital,wght@0,400;0,700;1,500")).toEqual(true)
	})
	it("getFont", () => {
		expect(GoogleFont.getFont("One Two Three")).toEqual("One Two Three")
		expect(GoogleFont.getFont("One+Two+Three")).toEqual("One Two Three")
		expect(GoogleFont.getFont("Rubik+Beastly")).toEqual("Rubik Beastly")
		expect(GoogleFont.getFont("Roboto:ital")).toEqual("Roboto")
		expect(GoogleFont.getFont("Roboto:wght@0,400;0,700")).toEqual("Roboto")
		expect(GoogleFont.getFont("Roboto:ital,wght@0,400;0,700;1,500")).toEqual("Roboto")
	})
})
