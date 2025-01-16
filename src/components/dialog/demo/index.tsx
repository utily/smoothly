import { Component, h, Host, State } from "@stencil/core"

@Component({
	tag: "smoothly-dialog-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialogDemo {
	@State() openModal = false
	@State() openTallModal = false
	@State() showFrame = false

	render() {
		return (
			<Host>
				<smoothly-button fill="solid" color="light" onClick={() => (this.openModal = true)}>
					Open Modal
				</smoothly-button>
				<smoothly-button fill="solid" color="light" onClick={() => (this.openTallModal = true)}>
					Open Modal with long text
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

				<smoothly-modal closable open={this.openTallModal} onSmoothlyModalChange={e => (this.openTallModal = e.detail)}>
					<h2 slot="header">Modal</h2>
					<smoothly-summary>
						<span slot="summary">Summary</span>
						<div slot="content">
							{Array.from({ length: 10 }).map(() => (
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
									dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
									aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
									dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
									officia deserunt mollit anim id est laborum.
								</p>
							))}
						</div>
					</smoothly-summary>
					<smoothly-button slot="actions" color="light" fill="outline" onClick={() => (this.openTallModal = false)}>
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
