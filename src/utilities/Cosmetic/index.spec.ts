import { Cosmetic } from "."

describe("model", () => {
	it("Cosmetic.from", () => {
		expect(
			Cosmetic.from({
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
})
