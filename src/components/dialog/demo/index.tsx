import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-dialog-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialogDemo {
	@State() openModal = false
	@State() showFrame = false

	render() {
		return (
			<Host>
				<smoothly-button fill="solid" color="light" onClick={() => (this.openModal = true)}>
					Open Modal
				</smoothly-button>
				<smoothly-button fill="solid" color="light" onClick={() => (this.showFrame = !this.showFrame)}>
					Show Frame
				</smoothly-button>

				<smoothly-modal closable open={this.openModal} onSmoothlyModalChange={e => (this.openModal = e.detail)}>
					<h2 slot="header">Modal</h2>
					<span>Are you sure you want to confirm this action?</span>
					<smoothly-button slot="actions" color="success">
						Confirm
					</smoothly-button>
					<smoothly-button slot="actions" color="light" fill="outline" onClick={() => (this.openModal = false)}>
						Cancel
					</smoothly-button>
				</smoothly-modal>

				{this.showFrame && (
					<smoothly-dialog closable>
						<smoothly-frame url="https://www.wikipedia.org/" name="parent" style={{ height: "80vh" }} />
					</smoothly-dialog>
				)}
			</Host>
		)
	}
}
