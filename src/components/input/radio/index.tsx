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
	private active?: Selectable
	private valueReceivedOnLoad = false
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() clearable?: boolean
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	componentDidLoad(): void | Promise<void> {
		!this.valueReceivedOnLoad && this.smoothlyInput.emit({ [this.name]: this.value })
	}
	@Listen("smoothlyRadioButtonRegister")
	handleRegister(event: CustomEvent<(name: string) => void>) {
		event.stopPropagation()
		event.detail(this.name)
	}
	@Listen("smoothlyInputLoad")
	SmoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputRadio) => void>): void {
		if (!(event.target && "name" in event.target && event.target.name === this.name)) {
			event.stopPropagation()
			event.detail(this)
		}
	}
	@Listen("smoothlySelect")
	smoothlyRadioInputHandler(event: CustomEvent<Selectable>): void {
		event.stopPropagation()
		!this.valueReceivedOnLoad && (this.valueReceivedOnLoad = !this.valueReceivedOnLoad)
		if (this.clearable && this.active?.value === event.detail.value)
			this.clear()
		else if (this.active?.value !== event.detail.value) {
			this.active?.select(false)
			this.active = event.detail
			this.value = this.active.value
			this.active.select(true)
		}
	}
	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.active?.select(false)
			this.value = undefined
			this.active = undefined
		}
	}
	@Watch("value")
	valueChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<slot name="start" />
				<div class="input-group">
					<slot name="label" />
					<div>
						<slot name="options" />
					</div>
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
