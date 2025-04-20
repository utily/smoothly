import { Component, Element, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"
import { Color } from "../../../../model"
import { Looks } from "../../Looks"

type Options = {
	color?: Color
	looks?: Looks
	borderRadius?: number
	readonly?: boolean
	disabled?: boolean
	invalid?: boolean
	errorMessage?: string
	showLabel?: boolean
	placeholder?: string
}

@Component({
	tag: "smoothly-input-demo-standard",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoStandard {
	@Element() element: HTMLElement
	@State() duration: isoly.TimeSpan = { hours: 8 }
	@State() options: Options = {}

	connectedCallback() {
		this.updateInputHeightText()
	}
	componentDidRender() {
		this.updateInputHeightText()
	}

	updateInputHeightText() {
		const rootFontSize = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""))
		this.element.querySelectorAll(".height").forEach((el: HTMLDivElement) => {
			const height = el.clientHeight
			el.innerHTML = `<b>${height / rootFontSize}rem</b> (${height}pixels)`
		})
	}

	render() {
		return (
			<Host>
				<div class="description">
					<h2>Input Standard</h2>
					<p>
						Height of input should be <code>3rem</code> including border. This is should result in a 48 pixel height at
						100% zoom, assuming a root font-size of 16 pixels.
					</p>
					<smoothly-form looks={"grid"} onSmoothlyFormInput={(e: CustomEvent<Options>) => (this.options = e.detail)}>
						<smoothly-input-select name="color">
							<span slot="label">Color</span>
							{Color.values.map(c => (
								<smoothly-item value={c}>
									<span color={c}>{c}</span>
								</smoothly-item>
							))}
							<smoothly-input-clear slot="end" />
						</smoothly-input-select>
						<smoothly-input-select name="looks">
							<span slot="label">Looks</span>
							{Looks.values.map(l => (
								<smoothly-item value={l}>{l}</smoothly-item>
							))}
						</smoothly-input-select>
						<smoothly-input-range label={"Border Radius (rem)"} name={"borderRadius"} min={0} max={2} step={0.25} />
						<smoothly-input-checkbox name="readonly">Readonly</smoothly-input-checkbox>
						<smoothly-input-checkbox name="disabled">Disabled</smoothly-input-checkbox>
						<smoothly-input-checkbox name="invalid">Invalid</smoothly-input-checkbox>
						<smoothly-input name="errorMessage" value="This is not a valid value">
							Error Message
						</smoothly-input>
						<smoothly-input-checkbox name="showLabel" checked>
							Show Label
						</smoothly-input-checkbox>
						<smoothly-input name="placeholder">Placeholder</smoothly-input>
					</smoothly-form>
				</div>
				<div class="input-wrapper" style={{ "--smoothly-input-border-radius": `${this.options.borderRadius}rem` }}>
					<div class="width">width: 100%</div>
					<div class="left-padding">padding-left: 0.5rem</div>
					<smoothly-input
						name="text"
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						invalid={this.options.invalid}
						errorMessage={this.options.errorMessage}
						showLabel={this.options.showLabel}
						placeholder={this.options.placeholder}>
						{this.options.showLabel && <span>Text</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input>
					<div class="height" />

					<smoothly-input-select
						name="month"
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						invalid={this.options.invalid}
						errorMessage={this.options.errorMessage}
						placeholder={this.options.placeholder}>
						{this.options.showLabel && <label slot="label">Select</label>}
						<smoothly-item value="1">January</smoothly-item>
						<smoothly-item value="2">February</smoothly-item>
						<smoothly-item value="3">March</smoothly-item>
						<smoothly-item value="4">April</smoothly-item>
						<smoothly-item value="5">May</smoothly-item>
						<smoothly-item value="6">June</smoothly-item>
						<smoothly-item value="7">July</smoothly-item>
						<smoothly-item value="8">August</smoothly-item>
						<smoothly-item value="9">September</smoothly-item>
						<smoothly-item value="10">October</smoothly-item>
						<smoothly-item value="11">November</smoothly-item>
						<smoothly-item value="12">December</smoothly-item>
						<smoothly-input-clear slot="end" />
					</smoothly-input-select>
					<div class="height" />

					<smoothly-input-checkbox
						name={"checkbox"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}>
						Check
					</smoothly-input-checkbox>
					<div class="height" />

					<smoothly-input-radio
						name={"radio"}
						clearable
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <label slot="label">Radio</label>}
						<smoothly-input-radio-item value={"first"}>Label 1</smoothly-input-radio-item>
						<smoothly-input-radio-item selected value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"third"}>Label 3</smoothly-input-radio-item>
						<smoothly-input-clear slot="end" />
					</smoothly-input-radio>
					<div class="height" />

					<smoothly-input-file
						name={"file"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						// TODO - disabled
						// TODO - invalid
						// TODO - errorMessage
						showLabel={this.options.showLabel}
						placeholder={this.options.placeholder}>
						{this.options.showLabel && <span slot={"label"}>File</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-file>
					<div class="height" />

					<smoothly-input-range
						name={"range"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						// TODO - invalid
						// TODO - errorMessage
						label={this.options.showLabel ? "Range" : undefined}
						// TODO - disabled
						// TODO - placeholder
					>
						<smoothly-input-clear slot="end" />
					</smoothly-input-range>
					<div class="height" />

					<smoothly-input-color
						name={"color"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						// TODO - disabled
						// TODO - invalid
						// TODO - errorMessage
						showLabel={this.options.showLabel}
						// TODO - placeholder
					>
						{this.options.showLabel && <span>Color</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-color>
					<div class="height" />

					<smoothly-input-date
						name={"date"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						invalid={this.options.invalid}
						// TODO - errorMessage
						showLabel={this.options.showLabel}
						// TODO - placeholder
					>
						{this.options.showLabel && <span>Date</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-date>
					<div class="height" />

					<smoothly-input-date-time
						name={"dateTime"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						invalid={this.options.invalid}
						errorMessage={this.options.errorMessage}
						showLabel={this.options.showLabel}
						// TODO - placeholder
					>
						DateTime
						<smoothly-input-clear slot="end" />
					</smoothly-input-date-time>
					<div class="height" />

					<smoothly-input-date-range
						name={"dateRange"}
						color={this.options.color}
						looks={this.options.looks}
						readonly={this.options.readonly}
						disabled={this.options.disabled}
						invalid={this.options.invalid}
						// TODO - errorMessage
						placeholder={this.options.placeholder}
						showLabel={this.options.showLabel}
						// TODO - placeholder
					>
						{this.options.showLabel && <span>Date Range</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-date-range>
					<div class="height" />
				</div>
			</Host>
		)
	}
}
