import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, VNode, Watch } from "@stencil/core"
import { Color, Data } from "../../../model"
import { SmoothlyForm } from "../../form"
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
export class SmoothlyInputRadio implements Input, Clearable, Editable {
	private parent?: Editable
	private active?: Selectable
	private valueReceivedOnLoad = false
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	initialValue?: Selectable
	@Prop({ mutable: true }) changed = false
	@Prop({ mutable: true }) value: any = undefined
	@Prop({ mutable: true, reflect: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop() clearable?: boolean
	@Prop({ mutable: true, reflect: true }) readonly = false
	@Prop() name: string
	@Prop({ reflect: true }) showLabel = true
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	connectedCallback(): void | Promise<void> {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = this.looks ?? looks), (this.color = color)))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.listener.changed?.(this)
		!this.valueReceivedOnLoad && this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.initialValue = this.active
	}
	async disconnectedCallback() {
		await this.removeSelf()
	}
	@Method()
	async removeSelf() {
		if (this.parent instanceof SmoothlyForm) {
			await this.parent.removeInput(this.name)
		}
	}
	@Method()
	async getValue() {
		return this.value
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
		this.listener.changed?.(this)
	}
	@Watch("readonly")
	watchingReadonly(): void {
		this.listener.changed?.(this)
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
