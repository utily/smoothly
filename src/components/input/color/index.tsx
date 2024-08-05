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
	State,
	VNode,
	Watch,
} from "@stencil/core"
import { Color, Data } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { SmoothlyInput } from "../index"
import { Input } from "../Input"
import { Looks } from "../Looks"
import { hexToRGB, RGB, RGBToHex } from "./color"

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor implements Input, Clearable, Editable, ComponentWillLoad {
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	private rgb: RGB = { r: undefined, g: undefined, b: undefined }
	private initialValue: string | undefined
	@Prop({ mutable: true }) value: string | undefined = undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() name: string
	@Element() element: HTMLSmoothlyInputColorElement
	@State() open = false
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.value && this.hexCodeInputHandler(this.value), this.setInitialValue()
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks) => void>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInput) => void>): void {
		if (event.target != this.element)
			event.stopPropagation()
	}
	@Listen("click", { target: "window" })
	onWindowClick(event: Event): void {
		!event.composedPath().includes(this.element) && this.open && (this.open = false)
	}
	@Method()
	async clear(): Promise<void> {
		this.rgb = { r: undefined, g: undefined, b: undefined }
		this.value = undefined
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
		this.open = false
	}
	@Method()
	async reset(): Promise<void> {
		this.value = this.initialValue
		this.open = false
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.value
		this.open = false
	}
	@Watch("value")
	valueChanged(): void {
		this.changed = this.initialValue !== this.value
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.listener.changed?.(this)
	}
	sliderInputHandler(event: CustomEvent<Data>) {
		event.stopPropagation()
		const color = Object.keys(event.detail)[0]
		if (event.detail[color] !== undefined) {
			for (const key of Object.keys(this.rgb)) {
				if (key === color)
					this.rgb = { ...this.rgb, [key]: event.detail[color] }
				else if (this.rgb[key as keyof RGB] === undefined) {
					this.rgb = { ...this.rgb, [key]: 0 }
				}
			}
			this.value = RGBToHex(this.rgb)
		}
	}
	hexCodeInputHandler(input: string): void {
		const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
		if (input && regex.test(input))
			this.rgb = hexToRGB(input)
		else if (!input || !regex.test(input))
			this.rgb = { r: undefined, g: undefined, b: undefined }
		this.value = input
	}
	render(): VNode | VNode[] {
		return (
			<Host style={{ "--hexCode": this.value, "--element-height": `${this.element.clientHeight}px` }}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					type={"hex-color"}
					readonly={this.readonly}
					onClick={() => !this.readonly && (this.open = !this.open)}
					onSmoothlyInput={event => (event?.stopPropagation(), this.hexCodeInputHandler(event.detail[this.name]))}>
					<slot />
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
				{this.open && !this.readonly && (
					<div class="rgb-sliders">
						{Object.entries(this.rgb).map(([key, value]) => (
							<smoothly-input-range
								name={key}
								min={0}
								max={255}
								value={value}
								step={1}
								outputSide="right"
								onSmoothlyInput={event => this.sliderInputHandler(event)}>
								{key.toUpperCase()}
							</smoothly-input-range>
						))}
					</div>
				)}
			</Host>
		)
	}
}
