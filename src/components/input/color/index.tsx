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
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { SmoothlyInput } from "../index"
import { Input } from "../Input"
import { Looks } from "../Looks"

type RGB = {
	r: number | undefined
	g: number | undefined
	b: number | undefined
}

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor implements Input, Clearable, Editable, ComponentWillLoad {
	@Element() element: HTMLSmoothlyInputColorElement
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	@Prop({ mutable: true }) value: string | undefined = undefined
	private initialValue = this.value
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() name: string
	@State() open = false
	private rgb: RGB = { r: undefined, g: undefined, b: undefined }
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
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>): void {
		if (event.target !== this.element && event.target && "name" in event.target && event.target.name !== this.name) {
			event.stopPropagation()
			const [key, value] = Object.entries(event.detail)[0]
			if (key in this.rgb && value !== undefined) {
				this.sliderInputHandler(key, value)
			}
		}
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
	sliderInputHandler(color: string, value: string) {
		for (const key of Object.keys(this.rgb)) {
			if (key === color)
				this.rgb = { ...this.rgb, [key]: value }
			else if (this.rgb[key as keyof RGB] === undefined) {
				this.rgb = { ...this.rgb, [key]: 0 }
			}
		}
		this.rgb.r !== undefined && this.rgb.g !== undefined && this.rgb.b !== undefined && (this.value = this.RGBToHex())
	}
	hexCodeInputHandler(input: string): void {
		const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
		if (input && regex.test(input)) {
			this.rgb = this.hexToRGB(input)
		} else if (!input || !regex.test(input)) {
			this.rgb = { r: undefined, g: undefined, b: undefined }
		}
		this.value = input
	}
	hexToRGB(hex: string): RGB {
		hex = hex.replace(/^#/, "")

		if (hex.length === 3) {
			hex = hex
				.split("")
				.map(char => char + char)
				.join("")
		}

		const bigint = parseInt(hex, 16)
		const r = (bigint >> 16) & 255
		const g = (bigint >> 8) & 255
		const b = bigint & 255

		return { r, g, b }
	}

	RGBToHex(): string {
		let hex = ""
		for (const component of Object.values(this.rgb)) {
			if (component === 0) {
				hex += "00"
			} else if (component && component >= 0 && component <= 255) {
				const temp = component.toString(16)
				hex += temp.length === 1 ? "0" + temp : temp
			}
		}

		const hexPairs = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
		hexPairs.every(pair => pair[0] === pair[1]) && (hex = hexPairs.map(pair => pair[0]).join(""))

		return "#" + hex
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
					<slot name="end" />
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
				{this.open && !this.readonly && (
					<div class="rgb-sliders">
						<smoothly-input-range name="r" min={0} max={255} value={this.rgb.r} step={1} outputSide="right">
							R
						</smoothly-input-range>
						<smoothly-input-range name="g" min={0} max={255} value={this.rgb.g} step={1} outputSide="right">
							G
						</smoothly-input-range>
						<smoothly-input-range name="b" min={0} max={255} value={this.rgb.b} step={1} outputSide="right">
							B
						</smoothly-input-range>
					</div>
				)}
			</Host>
		)
	}
}
