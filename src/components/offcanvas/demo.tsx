import { Component, h, State } from "@stencil/core"

@Component({
	tag: "smoothly-offcanvas-demo",
})
export class SmoothlyOffcanvasDemo {
	@State() openLeft = false
	@State() openRight = false

	onClickLeft() {
		this.openLeft = !this.openLeft
	}

	onClickRight() {
		this.openRight = !this.openRight
	}

	render() {
		return [
			<h4>Left align</h4>,
			<smoothly-button color="danger" onClick={() => this.onClickLeft()}>
				Open
			</smoothly-button>,
			<smoothly-offcanvas open={this.openLeft}>
				<smoothly-button color="danger" onClick={() => this.onClickLeft()}>
					Close
				</smoothly-button>
			</smoothly-offcanvas>,
			<br />,
			<h4>Right align</h4>,
			<smoothly-button color="danger" onClick={() => this.onClickRight()}>
				Open
			</smoothly-button>,
			<smoothly-offcanvas position="right" open={this.openRight}>
				<smoothly-button color="danger" onClick={() => this.onClickRight()}>
					Close
				</smoothly-button>
			</smoothly-offcanvas>,
		]
	}
}
