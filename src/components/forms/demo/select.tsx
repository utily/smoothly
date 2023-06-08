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
				<h4>Select</h4>
				<smoothly-select-new options={options}>Select</smoothly-select-new>
				<br />
				<smoothly-select-new multiple options={options}>
					Select mutiple
				</smoothly-select-new>
				<br />
				<smoothly-select-new filterable options={options}>
					Select filterable
				</smoothly-select-new>
			</Host>
		)
	}
}
