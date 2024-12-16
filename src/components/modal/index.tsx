import { Component, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core"
import { Color } from "../../model"

@Component({
	tag: "smoothly-modal",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyModal {
	@Prop({ reflect: true }) color: Color | undefined
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) closable = false
	@Event() smoothlyModalChange: EventEmitter<boolean>

	@Watch("open")
	openChanged() {
		this.smoothlyModalChange.emit(this.open)
	}

	render() {
		return (
			<Host role="alertdialog">
				<div class="modal">
					<div class="header">
						<slot name="header" />
						{this.closable && (
							<smoothly-icon
								name="close-outline"
								fill="solid"
								color={this.color}
								onClick={() => {
									this.open = false
								}}
							/>
						)}
					</div>
					<slot />
					<div class="actions">
						<slot name="actions" />
					</div>
				</div>
			</Host>
		)
	}
}
