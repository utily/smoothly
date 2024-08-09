import { Component, h, Host } from "@stencil/core"

@Component({
	tag: "smoothly-input-range-demo",
})
export class SmoothlyInputRangeDemo {
	render() {
		return (
			<Host>
				<h2>Range</h2>
				<h3>Phone Number</h3>
				<smoothly-input-range min={700000000} max={799999999} step={1} label={"Phone Number"} />
				<h3>Max 10 step 1 type text</h3>
				<smoothly-input-range max={10} step={1} label={"Max 10 step 1"} />
				<h3>Percent</h3>
				<smoothly-input-range type="percent" max={1} step={0.01} label={"Max 100 step 1"} />
				<h3>With icon at start and clear button</h3>
				<smoothly-input-range step={1} name="range2" label="Select">
					<smoothly-icon name="checkmark-circle" slot="start" />
					<smoothly-input-clear size="icon" slot="end" />
				</smoothly-input-range>
			</Host>
		)
	}
}
