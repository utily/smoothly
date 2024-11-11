import {
	Component,
	ComponentDidLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	State,
	VNode,
	Watch,
} from "@stencil/core"
import { Notice, Option } from "../../model"
import { Clearable } from "../input/Clearable"
import { Editable } from "../input/Editable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Controls } from "./menu"

// DEPRECATED use <smoothly-input-select> instead
@Component({
	tag: "smoothly-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyPicker implements Clearable, Editable, Input, ComponentDidLoad {
	private valueReceivedOnLoad = false
	private initialValue = new Map<any, Option>()
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Element() element: HTMLSmoothlyPickerElement
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) open = false
	@Prop({ reflect: true }) mutable = false
	@Prop({ reflect: true }) multiple = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() validator?: (value: string) => boolean | { result: boolean; notice: Notice }
	@State() selected = new Map<any, Option>()
	@State() display: Node[]
	@Event() smoothlyPickerLoaded: EventEmitter<Controls>
	@Event() smoothlyInput: EventEmitter<Record<string, any | any[]>> // multiple -> any[]
	@Event() smoothlyChange: EventEmitter<Record<string, any | any[]>> // multiple -> any[]
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	private controls?: Controls

	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = this.looks ?? looks))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.smoothlyInputLoad.emit(() => {})
		this.listener.changed?.(this)
	}

	@Method()
	async getValue() {
		const selected = Array.from(this.selected.values(), option => option.value)
		return this.multiple ? selected : selected.at(0)
	}

	@Watch("selected")
	async selectedChanged(): Promise<void> {
		this.changed = !this.areValuesEqual(this.selected, this.initialValue)
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.smoothlyChange.emit({ [this.name]: await this.getValue() })
		this.display = Array.from(this.selected.values(), option => {
			const span = document.createElement("span")
			option.slotted.forEach(node => span.appendChild(node.cloneNode(true)))
			return span
		})
		!this.valueReceivedOnLoad && (this.initialValue = new Map(this.selected))
	}

	componentDidLoad(): void | Promise<void> {
		if (this.controls)
			this.smoothlyPickerLoaded.emit(this.controls)
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks?: Looks) => void>): void {
		if (event.target != this.element) {
			event.stopPropagation()
			event.detail(this.looks)
		}
	}
	@Listen("smoothlyPickerMenuLoaded")
	menuLoadedHandler(event: CustomEvent<Controls & { synced: () => boolean }>): void {
		this.controls = event.detail
	}
	@Listen("smoothlyPickerOptionLoaded")
	optionLoadedHandler(event: CustomEvent<Option>): void {
		if (event.detail.selected)
			this.selected = this.multiple
				? new Map(this.selected.set(event.detail.value, event.detail).entries())
				: new Map().set(event.detail.value, event.detail)
		!this.valueReceivedOnLoad && (this.valueReceivedOnLoad = !this.valueReceivedOnLoad)
	}

	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>): void {
		if ((this.readonly && !this.valueReceivedOnLoad) || !this.readonly)
			if (this.multiple)
				this.selected = event.detail.selected
					? new Map(this.selected.set(event.detail.value, event.detail).entries())
					: !this.selected.delete(event.detail.value)
					? this.selected
					: new Map(this.selected.entries())
			else
				this.selected = !event.detail.selected ? new Map() : new Map().set(event.detail.value, event.detail)
	}
	@Listen("click", { target: "window" })
	clickHandler(event: MouseEvent) {
		this.open = !event.composedPath().includes(this.element) || this.readonly ? false : !this.open
	}
	@Listen("focusin", { target: "window" })
	focusHandler(event: FocusEvent) {
		if (!event.composedPath().includes(this.element))
			this.open = false
	}
	@Method()
	async clear() {
		this.selected.forEach(option => option.selected && option.element.clickHandler())
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		await this.reset()
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		const initialValueArray = Array.from(this.initialValue.values(), option => option.value)
		this.selected.forEach(
			option => !initialValueArray.includes(option.value) && option.selected && option.set.selected(false)
		)
		this.initialValue.forEach(option => option.set.selected(true))
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = new Map(this.selected)
		this.selectedChanged()
	}
	areValuesEqual(selected: Map<any, Option>, initialValue: Map<any, Option>): boolean {
		const initialValueArray = Array.from(initialValue.values(), option => option.value)
		const selectedArray = Array.from(selected.values(), option => option.value)
		return (
			selectedArray.length === initialValueArray.length &&
			initialValueArray.every(value => selectedArray.includes(value))
		)
	}
	render(): VNode | VNode[] {
		return (
			<Host tabindex={0}>
				<smoothly-slot-elements class={"selected"} nodes={this.display} />
				<span class={"label"}>
					<slot name={"label"} />
				</span>
				{this.looks == "border" && (
					<button>
						<smoothly-icon size="tiny" name={this.open ? "caret-down-outline" : "caret-forward-outline"} />
					</button>
				)}
				<slot name="child" />
				<smoothly-picker-menu
					open={this.open}
					looks={this.looks}
					onClick={e => e.stopPropagation()}
					multiple={this.multiple}
					mutable={this.mutable}
					readonly={this.readonly}
					validator={this.validator}>
					<slot name="search" slot="search" />
					<slot name="display" slot="display" />
					<slot />
				</smoothly-picker-menu>
			</Host>
		)
	}
}
