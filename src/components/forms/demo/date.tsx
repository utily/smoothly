import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-date-new-preview",
})
export class SmoothlyDateNewPreview {
	render() {
		return (
			<Host>
				<smoothly-date-new placeholder="yyyy-mm-dd">Select date</smoothly-date-new>
			</Host>
		)
	}
}