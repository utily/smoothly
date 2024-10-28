import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	@Prop() label: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() smoothlyTabOpen: EventEmitter<string>
	@Event() smoothlyTabLoad: EventEmitter<void>

	@Watch("open")
	openHandler() {
		if (this.open)
			this.smoothlyTabOpen.emit(this.label)
	}
	@Listen("click")
	onClick(e: UIEvent) {
		e.stopPropagation()
		this.open = true
	}
	connectedCallback() {
		this.smoothlyTabLoad.emit()
	}
	componentDidLoad(): void {
		this.openHandler()
	}
	render() {
		return (
			<Host>
				<div>
					<label>{this.label}</label>
				</div>
				<div hidden={!this.open}>
					<slot />
				</div>
			</Host>
		)
	}
}
