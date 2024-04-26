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
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { Selectable } from "./Selected"

@Component({
	tag: "smoothly-input-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRadio implements Input, Clearable, Editable, ComponentWillLoad {
	private active?: Selectable
	private valueReceivedOnLoad = false
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	initialValue?: Selectable
	@Prop({ mutable: true }) changed = false
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() clearable?: boolean
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop() name: string
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
	}
	componentDidLoad(): void | Promise<void> {
		!this.valueReceivedOnLoad && this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
		this.initialValue = this.active
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
		if (!this.readonly || !this.valueReceivedOnLoad) {
			if (this.clearable && this.active?.value === event.detail.value)
				this.clear()
			else if (this.active?.value !== event.detail.value) {
				this.active?.select(false)
				this.active = event.detail
				this.value = this.active.value
				this.active.select(true)
			}
		}
		!this.valueReceivedOnLoad && (this.valueReceivedOnLoad = !this.valueReceivedOnLoad)
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.active?.select(false)
			this.value = undefined
		}
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.active?.select(false)
		this.active = this.initialValue
		this.value = this.initialValue?.value
		this.active?.select(true)
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.active
		this.valueChanged()
	}
	@Watch("value")
	valueChanged(): void {
		this.valueReceivedOnLoad && (this.changed = this.initialValue?.value !== this.value)
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.listener.changed?.(this)
	}
	@Watch("readonly")
	watchingReadonly(): void {
		this.listener.changed?.(this)
	}

	render(): VNode | VNode[] {
		return (
			<Host>
				<slot name="start" />
				<slot />
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
