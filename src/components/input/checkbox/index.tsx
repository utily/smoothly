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
	Watch,
} from "@stencil/core"
import { Color, Data } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-checkbox",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputCheckbox implements Input, Clearable, Editable, ComponentWillLoad {
	@Element() element: HTMLSmoothlyInputCheckboxElement
	changed = false
	parent: Editable | undefined
	private initialValue?: any
	private observer = Editable.Observer.create(this)
	private id: string
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ mutable: true }) checked = false
	@Prop() value?: Record<"true" | "false", any>
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyUserInput: EventEmitter<Input.UserInput>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.initialValue = this.checked
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		this.observer.publish()
		this.id = "id-" + Math.random().toString(36).substring(2, 11)
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputCheckbox) => void>): Promise<void> {
		Input.registerSubAction(this, event)
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
	async getValue(): Promise<boolean> {
		return this.value ? this.value[`${!!this.checked}`] : this.checked
	}
	@Method()
	async clear(): Promise<void> {
		!this.disabled && !this.readonly && (this.checked = false)
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}

	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.checked = this.initialValue
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.checked
		this.changed = false
	}
	@Watch("disabled")
	@Watch("readonly")
	async handleDisabledChange(): Promise<void> {
		this.observer.publish()
	}

	@Watch("checked")
	async elementCheck(_: boolean | undefined, before: boolean | undefined) {
		// Different than initial value
		this.changed = !!this.initialValue != !!this.checked
		// Different than before
		const changed = !!this.checked != !!before
		if (changed) {
			this.smoothlyInput.emit({ [this.name]: await this.getValue() })
			this.observer.publish()
		}
	}
	render() {
		return (
			<Host>
				<input
					type="checkbox"
					id={this.id}
					checked={this.checked}
					disabled={this.disabled || this.readonly}
					onChange={async e => {
						this.checked = (e.target as HTMLInputElement).checked
						this.smoothlyUserInput.emit({ name: this.name, value: await this.getValue() })
					}}
				/>
				{this.checked && <smoothly-icon name="checkmark-outline" size="tiny" />}
				<label htmlFor={this.id}>
					<slot />
				</label>
				<span class="smoothly-checkbox-end-slot">
					<slot name="end" />
				</span>
			</Host>
		)
	}
}
