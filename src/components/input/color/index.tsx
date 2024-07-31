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
import { SmoothlyInputCustomEvent } from "../../../components"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
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
export class SmoothlyInputColor implements Input, Clearable, ComponentWillLoad {
	@Element() element: HTMLSmoothlyInputColorElement
	@Prop({ mutable: true }) value: string | undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop() name: string
	@State() open = false
	@State() rgb: RGB = { r: undefined, g: undefined, b: undefined }
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	componentWillLoad(): void | Promise<void> {
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {
			return
		})
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>): void {
		if (event.target !== this.element) {
			event.stopPropagation()
			if (Object.keys(event.detail)[0] in this.rgb)
				this.rgb = { ...this.rgb, [Object.keys(event.detail)[0]]: Object.values(event.detail)[0] }
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
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Watch("value")
	hexCodeChanged(): void {
		this.smoothlyInput.emit({ [this.name]: this.value })
	}
	@Watch("rgb")
	rgbChanged(): void {
		console.log(this.RGBToHex(this.rgb))
		//this.smoothlyInput.emit({ [this.name]: this.value })
	}
	inputHandler(event: SmoothlyInputCustomEvent<Record<string, any>>): void {
		this.value = event.detail[this.name]
		const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
		if (this.value && regex.test(this.value)) {
			this.hexToRGB(this.value)
		}
	}
	hexToRGB(hex: string) {
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

		this.rgb = { r, g, b }
	}

	RGBToHex(rgb: RGB): void {
		let hex = "#"

		for (const component of Object.values(rgb)) {
			if (component && component >= 0 && component <= 255) {
				const temp = component.toString(16)
				hex += temp.length === 1 ? "0" + temp : temp
			}
		}
		this.value = hex
	}

	componentDidRender(): void | Promise<void> {
		this.element?.style.setProperty("--element-height", `${this.element.clientHeight}px`)
	}

	render(): VNode | VNode[] {
		return (
			<Host style={{ "--hexCode": this.value }}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					type={"hex-color"}
					onClick={() => (this.open = !this.open)}
					onSmoothlyInput={event => this.inputHandler(event)}>
					Color
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
				{this.open && (
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
