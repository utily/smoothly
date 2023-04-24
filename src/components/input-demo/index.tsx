import { Component, h } from "@stencil/core"
import { Notice } from "../../model"
@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	render() {
		return [
			<h2>Border</h2>,
			<smoothly-form looks="border">
				<smoothly-input type="email" name="email">
					Email
				</smoothly-input>
				<smoothly-input type="password" name="password">
					Password
				</smoothly-input>
				<smoothly-submit onSubmit={(e: Event) => alert(e)} color="success" fill="solid">
					Send
				</smoothly-submit>
			</smoothly-form>,
			<h2>Grid</h2>,
			<h4>Contact</h4>,
			<smoothly-form looks="grid" method="GET" action="https://webhook.site/85bb78f6-b450-4a74-81ac-d7cac6e94bbe">
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
			</smoothly-form>,
			<h4>Card</h4>,
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
			</smoothly-form>,
			<h4>Contact</h4>,
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
			</smoothly-form>,
			<h4>Random</h4>,
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
			</smoothly-form>,
			<h2>Line</h2>,
			<smoothly-form looks="line">
				<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
					First Name
				</smoothly-input>
				<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
					Last Name
				</smoothly-input>
				<smoothly-submit slot="submit" fill="solid" onSubmit={(e: Event) => alert(e)} color="success">
					Send
				</smoothly-submit>
			</smoothly-form>,
			<h2>Input Alternatives</h2>,
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
			</smoothly-form>,
			<h4>Smoothly checkboxes</h4>,
			<smoothly-form>
				<div>
					<smoothly-checkbox>
						Check me
						<div slot="expansion">Some context</div>
					</smoothly-checkbox>
					<smoothly-checkbox>Label</smoothly-checkbox>
					<smoothly-checkbox disabled={true} />
				</div>
			</smoothly-form>,
			<h4>Smoothly Radio Buttons</h4>,
			<smoothly-form>
				<smoothly-radio-button deselectable decoration="button">
					<smoothly-radio-button-item value={{ some: "content", yes: "sir" }}>
						Option 1<div slot="expansion">Some description.</div>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }}>
						Option 2<div slot="expansion">Some other description.</div>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "one", yes: "kid" }}>
						Option 3<div slot="expansion">Some third description.</div>
					</smoothly-radio-button-item>
				</smoothly-radio-button>
				<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Radio List without button 1</h4>,
			<smoothly-form>
				<smoothly-radio-button>
					<smoothly-radio-button-item value={{ some: "content", yes: "sir" }} selected color="light">
						<span>Option 1</span>
						<span slot="expansion">Some description.</span>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }} color="light">
						<span>Option 2</span>
						<span slot="expansion">Some other description.</span>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "one", yes: "kid" }} color="light">
						<span>Option 3</span>
						<span slot="expansion">Some third description.</span>
					</smoothly-radio-button-item>
				</smoothly-radio-button>
				<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Radio List without button 2</h4>,
			<smoothly-form>
				<smoothly-radio name="option" value="1" style={{ width: "100%" }}>
					option 1
				</smoothly-radio>
				<smoothly-radio name="option" value="2" checked style={{ width: "100%" }}>
					option 2
				</smoothly-radio>
				<smoothly-radio name="option" value="3" style={{ width: "100%" }}>
					option 3
				</smoothly-radio>
			</smoothly-form>,
			<h4>Smoothly Accordion</h4>,
			<smoothly-form>
				<smoothly-accordion>
					<smoothly-accordion-item name="A" open>
						<smoothly-radio name="a" value="1">
							a 1
						</smoothly-radio>
						<smoothly-radio name="a" value="2" checked>
							a 2
						</smoothly-radio>
						<smoothly-radio name="a" value="3">
							a 3
						</smoothly-radio>
					</smoothly-accordion-item>
					<smoothly-accordion-item name="B">
						<smoothly-radio name="b" value="1">
							b 1
						</smoothly-radio>
						<smoothly-radio name="b" value="2">
							b 2
						</smoothly-radio>
						<smoothly-radio name="b" value="3">
							b 3
						</smoothly-radio>
					</smoothly-accordion-item>
				</smoothly-accordion>
				<smoothly-submit slot="submit" color="success" fill="solid" size="icon">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Smoothly picker</h4>,
			<smoothly-form
				onSmoothlyFormSubmit={e => console.log("submitted", e.detail)}
				style={{ "max-width": "50rem" }}
				looks="line">
				<smoothly-input name="purpose" type="text">
					Purpose
				</smoothly-input>
				<smoothly-picker
					multiple
					mutable
					label="Emails"
					name="emails"
					validator={value =>
						value.match(/^.+@.+/) ? true : { result: false, notice: Notice.failed("That is not an email") }
					}>
					<smoothly-picker-option value={"james@rocket.com"}>james@rocket.com</smoothly-picker-option>
					<smoothly-picker-option selected value={"jessie@rocket.com"}>
						jessie@rocket.com
					</smoothly-picker-option>
					<smoothly-picker-option value={"giovanni@rocket.com"}>giovanni@rocket.com</smoothly-picker-option>
				</smoothly-picker>
				<smoothly-submit slot="submit">Submit</smoothly-submit>
				<smoothly-picker label="Shape" name="shape">
					<smoothly-picker-option name="Circle" value={"circle"} labeled>
						<smoothly-icon name="ellipse-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option name="Cube" value={"cube"} labeled>
						<smoothly-icon name="cube-outline" />
					</smoothly-picker-option>
					<smoothly-picker-option name="Square" value={"square"} selected labeled>
						<smoothly-icon name="square-outline" />
					</smoothly-picker-option>
				</smoothly-picker>
			</smoothly-form>,
			<smoothly-backtotop></smoothly-backtotop>,
		]
	}
}
