import { Component, ComponentWillLoad, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core"
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
	private initialValue?: any
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	private mouseDownPosition?: { x: number; y: number }
	@Prop() name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ mutable: true }) checked = false
	@Prop() value = this.checked
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true }) disabled: boolean
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
		this.smoothlyInputLoad.emit(() => {})
		this.listener.changed?.(this)
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
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
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
	async elementCheck() {
		this.changed = this.initialValue !== this.checked
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.listener.changed?.(this)
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
				<input type="checkbox" checked={this.checked} />
				{this.checked && <smoothly-icon name="checkmark-outline" size="tiny" />}
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
