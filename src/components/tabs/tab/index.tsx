import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"
import { Input } from "../../input/Input"

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	private inputs: Record<string, Input.Element> = {}
	expansionElement?: HTMLDivElement
	@Prop() label: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() expansionOpen: EventEmitter<HTMLDivElement>
	@Event() smoothlyTabLoad: EventEmitter<void>

	@Watch("open")
	async openHandler() {
		if (this.expansionElement && this.open) {
			this.expansionOpen.emit(this.expansionElement)
		}
		if (!this.open) {
			await Promise.all(Object.values(this.inputs).map(input => input.removeSelf()))
		}
	}
	@Listen("click")
	onClick(e: UIEvent) {
		e.stopPropagation()
		this.open = true
	}

	@Listen("smoothlyInputLoad")
	onInputLoad(event: CustomEvent) {
		if (Input.Element.is(event.target)) {
			this.inputs[event.target.name] = event.target
			if (!this.open)
				event.stopPropagation()
		}
	}

	componentDidLoad(): void {
		this.openHandler()
	}
	connectedCallback() {
		this.smoothlyTabLoad.emit()
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
