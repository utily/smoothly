import { Component, h, Host, State, Watch } from "@stencil/core"
import { Color, Fill, Icon } from "../../../../model"
import { Button } from "../../Button"

type Options = {
	fill?: Fill
	disabled?: boolean
	expand?: "block" | "full"
	type?: Button.Properties["type"]
	size?: "small" | "large" | "icon" | "flexible"
	rounded?: boolean
	icon?: Icon
	text?: { value: string; useColor?: boolean }
}

@Component({
	tag: "smoothly-button-demo-standard",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyButtonDemoStandard {
	@State() props: Options = {}
	@State() heightText: string = ""
	@State() lastButton?: HTMLElement

	@Watch("props")
	updateInputHeightText() {
		setTimeout(() => {
			const rootFontSize = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""))
			if (this.lastButton) {
				const heightPx = this.lastButton.clientHeight
				this.heightText = `${heightPx / rootFontSize}rem (${heightPx}px)`
			}
		}, 100)
	}

	render() {
		return (
			<Host>
				<h2>Button Standard</h2>
				<smoothly-form onSmoothlyFormInput={e => (this.props = e.detail)} looks="grid">
					<smoothly-input-checkbox name="text.useColor" checked>
						Use Color as Text
					</smoothly-input-checkbox>
					<smoothly-input-select name="size">
						<span slot="label">Size</span>
						{["small", "large", "icon", "flexible"].map(size => (
							<smoothly-item value={size} key={size}>
								{size}
							</smoothly-item>
						))}
					</smoothly-input-select>
					<smoothly-input name="text.value" value="Button">
						Text
						<smoothly-input-clear slot="end" />
					</smoothly-input>
					<smoothly-input-radio name="expand" clearable>
						<span slot="label">Expand</span>
						<smoothly-input-radio-item value="block">block</smoothly-input-radio-item>
						<smoothly-input-radio-item value="full">full</smoothly-input-radio-item>
						<smoothly-input-clear slot="end" />
					</smoothly-input-radio>
					<smoothly-input-select name="fill">
						<span slot="label">Fill</span>
						{Fill.values.map(fill => (
							<smoothly-item value={fill} key={fill}>
								{fill}
							</smoothly-item>
						))}
					</smoothly-input-select>
					<smoothly-input-checkbox name="disabled">Disabled</smoothly-input-checkbox>
					<smoothly-input-select name="type">
						<span slot="label">Type</span>
						{["button", "submit", "reset", "link"].map(type => (
							<smoothly-item value={type} key={type}>
								{type}
							</smoothly-item>
						))}
					</smoothly-input-select>
					<smoothly-input-checkbox name="rounded">Rounded</smoothly-input-checkbox>
					<smoothly-input-select name="icon" menuHeight="8items">
						<span slot="label">Icon</span>
						{Icon.Name.values.map(icon => (
							<smoothly-item value={icon} key={icon}>
								<smoothly-icon name={icon} size="small" tooltip={icon} />
							</smoothly-item>
						))}
						<smoothly-input-clear slot="end" />
					</smoothly-input-select>
				</smoothly-form>
				<div class="buttons">
					{Color.values.map((color, index, colors) => (
						<smoothly-button
							ref={el => colors.length - 1 == index && (this.lastButton = el)}
							color={color}
							expand={this.props.expand}
							fill={this.props.fill}
							disabled={this.props.disabled}
							shape={this.props.rounded ? "rounded" : undefined}
							size={this.props.size}
							type={this.props.type}
							key={color}>
							{this.props.icon ? <smoothly-icon name={this.props.icon} /> : undefined}
							{this.props.text?.useColor ? color : this.props.text?.value}
						</smoothly-button>
					))}
					<div class="height-text">{this.heightText}</div>
				</div>
			</Host>
		)
	}
}
