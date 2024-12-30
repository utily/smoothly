import { describe, expect, it } from "vitest"
import * as utilities from "./index"

describe("model", () => {
	it("Cosmetic.from", () => {
		expect(
			utilities.Cosmetic.from({
				gap: "1em",
				dangerColor: "red",
				border: {
					color: "black",
					radius: "0.2em",
				},
				nonCosmeticKey: "nonCosmeticValue",
			})
		).toEqual({
			gap: "1em",
			dangerColor: "red",
			border: {
				color: "black",
				radius: "0.2em",
			},
		})
	})
	it("Access test of Color and Cosmetics", () => {
		const Cosmetic = utilities.Cosmetic
		expect(typeof Cosmetic).toEqual(typeof utilities.Cosmetic)
		const Names = utilities.Cosmetic.Color.Names
		expect(typeof Names).toEqual(typeof utilities.Cosmetic.Color.Names)
		const toCommaRgb = utilities.Cosmetic.Color.CommaRgb.from
		expect(typeof toCommaRgb).toEqual("function")
	})
})
