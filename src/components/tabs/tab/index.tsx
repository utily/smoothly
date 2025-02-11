import { Component, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"
import { Input } from "../../input/Input"

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	private inputs: Record<string, Input.Element> = {}
	@Prop() label: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Event() smoothlyTabOpen: EventEmitter<string>
	@Event() smoothlyTabLoad: EventEmitter<void>

	@Watch("open")
	async openHandler() {
		if (this.open)
			this.smoothlyTabOpen.emit(this.label)
		this.open
			? await Promise.all(Object.values(this.inputs).map(input => input.register()))
			: await Promise.all(Object.values(this.inputs).map(input => input.unregister()))
	}
	@Listen("click")
	onClick() {
		this.open = true
	}
	connectedCallback() {
		this.smoothlyTabLoad.emit()
	}
	async componentDidLoad() {
		await this.openHandler()
	}
	@Listen("smoothlyInputLoad")
	@Listen("smoothlyInput")
	onInputLoad(event: CustomEvent) {
		if (Input.Element.is(event.target)) {
			this.inputs[event.target.name] = event.target
			if (!this.open)
				event.stopPropagation()
		}
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
