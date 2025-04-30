import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
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
	parent: Editable | undefined
	private initialValue?: any
	private observer = Editable.Observer.create(this)
	private mouseDownPosition?: { x: number; y: number }
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ mutable: true }) checked = false
	@Prop() value = this.checked
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
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
	async getValue(): Promise<boolean> {
		return this.checked
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
	@Watch("checked")
	async elementCheck(checked: boolean | undefined, before: boolean | undefined) {
		this.changed = !!this.initialValue != !!this.checked
		const changed = !!checked != !!before
		if (changed) {
			this.smoothlyInput.emit({ [this.name]: await this.getValue() })
			this.observer.publish()
		}
	}
	click() {
		!this.disabled && !this.readonly && (this.checked = !this.checked)
	}
	render() {
		return (
			<Host
				onMouseDown={(e: MouseEvent) => (this.mouseDownPosition = { x: e.clientX, y: e.clientY })}
				onMouseUp={(e: MouseEvent) =>
					this.mouseDownPosition?.x == e.clientX && this.mouseDownPosition.y == e.clientY && this.click()
				}>
				<input type="checkbox" checked={this.checked} disabled={this.disabled} />
				{this.checked && <smoothly-icon name="checkmark-outline" size="tiny" />}
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
