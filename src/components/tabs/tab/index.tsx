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

		if (!this.open) {
			console.log("tab -> remove inputs 🏓🏓🏓🏓🌸", Object.values(this.inputs))
			await Promise.all(Object.values(this.inputs).map(input => input.removeSelf()))
			console.log("tab -> removed inputs 🏓🏓🏓🏓✅", this.label)
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

	@Listen("smoothlyInputLoad")
	onInputLoad(event: CustomEvent) {
		console.log("tab -> smoothlyInputLoad🏓🏓🏓🏓", Input.Element.is(event.target), event.target)
		if (Input.Element.is(event.target)) {
			this.inputs[event.target.name] = event.target
			if (!this.open)
				event.stopPropagation()
		}
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
