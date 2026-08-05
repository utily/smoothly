import { Component, h, Host, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-input-range-demo",
})
export class SmoothlyInputRangeDemo {
	@Listen("smoothlyUserInput")
	smoothlyInputHandler(event: CustomEvent<Record<string, any>>) {
		console.log("smoothlyUserInput emitted:", event.detail.name, ": ", event.detail.value)
	}
	@Listen("smoothlyInput")
	smoothlyInputHandler2(event: CustomEvent<Record<string, any>>) {
		console.log("smoothlyInput emitted:", event.detail)
	}
	render() {
		return (
			<Host>
				<h2>Range</h2>
				{/* <h3>Phone Number</h3>
				<smoothly-input-range name="first" min={700000000} max={799999999} step={1} label={"Phone Number"} /> */}
				<h3>Stars out of ten</h3>
				<smoothly-input-range name="stars" max={10} step={1} label={"Stars"} />
				{/* <h3>Percent</h3>
				<smoothly-input-range name="percent" type="percent" max={1} step={0.01} label={"Percent"} />
				<h3>With icon at start and clear button</h3>
				<smoothly-input-range step={1} name="withClear" label="Select">
					<smoothly-icon name="checkmark-circle" slot="start" />
					<smoothly-input-clear size="icon" slot="end" />
				</smoothly-input-range> */}
				<h3>Dual (start / end)</h3>
				<smoothly-input-range dual min={0} max={100} step={1} name="dualRange" label="Range" />
				{/* <h3>Dual percent</h3>
				<smoothly-input-range
					dual
					name="dualRangePercent"
					type="percent"
					min={0}
					max={1}
					
					step={0.01}
					label="Percent range" />
				*/}
			</Host>
		)
	}
}
