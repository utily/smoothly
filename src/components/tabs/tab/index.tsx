import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch } from "@stencil/core"
import { Input } from "../../input/Input"
import { SmoothlyTabs } from ".."

@Component({
	tag: "smoothly-tab",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTab {
	private inputs: Record<string, Input.Element> = {}
	private smoothlyTabs?: SmoothlyTabs
	@Element() element: HTMLSmoothlyTabElement
	@Prop() label: string
	@Prop() name: string
	@Prop() tooltip: string
	@Prop({ mutable: true, reflect: true }) open: boolean
	@Prop({ reflect: true }) disabled: boolean
	@Event() smoothlyTabOpen: EventEmitter<string>
	@Event() smoothlyTabLoad: EventEmitter<(smoothlyTabs: SmoothlyTabs) => void>

	@Watch("open")
	async openHandler() {
		if (this.open)
			this.smoothlyTabOpen.emit(this.name)
		this.open
			? await Promise.all(Object.values(this.inputs).map(input => input.register()))
			: await Promise.all(Object.values(this.inputs).map(input => input.unregister()))
	}
	connectedCallback() {
		this.smoothlyTabLoad.emit((smoothlyTabs: SmoothlyTabs) => {
			this.smoothlyTabs?.removeTab(this.element)
			this.smoothlyTabs = smoothlyTabs
		})
	}
	disconnectedCallback() {
		this.smoothlyTabs?.removeTab(this.element)
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
				<div onClick={() => !this.disabled && (this.open = true)}>
					<label data-smoothly-tooltip={this.tooltip}>{this.label}</label>
				</div>
				<div hidden={!this.open}>
					<slot />
				</div>
			</Host>
		)
	}
}
