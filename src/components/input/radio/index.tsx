import {
	Component,
	ComponentWillLoad,
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
import { Color, Data } from "../../../model"
import { Clearable } from "../Clearable"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { Selectable } from "./Selected"

@Component({
	tag: "smoothly-input-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRadio implements Input, Clearable, ComponentWillLoad {
	active?: Selectable
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() clearable?: boolean
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Listen("smoothlyRadioButtonRegister")
	handleRegister(event: CustomEvent<(name: string) => void>) {
		event.stopPropagation()
		event.detail(this.name)
	}
	@Listen("smoothlySelect")
	smoothlyRadioInputHandler(event: CustomEvent<Selectable>): void {
		event.stopPropagation()
		if (this.clearable && this.active?.value === event.detail.value) {
			this.clear()
		} else if (this.active?.value !== event.detail.value) {
			this.active?.select(false)
			this.active = event.detail
			this.value = this.active.value
			this.active.select(true)
		}
	}
	@Method()
	async clear(): Promise<void> {
		this.active?.select(false)
		this.value = undefined
		this.active = undefined
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<slot />
			</Host>
		)
	}
}
