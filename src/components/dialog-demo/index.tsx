import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-dialog-demo",
})
export class SmoothlyDialogDemo {
	render() {
		return (
			<smoothly-dialog color="default" style={{ "margin-top": "6vh" }} closable>
				<smoothly-frame url="https://www.wikipedia.org/" name="parent" style={{ height: "80vh" }}></smoothly-frame>
			</smoothly-dialog>
		)
	}
}
