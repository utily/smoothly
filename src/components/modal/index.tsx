import { Component, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-modal",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyModal {
	@Prop({ mutable: true, reflect: true }) open = false
	@Prop({ reflect: true }) closable = false
	@Prop({ reflect: true }) align: "top" | "center" = "center"
	@Event() smoothlyModalChange: EventEmitter<boolean>

	@Watch("open")
	openChanged() {
		this.smoothlyModalChange.emit(this.open)
	}
	@Method()
	async closeModal() {
		this.open = false
	}
	@Method()
	async openModal() {
		this.open = true
	}

	render() {
		return (
			<Host
				role="alertdialog"
				onClick={(e: any) => {
					this.closable && !e.composedPath().some((el: any) => el.classList?.contains("modal")) && this.closeModal()
				}}>
				<div class="modal">
					<div class="header">
						<slot name="header" />
						{this.closable && <smoothly-icon name="close-outline" fill="solid" onClick={() => this.closeModal()} />}
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
