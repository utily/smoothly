import { Component, h, Host } from "@stencil/core"

const options = [
	{ value: "January", label: "January" },
	{ value: "February", label: "February" },
	{ value: "March", label: "March" },
	{ value: "April", label: "April" },
	{ value: "May", label: "May" },
	{ value: "June", label: "June" },
	{ value: "July", label: "July" },
	{ value: "August", label: "August" },
	{ value: "September", label: "September" },
	{ value: "October", label: "October" },
	{ value: "November", label: "November" },
	{ value: "December", label: "December" },
]

@Component({
	tag: "smoothly-select-new-preview",
})
export class SmoothlySelectNewPreview {
	render() {
		return (
			<Host>
				<h4>Select props</h4>
				<smoothly-select-new options={options} placeholder="Select a value">
					Default
				</smoothly-select-new>
				<br />
				<smoothly-select-new multiple options={options} placeholder="Select a value">
					Mutiple
				</smoothly-select-new>
				<br />
				<smoothly-select-new filterable options={options} placeholder="Select a value">
					Filterable
				</smoothly-select-new>
				<br />

				<h4>Select controll</h4>
				<smoothly-select-new options={options} placement="start" value="January" placeholder="Aaa" clearable>
					Clearable
				</smoothly-select-new>
				<br />
				<smoothly-select-new
					options={options}
					placement="start"
					value="October"
					placeholder="Aaa"
					filterable
					readonly
					editable>
					Editable
				</smoothly-select-new>
				<br />
				<smoothly-select-new
					options={options}
					value={["January", "March"]}
					placeholder="Aaa"
					multiple
					readonly
					editable
					clearable
					icon="chevron-down">
					Combined
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} placement="start" placeholder="Aaa" info="Awsome text that help user">
					Info
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} placement="start" error="Inputfield is required">
					Error
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} tooltip="Awsome tooltip about stuffs!" placeholder="Select a month">
					Tooltip
				</smoothly-select-new>
				<br />

				<h4>Style options</h4>
				<smoothly-select-new options={options} layout="line">
					Layout
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} placement="top" placeholder="Aaa">
					Placement
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} icon="chevron-down">
					Icon
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} icon="checkmark-circle" fill="success">
					Fill
				</smoothly-select-new>
				<br />
				<smoothly-select-new options={options} radius="rounded" placeholder="Aaa">
					Radius
				</smoothly-select-new>
			</Host>
		)
	}
}
