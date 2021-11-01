import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	expansionElement?: HTMLDivElement
	@Event() expansionOpen: EventEmitter<HTMLElement>
	@Prop() label: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Watch("open")
	openChanged() {
		if (this.expansionElement) {
			this.expansionOpen.emit(this.expansionElement)
		}
	}
	@Listen("click")
	onClick(e: UIEvent) {
		this.open = !this.open
		e.stopPropagation()
	}
	componentDidLoad(): void {
		if (this.expansionElement && this.open) {
			this.expansionOpen.emit(this.expansionElement)
		}
	}
	render() {
		return (
			<Host>
				<label>{this.label}</label>
				<div ref={e => (this.expansionElement = e)} class={!this.open ? "hide" : ""}>
					<slot></slot>
				</div>
			</Host>
		)
	}
}
