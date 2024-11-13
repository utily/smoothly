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
import { HSL } from "../../../model/Color/HSL"
import { RGB } from "../../../model/Color/RGB"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { SmoothlyInput } from "../index"
import { Input } from "../Input"
import { Looks } from "../Looks"

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
	@Prop({ mutable: true, reflect: true }) looks?: Looks
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() output: "rgb" | "hex" = "rgb"
	@Prop() name: string
	@Prop({ reflect: true }) showLabel = true
	@Element() element: HTMLSmoothlyInputColorElement
	@State() open = false
	@State() sliderMode: "rgb" | "hsl" = "rgb"
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	async componentWillLoad(): Promise<void> {
		this.value && this.setInitialValue()
		this.value && (this.rgb = Color.Hex.toRGB(this.value))
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = this.looks ?? looks), (this.color = color)))
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
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
		!event.composedPath().includes(this.element) && this.open && (this.open = !this.open)
	}
	@Method()
	async getValue(): Promise<RGB | string | undefined> {
		return this.output === "rgb"
			? {
					r: this.rgb.r === undefined ? undefined : Math.round(this.rgb.r),
					g: this.rgb.g === undefined ? undefined : Math.round(this.rgb.g),
					b: this.rgb.b === undefined ? undefined : Math.round(this.rgb.b),
			  }
			: this.value
			? this.value
			: undefined
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
	async valueChanged(): Promise<void> {
		this.changed = this.initialValue !== this.value
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.listener.changed?.(this)
	}
	handleSwitchMode(event: CustomEvent): void {
		event.stopPropagation()
		this.sliderMode = event.detail ? "hsl" : "rgb"
		if (this.sliderMode === "rgb") {
			this.value && (this.rgb = Color.Hex.toRGB(this.value))
		} else {
			this.value && (this.hsl = Color.RGB.toHSL(Color.Hex.toRGB(this.value)))
		}
	}
	hexInputHandler(value: string): void {
		if (value !== this.value) {
			if (value && Color.Hex.type.is(value)) {
				if (this.sliderMode === "hsl" || this.rgb.r === undefined) {
					this.rgb = Color.Hex.toRGB(value)
				}
				if (this.sliderMode === "rgb" || this.hsl.h === undefined) {
					this.hsl = Color.RGB.toHSL(Color.Hex.toRGB(value))
				}
			} else if (!value || !Color.Hex.type.is(value)) {
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
				this.hsl = Color.RGB.toHSL(this.rgb)
				this.hexInputHandler(Color.RGB.toHex(this.rgb))
			} else {
				this.hsl = { ...temporaryColor } as HSL
				this.rgb = Color.HSL.toRGB(this.hsl)
				this.hexInputHandler(Color.RGB.toHex(Color.HSL.toRGB(this.hsl)))
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
					looks={undefined}
					color={this.color}
					type={"hex-color"}
					showLabel={this.showLabel}
					readonly={this.readonly}
					onSmoothlyInput={event => (event?.stopPropagation(), this.hexInputHandler(event.detail[this.name]))}>
					<slot />
				</smoothly-input>
				<div class="color-sample" />
				<smoothly-icon
					color={this.color}
					name="options-outline"
					size="small"
					onClick={() => !this.readonly && this.openDropdown()}
				/>
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
								color={undefined}
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
								color={undefined}
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
