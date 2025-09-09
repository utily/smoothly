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
import { Color, Data } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { RadioItemSelect } from "./RadioItemSelect"

@Component({
	tag: "smoothly-input-radio",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputRadio implements Input, Clearable, Editable, ComponentWillLoad {
	@Element() element: HTMLSmoothlyInputRadioElement
	parent: Editable | undefined
	private active?: RadioItemSelect
	private valueReceivedOnLoad = false
	private observer = Editable.Observer.create(this)
	initialValue?: RadioItemSelect
	@Prop({ mutable: true }) changed = false
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true, reflect: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true }) direction?: "row" | "column"
	@Prop() clearable?: boolean
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = this.looks ?? looks), (this.color = color)))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	componentDidLoad(): void | Promise<void> {
		!this.valueReceivedOnLoad && this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.initialValue = this.active
	}
	@Listen("smoothlyRadioItemRegister")
	handleRegister(event: CustomEvent<(parent: SmoothlyInputRadio) => void>) {
		event.stopPropagation()
		event.detail(this)
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputRadio) => void>): void {
		Input.registerSubAction(this, event)
	}
	@Listen("smoothlyRadioItemSelect")
	smoothlyRadioInputHandler(event: CustomEvent<RadioItemSelect>): void {
		event.stopPropagation()
		if ((!this.readonly && !this.disabled) || !this.valueReceivedOnLoad) {
			if (this.clearable && this.active?.value === event.detail.value)
				this.clear()
			else if (this.active?.value !== event.detail.value) {
				this.active?.select(false)
				this.active = event.detail
				this.value = this.active.value
				this.active.select(true)
			}
		}
		if (event.detail.userInitiated)
			this.smoothlyUserInput.emit({ name: this.name, value: this.value })
		!this.valueReceivedOnLoad && (this.valueReceivedOnLoad = !this.valueReceivedOnLoad)
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Watch("name")
	nameChange(_: string | undefined, oldName: string | undefined) {
		Input.formRename(this, oldName)
	}
	@Method()
	async register() {
		Input.formAdd(this)
	}
	@Method()
	async unregister() {
		Input.formRemove(this)
	}
	@Method()
	async getValue(): Promise<any | undefined> {
		return this.value
	}
	@Method()
	async clear(): Promise<void> {
		if (this.clearable) {
			this.active?.select(false)
			this.active = undefined
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
	async valueChanged(): Promise<void> {
		this.valueReceivedOnLoad && (this.changed = this.initialValue?.value !== this.value)
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.observer.publish()
	}
	@Watch("disabled")
	@Watch("readonly")
	watchingReadonly(): void {
		this.observer.publish()
	}

	render(): VNode | VNode[] {
		return (
			<Host class="floating-label">
				<slot name="start" />
				<div>
					<slot name="label" />
					<div class="options">
						<slot />
					</div>
				</div>
				<slot name="end" />
			</Host>
		)
	}
}
