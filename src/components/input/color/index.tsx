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
import { hexToRGB, HSL, HSLtoRGB, RGB, RGBToHex, RGBtoHSL } from "./color"

@Component({
	tag: "smoothly-input-color",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputColor implements Input, Clearable, Editable, ComponentWillLoad {
	private listener: { changed?: (parent: Editable) => Promise<void> } = {}
	private rgb: RGB = { r: undefined, g: undefined, b: undefined }
	private hsl: HSL = { h: undefined, s: undefined, l: undefined }
	private initialValue: string | undefined
	@Prop({ mutable: true }) value: string | undefined = undefined
	@Prop({ mutable: true, reflect: true }) looks: Looks = "plain"
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() output: "rgb" | "hex" = "rgb"
	@Prop() name: string
	@Element() element: HTMLSmoothlyInputColorElement
	@State() open = false
	@State() sliderMode: "rgb" | "hsl" = "rgb"
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	componentWillLoad(): void | Promise<void> {
		this.value && this.setInitialValue()
		this.value && (this.rgb = hexToRGB(this.value))
		this.smoothlyInputLooks.emit(looks => (this.looks = looks))
		this.smoothlyInput.emit({ [this.name]: this.output === "rgb" ? this.rgb : this.value ? this.value : undefined })
		this.smoothlyInputLoad.emit(() => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
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
		this.smoothlyInput.emit({ [this.name]: this.output === "rgb" ? this.rgb : this.value ? this.value : undefined })
		this.listener.changed?.(this)
		const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
		if (this.value && regex.test(this.value)) {
			this.sliderMode === "rgb" ? (this.rgb = hexToRGB(this.value)) : (this.hsl = RGBtoHSL(hexToRGB(this.value)))
		} else if (!this.value || !regex.test(this.value)) {
			this.rgb = { r: undefined, g: undefined, b: undefined }
			this.hsl = { h: undefined, s: undefined, l: undefined }
		}
	}
	handleSwitchMode(event: CustomEvent) {
		event.stopPropagation()
		this.sliderMode = event.detail ? "hsl" : "rgb"
		if (this.sliderMode === "rgb") {
			this.value && (this.rgb = hexToRGB(this.value))
		} else {
			this.value && (this.hsl = RGBtoHSL(hexToRGB(this.value)))
		}
	}
	sliderInputHandler(event: CustomEvent<Data>) {
		event.stopPropagation()
		let temporaryColor = this.sliderMode === "rgb" ? this.rgb : this.hsl
		type ColorType = HSL | RGB
		const color = Object.keys(event.detail)[0]
		if (event.detail[color] !== undefined) {
			for (const key of Object.keys(temporaryColor)) {
				if (key === color)
					temporaryColor = { ...temporaryColor, [key]: event.detail[color] }
				else if (temporaryColor[key as keyof ColorType] === undefined) {
					temporaryColor = { ...temporaryColor, [key]: 0 }
				}
			}
			if (this.sliderMode === "rgb") {
				this.rgb = { ...temporaryColor } as RGB
				this.value = RGBToHex(this.rgb)
			} else {
				this.hsl = { ...temporaryColor } as HSL
				this.value = RGBToHex(HSLtoRGB(this.hsl))
			}
		}
	}
	openDropdown(): void {
		this.open = !this.open
	}
	render(): VNode | VNode[] {
		return (
			<Host
				style={{
					"--hexCode": this.value,
					"--rgb": `${this.rgb}`,
					"--hsl": `${this.hsl.h} ${this.hsl.s}% ${this.hsl.l}%`,
					"--hsl-100-s": `${this.hsl.h} 100% 50%`,
					"--hsl-0-s": `${this.hsl.h} 0% 50%`,
					"--hsl-s-thumb-color": `${this.hsl.h} ${this.hsl.s}% 50%`,
					"--element-height": `${this.element.clientHeight}px`,
				}}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					type={"hex-color"}
					readonly={this.readonly}
					onClick={() => !this.readonly && this.openDropdown()}
					onSmoothlyInput={event => (event?.stopPropagation(), (this.value = event.detail[this.name]))}>
					<slot />
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
				{this.open && !this.readonly && (
					<div class="rgb-sliders">
						<smoothly-toggle-switch
							onSmoothlyToggleSwitchChange={event => this.handleSwitchMode(event)}
							size="tiny"
							checkmark={false}
							selected={this.sliderMode === "hsl"}
						/>
						{Object.entries(this.sliderMode === "rgb" ? this.rgb : this.hsl).map(([key, value]) => (
							<smoothly-input-range
								name={key}
								min={key === "h" ? 1 : 0}
								max={key === "h" ? 360 : key === "s" || key === "l" ? 100 : 255}
								value={value ? Math.round(value) : value}
								step={1}
								outputSide="right"
								valueText={
									this.sliderMode === "hsl" && key !== "h" ? `${value ? Math.round(value) : value} %` : undefined
								}
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
