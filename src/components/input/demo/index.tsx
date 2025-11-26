import { Component, Event, EventEmitter, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }
	@State() alphanumeric: string = "!@##"
	private numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	@Event() smoothlyUrlUpdate: EventEmitter<{ path: string; query?: string }>

	render() {
		return (
			<Host>
				<smoothly-input-demo-standard />
				<smoothly-input-date-demo />
				<smoothly-input-demo-user-input />
				<div class="inputs">
					<h2>Calendar</h2>
					<smoothly-input-date name="some-date">Calendar</smoothly-input-date>
					<smoothly-input-date-time name="someDateTime" value={isoly.DateTime.now()}>
						DateTime
					</smoothly-input-date-time>
					<h2>Date Range</h2>
					<smoothly-input-date-range
						name="testing"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-01"
						max="2025-01-31"
					/>
					<smoothly-input-date-range
						name="testing"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-10"
						max="2024-12-30">
						<smoothly-input-reset slot="end" size="icon" />
					</smoothly-input-date-range>
					<smoothly-input-date-range
						looks="grid"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-10"
						max="2025-12-30"
						showLabel={false}
						style={{
							"--smoothly-input-border-radius": "0.5rem",
						}}>
						<smoothly-input-clear slot="end" size="icon" />
					</smoothly-input-date-range>
					<h2>Date</h2>
					<smoothly-input-date>Date</smoothly-input-date>
					<smoothly-input-date showLabel={false} value="2021-10-28" max="2021-12-30" min="2021-10-10">
						Date
					</smoothly-input-date>
					<smoothly-input-date value="2021-10-28">
						Date
						<smoothly-input-reset slot="end" size="icon" />
					</smoothly-input-date>
					<smoothly-input-date value="2021-10-28">
						Date
						<smoothly-input-clear slot="end" size="icon" />
					</smoothly-input-date>
					<h2>Select</h2>
					<div class="select-div">
						<smoothly-input-select name="select-dessert" looks="border">
							<label slot="label">Select with clear button</label>
							<smoothly-item value="1">Ice cream</smoothly-item>
							<smoothly-item value="2">Sponge cake</smoothly-item>
							<smoothly-item value="3" disabled>
								Disabled Item
							</smoothly-item>
							<smoothly-item value="4">Cookie</smoothly-item>
							<smoothly-item value="5">Croissant</smoothly-item>
							<smoothly-item value="6">Chocolate fondue</smoothly-item>
							<smoothly-input-clear size="icon" slot="end" />
						</smoothly-input-select>
						<smoothly-input-select multiple name="select-dessert-multiple" looks="border">
							<label slot="label">Select multiple with reset button</label>
							<smoothly-item value="ice cream">Ice cream</smoothly-item>
							<smoothly-item value="sponge cake">Sponge cake</smoothly-item>
							<smoothly-item selected value="cookie">
								Cookie
							</smoothly-item>
							<smoothly-item value="croissant">Croissant</smoothly-item>
							<smoothly-item selected value="chocolate fondue">
								Chocolate fondue
							</smoothly-item>
							<smoothly-input-reset size="icon" slot="end" />
						</smoothly-input-select>
						<smoothly-input-select name="spirit-animals" looks="border" mutable>
							<label slot="label">Select or add new options</label>
							<smoothly-item value="manatee">Manatee</smoothly-item>
							<smoothly-item selected value="cthulu">
								Cthulu
							</smoothly-item>
						</smoothly-input-select>
						<smoothly-input-select name="select-icon" clearable={false} showSelected={false}>
							<smoothly-item value="folder" selected>
								<smoothly-icon size="small" name="folder-outline" />
							</smoothly-item>
							<smoothly-item value="camera">
								<smoothly-icon size="small" name="camera-outline" />
							</smoothly-item>
						</smoothly-input-select>
						<smoothly-input-select ordered menuHeight="7.5items" placeholder="Select..." name="select-month">
							<label slot="label">Alphabet ordered select</label>
							{Array.from({ length: 26 })
								.map((_, i) => String.fromCharCode(i + 65))
								.map(char => (
									<smoothly-item value={char} selected={char == "H"}>
										{char}
									</smoothly-item>
								))}
						</smoothly-input-select>
						<smoothly-input-select
							multiple
							showCheckbox
							menuHeight="7.5items"
							placeholder="Select..."
							name="select-month">
							<label slot="label">Month multiple select</label>
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
						</smoothly-input-select>
						<div class="select-div-row">
							<smoothly-input-select name="select-icon" clearable={false} showSelected={false}>
								<smoothly-item value="folder" selected>
									<smoothly-icon size="small" name="folder-outline" />
								</smoothly-item>
								<smoothly-item value="camera">
									<smoothly-icon size="small" name="camera-outline" />
								</smoothly-item>
								<smoothly-item value="boat">
									<smoothly-icon size="small" name="boat-outline" />
								</smoothly-item>
							</smoothly-input-select>
							<smoothly-input-select name="select-number" clearable={false}>
								{this.numbers.map(number => (
									<smoothly-item value="number" selected={number === 3}>
										{number}
									</smoothly-item>
								))}
							</smoothly-input-select>
							<smoothly-input name="name" value="Sten Qvist">
								Name
							</smoothly-input>
						</div>
					</div>
					<h2>Duration</h2>
					<smoothly-input
						name="duration"
						type="duration"
						placeholder="hh:mm"
						value={this.duration}
						onSmoothlyInput={e => (this.duration = e.detail.duration)}>
						Duration
					</smoothly-input>
					<smoothly-input
						name="duration"
						type="duration"
						value={this.duration}
						placeholder="-hh:mm"
						onSmoothlyInput={e => {
							const duration = e.detail.duration
							this.duration = duration
						}}>
						Duration
					</smoothly-input>
					<h2>Integer with Min/Max</h2>
					<smoothly-input name="days" type="integer" min={0} max={365}>
						Days per year (0-365)
					</smoothly-input>
					<smoothly-input name="hour" type="integer" min={0} max={23}>
						Hours per day (0-23)
					</smoothly-input>
					<smoothly-input name="minute" type="integer" min={0} max={59}>
						Minutes per hour (0-59)
					</smoothly-input>
					<smoothly-input name="minute" type="integer" min={18} max={120}>
						Age (18-120)
					</smoothly-input>
					<h2>Invalid text with warning icon and tooltip</h2>

					<smoothly-input
						copyable
						name="alphanumeric"
						invalid={!/^[a-zA-Z0-9]+$/.test(this.alphanumeric)}
						errorMessage={"Only alphanumeric allowed"}
						value={this.alphanumeric}
						onSmoothlyInput={e => (this.alphanumeric = e.detail.alphanumeric)}>
						Alphanumeric
					</smoothly-input>

					<h2>Identifiers</h2>
					<smoothly-input type="identifier-code">Code</smoothly-input>
					<smoothly-input type="identifier-attribute">Attribute</smoothly-input>
					<smoothly-input type="identifier-snake">Snake</smoothly-input>
					<smoothly-input type="identifier-pascal">Pascal</smoothly-input>
					<smoothly-input type="identifier-camel">Camel</smoothly-input>
					<h2>Input Alternatives</h2>
					<smoothly-input type="text" name="name.last">
						<smoothly-icon name="checkmark-circle" slot="start" />
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.first">
						Last Name
						<smoothly-icon name="checkmark-circle" slot="end" />
					</smoothly-input>
					<smoothly-input type="text" name="name.first" placeholder="Smith">
						Last Name
						<smoothly-icon name="checkmark-circle" slot="end" />
					</smoothly-input>
					<smoothly-input placeholder="test" />
					<smoothly-input-submit slot="submit" fill="solid" onSubmit={(e: Event) => alert(e)} color="success" />
					<h4>Smoothly checkboxes</h4>
					<div class="checkbox-group">
						<smoothly-input-checkbox disabled name="first-checkbox">
							<smoothly-icon name="checkmark-circle" slot="start" size="tiny" />
							First
						</smoothly-input-checkbox>
						<smoothly-input-checkbox name="second-checkbox" checked>
							<smoothly-icon name="checkmark-circle" slot="start" size="tiny" />
							second
							<smoothly-input-clear size="icon" slot="end" />
						</smoothly-input-checkbox>
						<smoothly-input-checkbox name="third-checkbox">3rd</smoothly-input-checkbox>
					</div>
					<h4>Smoothly Radio Buttons</h4>
					<smoothly-input-radio clearable name="radioFirstInput">
						<smoothly-icon name="checkmark-circle" slot="start" />
						<label slot="label">Clearable</label>
						<smoothly-input-radio-item value={"first"}>Label 1</smoothly-input-radio-item>
						<smoothly-input-radio-item selected value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"third"}>Label 3</smoothly-input-radio-item>
						<smoothly-input-clear size="icon" slot="end" />
					</smoothly-input-radio>
					<smoothly-input-radio name="radioSecondInput">
						<label slot="label">Not clearable</label>
						<smoothly-input-radio-item value={"first"}>Label 1</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"second"}>Label 2</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"third"}>Label 3</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"fourth"}>Label 4</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"fifth"}>Label 5</smoothly-input-radio-item>
						<smoothly-input-radio-item value={"sixth"}>Label 6</smoothly-input-radio-item>
					</smoothly-input-radio>
					<smoothly-input-range-demo />
					<smoothly-input-color-demo />
					<smoothly-input-price-demo />
					<smoothly-back-to-top />
				</div>
			</Host>
		)
	}
}
