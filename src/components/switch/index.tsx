import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-switch",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlySwitch {
	@State() open = false

	render() {
		return (
			<Host>
				<smoothly-button>
					<slot name="button" />
				</smoothly-button>
				<slot name="content"></slot>
			</Host>
		)
	}
}
