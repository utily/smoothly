import { Component, Event, EventEmitter, Fragment, h, Host, State } from "@stencil/core"
import { Color, Fill, Icon, Notice } from "../../../model"
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
		customColor?: string
		fill?: Fill
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
				<smoothly-form
					onSmoothlyFormInput={e => {
						this.props = e.detail
						console.log("props", this.props)
					}}>
					<smoothly-input-select name={"color"}>
						<span slot={"label"}>Color</span>
						{Color.values.map(color => (
							<smoothly-item value={color}>
								<span
									style={{
										background: `rgb(var(--smoothly-${color}-color))`,
										"margin-right": "0.5rem",
										width: "2.5rem",
										height: "2.5rem",
									}}
								/>
								<span>{color}</span>
							</smoothly-item>
						))}
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
					<smoothly-input-select name={"fill"}>
						<span slot={"label"}>Fill</span>
						{Fill.values.map(fill => (
							<smoothly-item value={fill}>{fill}</smoothly-item>
						))}
						<smoothly-input-clear slot={"end"} />
					</smoothly-input-select>
					<smoothly-input-select name="customColor" menuHeight="12items" ordered>
						<span slot={"label"}>Custom Color</span>
						{Color.values.flatMap(c => (
							<Fragment>
								{["tint", "color", "shade", "contrast"].map(v => (
									<smoothly-item value={`--smoothly-${c}-${v}`}>
										<span
											style={{
												background: `rgb(var(--smoothly-${c}-${v}))`,
												"margin-right": "0.5rem",
												width: "2.5rem",
												height: "2.5rem",
											}}
										/>
										<span>{`rgb(var(--smoothly-${c}-${v}))`}</span>
									</smoothly-item>
								))}
							</Fragment>
						))}
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
							tooltip={name}
							data-name={name}
							color={this.props.color}
							style={{
								fill: this.props["customColor"] ? `rgb(var(${this.props["customColor"]}))` : "",
								color: this.props["customColor"] ? `rgb(var(${this.props["customColor"]}))` : "",
							}}
							fill={this.props.fill}
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
