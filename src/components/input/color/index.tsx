import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	VNode,
	Watch,
} from "@stencil/core"
import { SmoothlyInputCustomEvent } from "../../../components"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { SmoothlyInput } from "../index"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor implements Input, Clearable, ComponentWillLoad {
	@Element() element: HTMLElement
	@Prop({ mutable: true }) value: string | undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInput) => void>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: SmoothlyInputCustomEvent<Record<string, any>>): void {
		this.value = event.detail[this.name]
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--value": this.value }}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					onSmoothlyInput={event => this.inputHandler(event)}>
					Color
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
			</Host>
		)
	}
}
