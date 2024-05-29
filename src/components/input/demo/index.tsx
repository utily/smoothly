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
				<h2>Controlled form</h2>
				<smoothly-input-demo-controlled-form />
				<h2>Create form defaulting type</h2>
				<smoothly-form looks={"line"} action={"https://api.toiletapi.com/6b12fd2f-e896-46f9-b38f-25cf42cee4b4"}>
					<smoothly-input type={"text"} name={"name"}>
						Name
					</smoothly-input>
					<smoothly-input-reset slot={"reset"} type={"form"} size={"icon"} color={"warning"} fill={"default"} />
					<smoothly-input-submit slot={"submit"} size={"icon"} color={"success"} />
				</smoothly-form>
				<h2>Select</h2>
				<div class="select-div">
					<smoothly-input-select name="select-dessert" looks="border" onSmoothlyInput={e => console.log(e.detail)}>
						<label slot="label">Select with reset button</label>
						<smoothly-item value="1">Ice cream</smoothly-item>
						<smoothly-item value="2">Sponge cake</smoothly-item>
						<smoothly-item value="3">Cookie</smoothly-item>
						<smoothly-item value="4">Croissant</smoothly-item>
						<smoothly-item value="5">Chocolate fondue</smoothly-item>
						<smoothly-input-reset size="icon" slot="end">
							<smoothly-icon name="refresh-outline" />
						</smoothly-input-reset>
					</smoothly-input-select>
					<smoothly-input-select
						multiple
						name="select-dessert-multiple"
						looks="border"
						onSmoothlyInput={e => console.log(e.detail)}>
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
						<smoothly-input-reset size="icon" slot="end">
							<smoothly-icon name="refresh-outline" />
						</smoothly-input-reset>
					</smoothly-input-select>
					<smoothly-input-select
						name="select-icon"
						clearable={false}
						showSelected={false}
						onSmoothlyInput={e => console.log("Form Readonly", e.detail)}>
						<smoothly-item value="folder" selected>
							<smoothly-icon size="small" name="folder-outline" />
						</smoothly-item>
						<smoothly-item value="camera">
							<smoothly-icon size="small" name="camera-outline" />
						</smoothly-item>
					</smoothly-input-select>
				</div>

				<h2>Delayed</h2>
				<smoothly-input name="Delayed" delay={2}>
					Delayed
				</smoothly-input>
				<h2>Editable form and Input with Clear and Reset - Readonly</h2>
				<smoothly-form looks="grid" readonly action="https://api.toiletapi.com/6b12fd2f-e896-46f9-b38f-25cf42cee4b4">
					<smoothly-input readonly name="First Name" value="John">
						First name
					</smoothly-input>
					<smoothly-input name="Last name" value="Doe">
						Last name
						<smoothly-input-clear size="icon" slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
					</smoothly-input>
					<smoothly-input type="phone" name="Phone" value={"777888999"}>
						Phone
						<smoothly-input-reset size="icon" slot="end">
							<smoothly-icon name="refresh-outline" />
						</smoothly-input-reset>
					</smoothly-input>
					<smoothly-input-radio clearable name="radioFirstInput">
						<p slot="label">Clearable</p>
						<smoothly-input-radio-item slot="options" value={"first"}>
							Label 1
						</smoothly-input-radio-item>
						<smoothly-input-radio-item selected slot="options" value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"third"}>
							Label 3
						</smoothly-input-radio-item>
					</smoothly-input-radio>
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
					</smoothly-input-select>
					<smoothly-input-select name="select-icon" clearable={false} showSelected={false}>
						<smoothly-item value="folder" selected>
							<smoothly-icon size="small" name="folder-outline" />
						</smoothly-item>
						<smoothly-item value="camera">
							<smoothly-icon size="small" name="camera-outline" />
						</smoothly-item>
					</smoothly-input-select>
					<smoothly-input-checkbox name="checkbox">Check the box</smoothly-input-checkbox>
					<smoothly-input-checkbox name="checkbox2" checked>
						Check the box 2
					</smoothly-input-checkbox>
					<smoothly-input-range step={1} name="range3" value={20000}>
						Select
					</smoothly-input-range>
					<smoothly-picker multiple name="animals">
						<span slot="label">Animals</span>
						<span slot="search">Search</span>
						<smoothly-picker-option selected value={"cat"}>
							Cat
						</smoothly-picker-option>
						<smoothly-picker-option value={"dog"}>Dog</smoothly-picker-option>
						<smoothly-picker-option value={"fish"}>Fish</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-input-edit fill="default" type="button" color="tertiary" slot="edit" size="icon" shape="rounded" />
					<smoothly-input-reset fill="default" type="form" color="warning" slot="reset" size="icon" shape="rounded" />
					<smoothly-input-submit delete slot="clear" color="danger" size="icon" shape="rounded" />
					<smoothly-input-submit fill="default" type="button" color="success" slot="submit" size="icon" shape="rounded">
						<smoothly-icon name="checkmark-outline" fill="solid" size="tiny" />
					</smoothly-input-submit>
				</smoothly-form>
				<h2>Editable form and Input with Clear and Reset - Editable</h2>
				<smoothly-form
					looks="grid"
					type="create"
					action="https://api.toiletapi.com/upload/6b12fd2f-e896-46f9-b38f-25cf42cee4b4">
					<smoothly-input readonly name="First Name" value="John">
						First name
					</smoothly-input>
					<smoothly-input name="Last name" value="Doe">
						Last name
						<smoothly-input-clear size="icon" slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
					</smoothly-input>
					<smoothly-input type="phone" name="Phone" value={"777888999"}>
						Phone
						<smoothly-input-reset size="icon" slot="end">
							<smoothly-icon name="refresh-outline" />
						</smoothly-input-reset>
					</smoothly-input>
					<smoothly-input-radio clearable name="radioFirstInput">
						<p slot="label">Clearable</p>
						<smoothly-input-radio-item slot="options" value={"first"}>
							Label 1
						</smoothly-input-radio-item>
						<smoothly-input-radio-item selected slot="options" value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"third"}>
							Label 3
						</smoothly-input-radio-item>
					</smoothly-input-radio>
					<smoothly-input-select multiple menuHeight="7.5items" placeholder="Select..." name="select-month">
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
					<smoothly-input-select name="select-icon" clearable={false} showSelected={false}>
						<smoothly-item value="folder" selected>
							<smoothly-icon size="small" name="folder-outline" />
						</smoothly-item>
						<smoothly-item value="camera">
							<smoothly-icon size="small" name="camera-outline" />
						</smoothly-item>
					</smoothly-input-select>
					<smoothly-input-checkbox name="checkbox">Check the box</smoothly-input-checkbox>
					<smoothly-input-checkbox name="checkbox2" checked>
						Check the box 2
					</smoothly-input-checkbox>
					<smoothly-input-range step={1} name="range3" value={20000}>
						Select
					</smoothly-input-range>
					<smoothly-picker multiple name="animals">
						<span slot="label">Animals</span>
						<span slot="search">Search</span>
						<smoothly-picker-option selected value={"cat"}>
							Cat
						</smoothly-picker-option>
						<smoothly-picker-option value={"dog"}>Dog</smoothly-picker-option>
						<smoothly-picker-option value={"fish"}>Fish</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-input-edit fill="default" type="button" color="tertiary" slot="edit" size="icon" shape="rounded" />
					<smoothly-input-reset fill="default" type="form" color="warning" slot="reset" size="icon" shape="rounded" />
					<smoothly-input-submit delete slot="clear" color="danger" size="icon" shape="rounded" />
					<smoothly-input-submit fill="default" type="button" color="success" slot="submit" size="icon" shape="rounded">
						<smoothly-icon name="checkmark-outline" fill="solid" size="tiny" />
					</smoothly-input-submit>
				</smoothly-form>
				<h2>Color</h2>
				<smoothly-form looks="border">
					<smoothly-input-color name="color"></smoothly-input-color>
				</smoothly-form>
				<h2>Range</h2>
				<smoothly-form looks="border">
					<smoothly-input-range step={1} name="range" outputSide="right">
						Select and so
					</smoothly-input-range>
					<smoothly-input-range step={1} name="range2">
						Select with really really long label
						<smoothly-icon name="checkmark-circle" slot="start" />
						<smoothly-input-clear size="icon" slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
					</smoothly-input-range>
					<smoothly-input-range step={1} name="range3">
						Select
					</smoothly-input-range>
				</smoothly-form>
				<h2>Duration</h2>
				<smoothly-form looks="border">
					<smoothly-input
						name="duration"
						type="duration"
						placeholder="hh:mm"
						value={this.duration}
						onSmoothlyInput={e => {
							const duration = e.detail.duration
							console.log("event duration", duration)
							this.duration = duration
						}}>
						Duration
					</smoothly-input>
					<smoothly-input
						name="duration"
						type="duration"
						value={this.duration}
						placeholder="-hh:mm"
						onSmoothlyInput={e => {
							const duration = e.detail.duration
							console.log("event duration", duration)
							this.duration = duration
						}}>
						Duration
					</smoothly-input>
				</smoothly-form>
				<h2>Transparent inputs</h2>
				<smoothly-form looks={"transparent"}>
					<smoothly-input-file name={"file"}>
						<span slot={"label"}>File</span>
						<smoothly-icon slot={"button"} name={"folder-open-outline"} size={"small"} />
					</smoothly-input-file>
					<smoothly-input type={"duration"} looks={"transparent"} placeholder={"h:mm"}>
						Input
					</smoothly-input>
					<smoothly-picker>
						<span slot={"label"}>Picker</span>
						<span slot={"search"}>Search</span>
						<smoothly-picker-option value={"circle"}>
							<smoothly-icon name={"ellipse-outline"} />
						</smoothly-picker-option>
						<smoothly-picker-option value={"square"}>
							<smoothly-icon name={"square-outline"} />
						</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-input-date>Date</smoothly-input-date>
					<smoothly-input-date-range>Date Range</smoothly-input-date-range>
					<smoothly-input-select name={"transport"}>
						<smoothly-item value={"plane"}>
							<smoothly-icon name={"airplane-outline"} />
						</smoothly-item>
						<smoothly-item value={"car"}>
							<smoothly-icon name={"car-outline"} />
						</smoothly-item>
						<smoothly-item value={"bus"} selected>
							<smoothly-icon name={"bus-outline"} />
						</smoothly-item>
					</smoothly-input-select>
				</smoothly-form>

				<h2>Submit</h2>
				<smoothly-form looks="border">
					<smoothly-input type="email" name="email">
						Email
					</smoothly-input>
					<smoothly-input type="password" name="password">
						Password
					</smoothly-input>
					<smoothly-input-clear fill="default" type="form" color="danger" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>
				<h2>Prices</h2>
				<smoothly-form looks="border">
					<smoothly-input type="price" name="no">
						No currency
					</smoothly-input>
					<smoothly-input type="price" name="crowns" currency="SEK">
						SEK
					</smoothly-input>
					<smoothly-input type="price" name="usDollar" currency="USD">
						USD
					</smoothly-input>
					<smoothly-input type="price" name="pounds" currency="GBP">
						GBP
					</smoothly-input>
					<smoothly-input type="price" name="peso" currency="UYW">
						UYW
					</smoothly-input>
					<smoothly-input type="price" name="iceland" currency="ISK">
						ISK
					</smoothly-input>
					<smoothly-input type="price" name="Palladium" currency="XPD">
						{"XPD (Palladium)"}
					</smoothly-input>
					<smoothly-input-clear fill="default" type="form" color="danger" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>

				<h4>Clear</h4>
				<smoothly-form looks="border">
					<smoothly-input name="First Name" value="John">
						First name
					</smoothly-input>
					<smoothly-input name="Last name" value="Doe">
						Last name
						<smoothly-input-clear size="icon" slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
					</smoothly-input>
					<smoothly-input type="phone" name="Phone">
						Phone
						<smoothly-input-clear slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
					</smoothly-input>
					<smoothly-input-clear fill="default" type="form" color="danger" slot="submit">
						Clear
					</smoothly-input-clear>
				</smoothly-form>
				<h2>Identifier</h2>
				<smoothly-form looks="border">
					<smoothly-input type="identifier-code">Code</smoothly-input>
					<smoothly-input type="identifier-attribute">Attribute</smoothly-input>
					<smoothly-input type="identifier-snake">Snake</smoothly-input>
					<smoothly-input type="identifier-pascal">Pascal</smoothly-input>
					<smoothly-input type="identifier-camel">Camel</smoothly-input>
				</smoothly-form>
				<h2>Border</h2>
				<smoothly-form looks="border">
					<smoothly-input type="email" name="email">
						Email
					</smoothly-input>
					<smoothly-input type="password" name="password">
						Password
					</smoothly-input>
					<smoothly-submit slot="submit" onSubmit={(e: Event) => alert(e)} color="success" fill="solid">
						Send
					</smoothly-submit>
				</smoothly-form>
				<h2>Grid</h2>
				<h4>Contact</h4>
				<smoothly-form looks="grid" action="https://webhook.site/85bb78f6-b450-4a74-81ac-d7cac6e94bbe">
					<smoothly-input type="text" name="name.last">
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.first">
						Last Name
					</smoothly-input>
					<smoothly-input type="text" name="street" value="Torgny Segerstedts Allé 87">
						Street
					</smoothly-input>
					<smoothly-input type="postal-code" name="zip">
						ZipCode
					</smoothly-input>
					<smoothly-input type="text" name="city">
						City
					</smoothly-input>
					<smoothly-input type="text" name="countryCode">
						CountryCode
					</smoothly-input>
					<smoothly-input type="phone" name="phone">
						Phone
					</smoothly-input>
					<smoothly-input type="email" name="email">
						Email
					</smoothly-input>
					<smoothly-submit slot="submit" color="success" fill="solid">
						<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
						Submit
					</smoothly-submit>
				</smoothly-form>
				<h4>Card</h4>
				<smoothly-form looks="grid" onSmoothlyFormSubmit={(e: CustomEvent) => alert(JSON.stringify(e.detail))}>
					<smoothly-input type="card-number" name="card">
						Card #
					</smoothly-input>
					<smoothly-submit size="icon" slot="submit" color="success" fill="solid">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
					</smoothly-submit>
					<smoothly-input type="card-expires" name="expires">
						Expires
					</smoothly-input>
					<smoothly-input type="card-csc" name="csc">
						CVV/CVC
					</smoothly-input>
					<smoothly-input type="text" name="name.first">
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.last">
						Last Name
					</smoothly-input>
				</smoothly-form>
				<h4>Contact</h4>
				<smoothly-form looks="grid">
					<smoothly-input type="email" name="email">
						Email
					</smoothly-input>
					<smoothly-input type="password" name="password">
						Password
					</smoothly-input>
					<smoothly-input type="price" currency="SEK" name="price">
						Price
					</smoothly-input>
					<smoothly-input type="percent" name="percent">
						Percent
					</smoothly-input>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle"></smoothly-icon>
					</smoothly-submit>
				</smoothly-form>
				<h4>Random</h4>
				<smoothly-form looks="grid">
					<smoothly-input
						type="text"
						name="name"
						readonly={true}
						value={"Readonly"}
						onSmoothlyBlur={() => console.log("smoothly blur")}
						style={{ width: "100%" }}>
						Readonly
					</smoothly-input>
					<smoothly-input type="text" name="testing">
						TextTest
					</smoothly-input>
					<smoothly-input type="date-time" name="date-time">
						Date-Time
					</smoothly-input>
					<smoothly-input type="divisor" name="divisor">
						Divisor
					</smoothly-input>
					<smoothly-input type="date" name="date">
						Date
					</smoothly-input>
					<smoothly-input-date name="some-date">Calendar</smoothly-input-date>
				</smoothly-form>
				<h2>Line</h2>
				<smoothly-form looks="line" action="https://api.toiletapi.com/upload/6b12fd2f-e896-46f9-b38f-25cf42cee4b4">
					<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
						Last Name
					</smoothly-input>
					<smoothly-submit slot="submit" fill="solid" onSubmit={(e: Event) => alert(e)} color="success">
						Send
					</smoothly-submit>
				</smoothly-form>
				<h2>Input Alternatives</h2>
				<smoothly-form looks="border">
					<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
						<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
						First Name
					</smoothly-input>
					<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
						Last Name
						<smoothly-icon name="checkmark-circle" slot="end"></smoothly-icon>
					</smoothly-input>
					<smoothly-input
						type="text"
						name="name.first"
						placeholder="Smith"
						onSmoothlyChange={e => console.log("smoothly change event")}>
						Last Name
						<smoothly-icon name="checkmark-circle" slot="end"></smoothly-icon>
					</smoothly-input>
					<smoothly-input placeholder="test"></smoothly-input>
					<smoothly-submit slot="submit" fill="solid" onSubmit={(e: Event) => alert(e)} color="success">
						Send
					</smoothly-submit>
				</smoothly-form>
				<h4>Smoothly checkboxes</h4>
				<smoothly-form>
					<div class="checkbox-group">
						<smoothly-input-checkbox disabled name="first-checkbox">
							<smoothly-icon name="checkmark-circle" slot="start" size="tiny" />
							First
						</smoothly-input-checkbox>
						<smoothly-input-checkbox name="second-checkbox" checked>
							<smoothly-icon name="checkmark-circle" slot="start" size="tiny" />
							second
							<smoothly-input-clear size="icon" slot="end">
								<smoothly-icon name="close" />
							</smoothly-input-clear>
						</smoothly-input-checkbox>
						<smoothly-input-checkbox name="third-checkbox">3rd</smoothly-input-checkbox>
					</div>
				</smoothly-form>
				<h4>Smoothly Radio Buttons</h4>
				<smoothly-form onSmoothlyFormSubmit={e => console.log(e.detail)} looks="border">
					<smoothly-input-radio clearable name="radioFirstInput">
						<smoothly-icon name="checkmark-circle" slot="start" />
						<smoothly-input-clear size="icon" slot="end">
							<smoothly-icon name="close" />
						</smoothly-input-clear>
						<p slot="label">Clearable</p>
						<smoothly-input-radio-item slot="options" value={"first"}>
							Label 1
						</smoothly-input-radio-item>
						<smoothly-input-radio-item selected slot="options" value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"third"}>
							Label 3
						</smoothly-input-radio-item>
					</smoothly-input-radio>
					<smoothly-input-radio name="radioSecondInput">
						<p slot="label">Not clearable</p>
						<smoothly-input-radio-item slot="options" value={"first"}>
							Label 1
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"second"}>
							Label 2
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"third"}>
							Label 3
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"fourth"}>
							Label 4
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"fifth"}>
							Label 5
						</smoothly-input-radio-item>
						<smoothly-input-radio-item slot="options" value={"sixth"}>
							Label 6
						</smoothly-input-radio-item>
					</smoothly-input-radio>
				</smoothly-form>
				<h4>Smoothly Picker</h4>
				<smoothly-picker-demo />
				<smoothly-back-to-top />
				<h4>Smoothly Date</h4>
				<smoothly-input-date>Date</smoothly-input-date>
				<smoothly-input-date showLabel={false} value="2021-10-28" max="2021-12-30" min="2021-10-10">
					Date
				</smoothly-input-date>
				<smoothly-form looks="grid" onSmoothlyFormSubmit={e => console.log(e.detail)}>
					<smoothly-input-date-range
						name="testing"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-10"
						max="2024-12-30"></smoothly-input-date-range>
					<smoothly-input-clear type="form" color="danger" fill="solid" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-submit slot="submit">submit daterange</smoothly-submit>
				</smoothly-form>

				<smoothly-input-date-range
					looks="grid"
					start={isoly.Date.now()}
					end={isoly.Date.nextMonth(isoly.Date.now())}
					min="2021-10-10"
					max="2025-12-30"
					showLabel={false}
					style={{
						"--border-radius": "4px",
						"--padding": "0 0.75em",
						"--input-width": "12ch",
					}}></smoothly-input-date-range>

				<smoothly-form looks="grid" onSmoothlyFormSubmit={e => console.log("Submitted", e.detail)}>
					<smoothly-input type="text" name="text">
						Text
					</smoothly-input>
					<div>
						<smoothly-input-file placeholder="Select or drag a file here" name="file">
							<span slot="label">Testing file input</span>
							<smoothly-icon slot="button" name="folder-outline" />
						</smoothly-input-file>
					</div>
					<smoothly-input-file camera="back" placeholder="Capture a photo" name="image">
						<span slot="label">Testing camera photo</span>
						<smoothly-icon slot="button" name="camera-outline" />
					</smoothly-input-file>
					<smoothly-input-clear type="form" color="danger" fill="solid" slot="clear">
						Clear
					</smoothly-input-clear>
					<smoothly-submit slot="submit">Submit</smoothly-submit>
				</smoothly-form>
				<br />
				<smoothly-form looks="line" onSmoothlyFormSubmit={e => console.log("form input", e.detail)}>
					<smoothly-input name="text">Input</smoothly-input>
					<smoothly-input-file camera="back" placeholder="Capture a photo" name="image">
						<span slot="label">Testing camera photo</span>
						<smoothly-icon slot="button" name="camera-outline" />
					</smoothly-input-file>
					<smoothly-picker name="picker">
						<span slot="label">Shape</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={"circle"}>
							<span slot="label">Circle</span>
							<smoothly-icon size="tiny" name="ellipse-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"cube"}>
							<span slot={"label"}>Cube</span>
							<smoothly-icon size="tiny" name="cube-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"square"} selected>
							<span slot={"label"}>Square</span>
							<smoothly-icon size="tiny" name="square-outline" />
						</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-input-select name="select" placeholder="Select..." menuHeight="7.5items">
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
					<smoothly-input-date-range
						name="date-range"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-10"
						max="2025-12-30"
						showLabel={false}
						style={{
							"--border-radius": "4px",
							"--padding": "0 0.75em",
							"--input-width": "12ch",
						}}
					/>
					<smoothly-input-date name="date" value="2021-10-28" max="2021-12-30" min="2021-10-10">
						Date
					</smoothly-input-date>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle" fill="solid" size="medium" />
					</smoothly-submit>
				</smoothly-form>
				<h4>Form with spinner showcase</h4>
				<smoothly-form looks="line" onSmoothlyFormSubmit={e => console.log("form input", e.detail)}>
					<smoothly-input name="text">Input</smoothly-input>
					<smoothly-input-file camera="back" placeholder="Capture a photo" name="image">
						<span slot="label">Testing camera photo</span>
						<smoothly-icon slot="button" name="camera-outline" />
					</smoothly-input-file>
					<smoothly-picker name="picker">
						<span slot="label">Shape</span>
						<span slot="search">Search</span>
						<smoothly-picker-option value={"circle"}>
							<span slot="label">Circle</span>
							<smoothly-icon size="tiny" name="ellipse-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"cube"}>
							<span slot={"label"}>Cube</span>
							<smoothly-icon size="tiny" name="cube-outline" />
						</smoothly-picker-option>
						<smoothly-picker-option value={"square"} selected>
							<span slot={"label"}>Square</span>
							<smoothly-icon size="tiny" name="square-outline" />
						</smoothly-picker-option>
					</smoothly-picker>
					<smoothly-input-select name="select" placeholder="Select...">
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
					<smoothly-input-date-range
						name="date-range"
						start={isoly.Date.now()}
						end={isoly.Date.nextMonth(isoly.Date.now())}
						min="2021-10-10"
						max="2025-12-30"
						showLabel={false}
						style={{
							"--border-radius": "4px",
							"--padding": "0 0.75em",
							"--input-width": "12ch",
						}}
					/>
					<smoothly-input-date name="date" value="2021-10-28" max="2021-12-30" min="2021-10-10">
						Date
					</smoothly-input-date>
					<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
						<smoothly-icon name="checkmark-circle" fill="solid" size="medium" />
					</smoothly-submit>
				</smoothly-form>
			</Host>
		)
	}
}
