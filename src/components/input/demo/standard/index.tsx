import { Component, Element, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"
import { Color } from "../../../../model"
import { Looks } from "../../Looks"

type Options = {
	looks?: Looks
	readonly?: boolean
	color?: Color
	vertical?: boolean
	showLabel?: boolean
	placeholder?: boolean
	borderRadius?: number
}

@Component({
	tag: "smoothly-input-demo-standard",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemoStandard {
	@Element() element: HTMLElement
	@State() duration: isoly.TimeSpan = { hours: 8 }
	@State() options: Options = { showLabel: true }

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
		const placeholder = this.options.placeholder ? "placeholder" : undefined
		return (
			<Host class={{ vertical: !!this.options.vertical }}>
				<div class="description">
					<h2>Input Standard</h2>
					<p>
						Height of input should be <code>3rem</code> including border. This is should result in a 48 pixel height at
						100% zoom, assuming a root font-size of 16 pixels.
					</p>
					<smoothly-form looks={"grid"} onSmoothlyFormInput={(e: CustomEvent<Options>) => (this.options = e.detail)}>
						<smoothly-input-select name="looks">
							<span slot="label">Looks</span>
							{Looks.types.map(l => (
								<smoothly-item value={l}>{l}</smoothly-item>
							))}
						</smoothly-input-select>
						<smoothly-input-checkbox name="readonly">Readonly</smoothly-input-checkbox>
						<smoothly-input-select name="color">
							<span slot="label">Color</span>
							{Color.types.map(c => (
								<smoothly-item value={c}>
									<span color={c}>{c}</span>
								</smoothly-item>
							))}
							<smoothly-input-clear slot="end" />
						</smoothly-input-select>
						<smoothly-input-checkbox name="vertical">Vertical Layout</smoothly-input-checkbox>
						<smoothly-input-checkbox name="showLabel" checked={this.options.showLabel}>
							Show Label
						</smoothly-input-checkbox>
						<smoothly-input-checkbox name="placeholder" checked={this.options.placeholder}>
							Placeholder
						</smoothly-input-checkbox>
						<smoothly-input-range
							label={"Border Radius (rem)"}
							name={"borderRadius"}
							value={this.options.borderRadius}
							min={0}
							max={2}
							step={0.25}
						/>
					</smoothly-form>
				</div>
				<div class="input-wrapper" style={{ "--smoothly-input-border-radius": `${this.options.borderRadius}rem` }}>
					<div class="width">100%</div>
					<div class="left-padding">0.5rem - left padding</div>
					<smoothly-input
						name="text"
						looks={this.options.looks}
						placeholder={placeholder}
						readonly={this.options.readonly}
						color={this.options.color}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <span>Text</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input>
					<div class="height" />

					<smoothly-input-select
						name="month"
						looks={this.options.looks}
						placeholder={placeholder}
						readonly={this.options.readonly}
						color={this.options.color}>
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
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}>
						Check
					</smoothly-input-checkbox>
					<div class="height" />

					<smoothly-input-radio
						name="radio"
						clearable
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}
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
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}
						placeholder={placeholder}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <span slot={"label"}>File</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-file>
					<div class="height" />

					<smoothly-input-range
						label={this.options.showLabel ? "Range" : undefined}
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}>
						<smoothly-input-clear slot="end" />
					</smoothly-input-range>
					<div class="height" />

					<smoothly-input-color
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <span>Color</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-color>
					<div class="height" />

					<smoothly-input-date
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <span>Date</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-date>
					<div class="height" />

					<smoothly-input-date-range
						looks={this.options.looks}
						readonly={this.options.readonly}
						color={this.options.color}
						placeholder={placeholder}
						showLabel={this.options.showLabel}>
						{this.options.showLabel && <span>Date Range</span>}
						<smoothly-input-clear slot="end" />
					</smoothly-input-date-range>
					<div class="height" />
					<div class={{ "guide-lines": true, "show-label": !!this.options.showLabel }}>
						{this.options.showLabel ? "Aligned labels & values" : "Center values"}
					</div>
				</div>
			</Host>
		)
	}
}
