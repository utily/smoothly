import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }

	render() {
		return (
			<Host>
				<div class="forms">
					<h2>Menu</h2>
					<smoothly-menu searchable>
						<smoothly-item value="1">Ice cream</smoothly-item>
						<smoothly-item value="2">Sponge cake</smoothly-item>
						<smoothly-item value="3">Cookie</smoothly-item>
						<smoothly-item value="4">Croissant</smoothly-item>
						<smoothly-item value="5">Chocolate fondue</smoothly-item>
					</smoothly-menu>
					<h2>Menu scroll</h2>
					<smoothly-menu height="16rem" searchable>
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
					</smoothly-menu>
					<h2>Input Select</h2>
					<smoothly-input-select menuHeight="7.5items" placeholder="Select..." multiple name="select-month">
						<label slot="label">Month</label>
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
						<smoothly-input-clear size="icon" slot="end"></smoothly-input-clear>
					</smoothly-input-select>
				</div>
			</Host>
		)
	}
}
