import { Component, h, Prop } from "@stencil/core"
import { GoogleFont } from "../../model/GoogleFont"

@Component({
	tag: "smoothly-0-google-font",
	scoped: true,
})
export class SmoothlyGoogleFont {
	@Prop() value?: GoogleFont

	render() {
		return GoogleFont.is(this.value) ? <style>{GoogleFont.styleImportString(this.value)}</style> : ""
	}
}
