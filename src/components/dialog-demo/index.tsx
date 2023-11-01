import { Component, h } from "@stencil/core"

@Component({
	tag: "smoothly-0-dialog-demo",
})
export class SmoothlyDialogDemo {
	render() {
		return (
			<smoothly-0-dialog color="default" style={{ "margin-top": "6vh" }} closable>
				<smoothly-0-frame url="https://www.wikipedia.org/" name="parent" style={{ height: "80vh" }}></smoothly-0-frame>
			</smoothly-0-dialog>
		)
	}
}
