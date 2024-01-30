import { Component, h, Host, State } from "@stencil/core"
@Component({
	tag: "smoothly-contact-display",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyContactDisplay {
	smoothlyForm?: HTMLSmoothlyFormElement
	@State() editable = true //For testing of readonly for contact form
	render() {
		return (
			<Host>
				<smoothly-button
					size="small"
					type="button"
					color="tertiary"
					fill="solid"
					onClick={() => (this.editable = !this.editable)}>
					<smoothly-icon name="shuffle-outline" />
				</smoothly-button>
				<smoothly-contact readonly={!this.editable} />
			</Host>
		)
	}
}
