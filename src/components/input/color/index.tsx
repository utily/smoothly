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
		this.smoothlyInput.emit({
			[this.name]:
				this.output === "rgb"
					? {
							r: this.rgb.r === undefined ? undefined : Math.round(this.rgb.r),
							g: this.rgb.g === undefined ? undefined : Math.round(this.rgb.g),
							b: this.rgb.b === undefined ? undefined : Math.round(this.rgb.b),
					  }
					: this.value
					? this.value
					: undefined,
		})
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
		this.hsl = { h: undefined, s: undefined, l: undefined }
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
		this.smoothlyInput.emit({
			[this.name]:
				this.output === "rgb"
					? {
							r: this.rgb.r === undefined ? undefined : Math.round(this.rgb.r),
							g: this.rgb.g === undefined ? undefined : Math.round(this.rgb.g),
							b: this.rgb.b === undefined ? undefined : Math.round(this.rgb.b),
					  }
					: this.value
					? this.value
					: undefined,
		})
		this.listener.changed?.(this)
	}
	handleSwitchMode(event: CustomEvent): void {
		event.stopPropagation()
		this.sliderMode = event.detail ? "hsl" : "rgb"
		if (this.sliderMode === "rgb") {
			this.value && (this.rgb = hexToRGB(this.value))
		} else {
			this.value && (this.hsl = RGBtoHSL(hexToRGB(this.value)))
		}
	}
	hexInputHandler(value: string): void {
		if (value !== this.value) {
			const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
			if (value && regex.test(value)) {
				if (this.sliderMode === "hsl" || this.rgb.r === undefined) {
					this.rgb = hexToRGB(value)
				}
				if (this.sliderMode === "rgb" || this.hsl.h === undefined) {
					this.hsl = RGBtoHSL(hexToRGB(value))
				}
			} else if (!value || !regex.test(value)) {
				this.rgb = { r: undefined, g: undefined, b: undefined }
				this.hsl = { h: undefined, s: undefined, l: undefined }
			}
			this.value = value
		}
	}
	sliderInputHandler(event: CustomEvent<Data>): void {
		event.stopPropagation()
		const color = Object.keys(event.detail)[0]
		let temporaryColor = this.sliderMode === "rgb" ? this.rgb : this.hsl
		type ColorType = HSL | RGB
		if (!(event.detail[color] === undefined)) {
			for (const key of Object.keys(temporaryColor))
				if (key === color)
					temporaryColor = {
						...temporaryColor,
						[key]: key === "s" || key === "l" ? +(event.detail[color] ?? 0) * 100 : event.detail[color],
					}
				else if (temporaryColor[key as keyof ColorType] === undefined)
					temporaryColor = { ...temporaryColor, [key]: 0 }
			if (this.sliderMode === "rgb") {
				this.rgb = { ...temporaryColor } as RGB
				this.hsl = RGBtoHSL(this.rgb)
				this.hexInputHandler(RGBToHex(this.rgb))
			} else {
				this.hsl = { ...temporaryColor } as HSL
				this.rgb = HSLtoRGB(this.hsl)
				this.hexInputHandler(RGBToHex(HSLtoRGB(this.hsl)))
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
					"--rgb-r": `${Math.round(this.rgb.r ?? 0)}`,
					"--rgb-g": `${Math.round(this.rgb.g ?? 0)}`,
					"--rgb-b": `${Math.round(this.rgb.b ?? 0)}`,
					"--hsl-h": `${Math.round(this.hsl.h ?? 0)}`,
					"--hsl-s": `${Math.round(this.hsl.s ?? 0)}%`,
					"--hsl-l": `${Math.round(this.hsl.l ?? 0)}%`,
					"--element-height": `${this.element.clientHeight}px`,
				}}>
				<smoothly-input
					value={this.value}
					name={this.name}
					looks={this.looks}
					type={"hex-color"}
					readonly={this.readonly}
					onClick={() => !this.readonly && this.openDropdown()}
					onSmoothlyInput={event => (event?.stopPropagation(), this.hexInputHandler(event.detail[this.name]))}>
					<slot />
					<div slot="end" class="color-sample"></div>
				</smoothly-input>
				{this.open && !this.readonly && (
					<div class="rgb-sliders">
						<smoothly-toggle-switch
							title={`${this.sliderMode === "rgb" ? "To HSL" : "To RGB"}`}
							onSmoothlyToggleSwitchChange={event => this.handleSwitchMode(event)}
							size="tiny"
							checkmark={false}
							selected={this.sliderMode === "hsl"}
						/>
						{Object.entries(this.rgb).map(([key, value]) => (
							<smoothly-input-range
								style={this.sliderMode != "rgb" ? { display: "none" } : {}}
								name={key}
								min={0}
								max={255}
								type={"text"}
								value={value}
								step={1}
								outputSide="right"
								onSmoothlyInput={event => this.sliderInputHandler(event)}
								label={key.toUpperCase()}
							/>
						))}
						{Object.entries(this.hsl).map(([key, value]) => (
							<smoothly-input-range
								style={this.sliderMode != "hsl" ? { display: "none" } : {}}
								name={key}
								min={0}
								max={key === "h" ? 359 : 1}
								type={key === "s" || key === "l" ? "percent" : "text"}
								value={(key === "s" || key === "l") && value ? value / 100 : value}
								step={key === "s" || key === "l" ? 0.01 : 1}
								outputSide="right"
								onSmoothlyInput={event => this.sliderInputHandler(event)}
								label={key.toUpperCase()}
							/>
						))}
					</div>
				)}
			</Host>
		)
	}
}
