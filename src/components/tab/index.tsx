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
	componentDidLoad(): void {
		this.openHandler()
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
