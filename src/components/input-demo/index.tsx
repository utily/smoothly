import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	render() {
		return [
			<h4>Border</h4>,
			<smoothly-form looks="border">
				<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
					First Name
				</smoothly-input>
				<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
					Last Name
				</smoothly-input>
				<smoothly-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success" fill="solid">
					Send
				</smoothly-submit>
			</smoothly-form>,
			<h4>Grid</h4>,
			<smoothly-form looks="grid">
				<smoothly-input type="text" name="name.last" style={{ width: "40%" }}>
					First Name
				</smoothly-input>
				<smoothly-input type="text" name="name.first" style={{ width: "40%" }}>
					Last Name
				</smoothly-input>
				<smoothly-input type="text" name="street" value="Torgny Segerstedts Allé 87" style={{ width: "40%" }}>
					Street
				</smoothly-input>
				<smoothly-input type="postal-code" name="zip" style={{ width: "40%" }}>
					ZipCode
				</smoothly-input>
				<smoothly-input type="phone" name="phone" style={{ width: "80%" }}>
					Phone
				</smoothly-input>
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Card</h4>,
			<smoothly-form looks="grid">
				<smoothly-input type="card-number" name="card" style={{ width: "80%" }}>
					Card #
				</smoothly-input>
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
				<smoothly-input type="card-expires" name="card" style={{ width: "40%" }}>
					Expires
				</smoothly-input>
				<smoothly-input type="card-csc" name="card" style={{ width: "40%" }}>
					CVV/CVC
				</smoothly-input>
				<smoothly-input type="date" name="date" style={{ width: "40%" }}>
					Date
				</smoothly-input>
				<smoothly-input type="date-time" name="date-time" style={{ width: "40%" }}>
					Date-Time
				</smoothly-input>
				<smoothly-input-date name="some-date" style={{ width: "40%" }}>
					Calendar
				</smoothly-input-date>
				<smoothly-input type="divisor" name="divisor" style={{ width: "40%" }}>
					Divisor
				</smoothly-input>
			</smoothly-form>,
			<h4>Contact</h4>,
			<smoothly-form looks="grid">
				<smoothly-input type="email" name="email" style={{ width: "40%" }}>
					Email
				</smoothly-input>
				<smoothly-input type="password" name="password" style={{ width: "40%" }}>
					Password
				</smoothly-input>
				<smoothly-input type="price" currency="SEK" name="price" style={{ width: "40%" }}>
					Price
				</smoothly-input>
				<smoothly-input type="percent" name="percent" style={{ width: "40%" }}>
					Percent
				</smoothly-input>
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Text</h4>,
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
				<smoothly-input type="text" name="testing" style={{ width: "40%" }}>
					Texttest
				</smoothly-input>
			</smoothly-form>,
			<h4>Smoothly Radio Buttons</h4>,
			<smoothly-form looks="grid">
				<smoothly-radio-button deselectable decoration="button">
					<smoothly-radio-button-item value={{ some: "content", yes: "sir" }}>
						<span>Option 1</span>
						<span slot="expansion">Some description.</span>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }}>
						<span>Option 2</span>
						<span slot="expansion">Some other description.</span>
					</smoothly-radio-button-item>
					<smoothly-radio-button-item value={{ some: "one", yes: "kid" }}>
						<span>Option 3</span>
						<span slot="expansion">Some third description.</span>
					</smoothly-radio-button-item>
				</smoothly-radio-button>
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Radio List without button 1</h4>,
			<smoothly-form looks="grid">
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
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Radio List without button 2</h4>,
			<smoothly-form looks="grid">
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
			<smoothly-form looks="grid">
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
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Smoothly Accordion</h4>,
			<smoothly-form looks="grid">
				<smoothly-checkbox selectAll={true} intermediate={true} style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox disabled={true} style={{ width: "100%" }}></smoothly-checkbox>
			</smoothly-form>,
			<h4>Line</h4>,
			<smoothly-form looks="line">
				<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
					First Name
				</smoothly-input>
				<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
					Last Name
				</smoothly-input>
				<smoothly-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success">
					Send
				</smoothly-submit>
			</smoothly-form>,
			<form action="done" style={{ position: "relative" }}>
				<main style={{ margin: "2em" }}>
					<fieldset>
						<h2>Smoothly addresses</h2>
						<smoothly-address-display value='{ "countryCode": "SE", "street": "Korkstigen 2", "zipCode": "654 31", "city": "Fejksala" }'></smoothly-address-display>
						<smoothly-address
							editable={false}
							value='{ "countryCode": "SE", "street": "Stigvägen 34", "zipCode": "123 45", "city": "Hobbiton" }'></smoothly-address>
						<smoothly-addresses
							allowed="billing delivery visit"
							editable={true}
							value='{ "billing": { "countryCode": "SE", "street": "Rundslingan 3", "zipCode": "987 65", "city": "Klotby" }, "visit": { "countryCode": "SE", "street": "Gångbanan 34", "zipCode": "543 21", "city": "Traskträsk" } }'></smoothly-addresses>
					</fieldset>
				</main>
				<footer>
					<smoothly-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success">
						Submit
					</smoothly-submit>
					<smoothly-trigger expand="block" color="success" onClick={(e: UIEvent) => console.log(e.detail)}>
						Trigger
					</smoothly-trigger>
				</footer>
			</form>,
			<smoothly-backtotop></smoothly-backtotop>,
		]
	}
}
