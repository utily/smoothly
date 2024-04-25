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
	@Prop() name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ mutable: true }) checked = false
	@Prop() value = this.checked
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) disabled: boolean
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Data>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.initialValue = this.checked
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInputLoad.emit(() => {
			return
		})
		this.listener.changed?.(this)
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
	async submit(): Promise<void> {
		this.initialValue = this.value
	}
	@Watch("checked")
	elementCheck(): void {
		this.changed = this.initialValue !== this.checked
		this.smoothlyInput.emit({ [this.name]: this.checked })
		this.listener.changed?.(this)
	}
	inputHandler() {
		!this.disabled && !this.readonly && (this.checked = !this.checked)
	}
	render() {
		return (
			<Host onClick={() => this.inputHandler()}>
				<input type="checkbox" checked={this.checked} />
				{this.checked && <smoothly-icon name="checkmark-outline" size="tiny" />}
				<label>
					<slot />
				</label>
			</Host>
		)
	}
}
