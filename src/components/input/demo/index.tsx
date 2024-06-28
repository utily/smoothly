import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }

	render() {
		return (
			<Host>
				<smoothly-form looks="border" onSmoothlyFormSubmit={e => console.log(e.detail.value)}>
					<smoothly-input name="name.first">First Name</smoothly-input>
					<smoothly-input name="name.last">Last Name</smoothly-input>
					<smoothly-input name="favoriteFoods.0">Most Favorite Food</smoothly-input>
					<smoothly-input name="favoriteFoods.1">Second Most Favorite Food</smoothly-input>
					<smoothly-input name="favoriteFoods.2">Third Most Favorite Food</smoothly-input>
					<smoothly-input-submit slot="submit"></smoothly-input-submit>
				</smoothly-form>
			</Host>
		)
	}
}
