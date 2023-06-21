import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-date-new-preview",
})
export class SmoothlyDateNewPreview {
	render() {
		return (
			<Host>
				<smoothly-date-new placeholder="yyyy-mm-dd">Date picker</smoothly-date-new>
				<br />
				<smoothly-date-new name="range" range placeholder="yyyy-mm-dd - yyyy-mm-dd">
					Date range picker
				</smoothly-date-new>
				<br />
			</Host>
		)
	}
}
