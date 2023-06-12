import { Component, Fragment, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-input-new-preview",
})
export class SmoothlyInputNewPreview {
	render() {
		return (
			<Host>
				<h4>Layout option</h4>
				{["line", "grid", "border", "solid"].map((type: any) => (
					<Fragment>
						<smoothly-input-new layout={type} placement="float" placeholder="Placeholder">
							{type.slice(0, 1).toUpperCase() + type.slice(1)}
						</smoothly-input-new>
						<br />
					</Fragment>
				))}
				<h4>Label placement</h4>
				{["float", "start", "top", "outside"].map((type: any) => (
					<Fragment>
						<smoothly-input-new layout="border" placement={type} placeholder="Placeholder">
							{type.slice(0, 1).toUpperCase() + type.slice(1)}
						</smoothly-input-new>
						<br />
					</Fragment>
				))}
				<h4>Border radius</h4>
				{["default", "rounded", "circle"].map((type: any) => (
					<Fragment>
						<smoothly-input-new layout="border" placement="start" radius={type}>
							{type.slice(0, 1).toUpperCase() + type.slice(1)}
						</smoothly-input-new>
						<br />
					</Fragment>
				))}
				<h4>Icons & fill</h4>
				<smoothly-input-new layout="border" placement="start" icon="checkmark-circle" fill="success">
					Success
				</smoothly-input-new>
				<br />
				<h4>Tooltip</h4>
				<smoothly-input-new
					placement="float"
					placeholder="Placeholder"
					tooltip="Tooltip can be of type string or HTMLElement">
					Tooltip
				</smoothly-input-new>
				<br />
				<h4>input Controll</h4>
				<smoothly-input-new
					layout="line"
					placement="start"
					placeholder="Placeholder"
					value="Click icon to clear input value"
					clearable>
					Clearable
				</smoothly-input-new>
				<br />
				<smoothly-input-new
					layout="line"
					placement="start"
					placeholder="Placeholder"
					value="Click icon to edit"
					editable
					readonly>
					Editable
				</smoothly-input-new>
				<br />
				<smoothly-input-new
					layout="line"
					placement="start"
					placeholder="Placeholder"
					value="Click icon 2x"
					clearable
					editable
					icon="checkmark"
					readonly>
					Combined
				</smoothly-input-new>
				<br />
				<smoothly-input-new
					layout="line"
					placement="float"
					placeholder="Placeholder"
					info="Can be either string or HTMLElement">
					Info
				</smoothly-input-new>
				<br />
				<smoothly-input-new
					layout="line"
					placement="float"
					placeholder="Placeholder"
					error="Can be either string or HTMLElement">
					Error
				</smoothly-input-new>
			</Host>
		)
	}
}
