import { Component, Event, EventEmitter, h, Host, State } from "@stencil/core"
import { Color, Icon, Notice } from "../../../model"
@Component({
	tag: "smoothly-icon-demo",
	styleUrl: "./style.css",
	scoped: true,
})
export class SmoothlyIconDemo {
	page = 0

	@State() display: { filter?: string; variant?: "outline" | "sharp" } = {}
	@State() props: {
		color?: Color
		flip?: "x" | "y"
		size?: "tiny" | "small" | "medium" | "large" | "xlarge"
		rotate?: number
	} = {}
	@Event() notice: EventEmitter<Notice>

	render() {
		return (
			<Host>
				<h2>Filter and Variants</h2>
				<smoothly-form onSmoothlyFormInput={e => (this.display = e.detail)}>
					<smoothly-input name="filter">Filter</smoothly-input>
					<smoothly-input-select name="variant">
						<span slot="label">Variant</span>
						<smoothly-item value={"outline"}>outline</smoothly-item>
						<smoothly-item value={"sharp"}>sharp</smoothly-item>
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
				</smoothly-form>
				<h2>Props</h2>
				<smoothly-form onSmoothlyFormInput={e => (this.props = e.detail)}>
					<smoothly-input-select name={"color"}>
						<span slot={"label"}>Color</span>
						{Color.types.map(color => (
							<smoothly-item value={color} color={color}>
								{color}
							</smoothly-item>
						))}
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
					<smoothly-input-select name="flip">
						<span slot={"label"}>Flip</span>
						<smoothly-item value={"x"}>x</smoothly-item>
						<smoothly-item value={"y"}>y</smoothly-item>
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
					<smoothly-input-select name={"size"}>
						<span slot={"label"}>Size</span>
						<smoothly-item value={"tiny"}>tiny</smoothly-item>
						<smoothly-item value={"small"}>small</smoothly-item>
						<smoothly-item value={"medium"}>medium</smoothly-item>
						<smoothly-item value={"large"}>large</smoothly-item>
						<smoothly-item value={"xlarge"}>xlarge</smoothly-item>
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
					<smoothly-input-range name="rotate" step={1} min={-180} max={180} value={0}>
						Rotate
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-range>
				</smoothly-form>
				<h1>Icons</h1>
				<div class="icons">
					{[
						...Icon.Name.values
							.filter(name => !this.display.filter || name.includes(this.display.filter))
							.map((name): Icon => (this.display.variant ? `${name}-${this.display.variant}` : name)),
						...Icon.Logo.values.filter(name => !this.display.filter || name.includes(this.display.filter)),
					].map(name => (
						<smoothly-icon
							name={name}
							toolTip={name}
							data-name={name}
							color={this.props.color}
							flip={this.props.flip}
							size={this.props.size}
							rotate={this.props.rotate}
							onClick={() => {
								navigator.clipboard.writeText(name)
								this.notice.emit(Notice.succeeded(`Copied "${name}"`))
							}}
						/>
					))}
				</div>
			</Host>
		)
	}
}
