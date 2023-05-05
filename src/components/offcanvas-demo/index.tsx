import { Component, h, State } from "@stencil/core"

@Component({
	tag: "smoothly-offcanvas-demo",
})
export class SmoothlyOffcanvasDemo {
	@State() openLeft = false
	@State() openRight = false
	@State() openTop = false
	@State() openBottom = false

	onClickLeft() {
		this.openLeft = !this.openLeft
	}

	onClickRight() {
		this.openRight = !this.openRight
	}

	onClickTop() {
		this.openTop = !this.openTop
	}

	onClickBottom() {
		this.openBottom = !this.openBottom
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
			<h4>Right align "none clickebel"</h4>,
			<smoothly-button color="danger" onClick={() => this.onClickRight()}>
				Open
			</smoothly-button>,
			<smoothly-offcanvas clickable={false} position="right" open={this.openRight}>
				<smoothly-button color="danger" onClick={() => this.onClickRight()}>
					Close
				</smoothly-button>
			</smoothly-offcanvas>,
			<br />,
			<h4>Top align</h4>,
			<smoothly-button color="danger" onClick={() => this.onClickTop()}>
				Open
			</smoothly-button>,
			<smoothly-offcanvas position="top" open={this.openTop}>
				<smoothly-button color="danger" onClick={() => this.onClickTop()}>
					Close
				</smoothly-button>
			</smoothly-offcanvas>,
			<br />,
			<h4>Bottom align</h4>,
			<smoothly-button color="danger" onClick={() => this.onClickBottom()}>
				Open
			</smoothly-button>,
			<smoothly-offcanvas position="bottom" open={this.openBottom}>
				<smoothly-button color="danger" onClick={() => this.onClickBottom()}>
					Close
				</smoothly-button>
			</smoothly-offcanvas>,
		]
	}
}
