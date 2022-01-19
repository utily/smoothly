import { Component, h, Prop } from "@stencil/core"
import { GoogleFont } from "../../model/GoogleFont"

@Component({
	tag: "smoothly-google-font",
	scoped: true,
})
export class SmoothlyGoogleFont {
	@Prop() value?: GoogleFont

	render() {
		return GoogleFont.is(this.value) ? (
			<style>{`@import url('https://fonts.googleapis.com/css2?family=${this.value}&display=swap');`}</style>
		) : (
			""
		)
	}
}
