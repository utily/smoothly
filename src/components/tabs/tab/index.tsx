import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	expansionElement?: HTMLDivElement
	@Prop() label: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() expansionOpen: EventEmitter<HTMLDivElement>
	@Event() smoothlyTabLoad: EventEmitter<void>

	@Watch("open")
	openHandler() {
		if (this.expansionElement && this.open) {
			this.expansionOpen.emit(this.expansionElement)
		}
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
				<label>{this.label}</label>
				<div ref={e => (this.expansionElement = e)} hidden={!this.open}>
					<slot />
				</div>
			</Host>
		)
	}
}
