import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-input-demo",
})
export class SmoothlyInputDemo {
	render() {
		return [
			<form action="done" style={{ position: "relative" }}>
				<header>
					<h5>Form</h5>
				</header>
				<main>
					<fieldset>
						<h2>Smoothly Input</h2>
						<h3>Card</h3>
						<smoothly-input
							type="text"
							name="name"
							readonly={true}
							value={"Readonly"}
							onSmoothlyBlur={() => console.log("smoothly blur")}>
							Readonly
						</smoothly-input>
						<smoothly-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
							Name
						</smoothly-input>
						<smoothly-input type="text" name="name.first" onSmoothlyChange={e => console.log("smoothly change event")}>
							Name
						</smoothly-input>
						<smoothly-input-date></smoothly-input-date>
						<smoothly-input type="date" name="date">
							Date
						</smoothly-input>
						<smoothly-input type="date-time" name="date-time">
							Date-Time
						</smoothly-input>
						<smoothly-input type="divisor" name="divisor">
							Divisor
						</smoothly-input>
						<smoothly-input type="text" name="street" value="street">
							Street
						</smoothly-input>
						<smoothly-input type="card-number" name="card">
							Card #
						</smoothly-input>
						<smoothly-input type="card-expires" name="card" style={{ width: "calc(60% - 2px)" }}>
							Expires
						</smoothly-input>
						<smoothly-input type="card-csc" name="card" style={{ width: "calc(40% - 1px)", borderLeft: "none" }}>
							CVV/CVC
						</smoothly-input>
						<h3>Contact</h3>
						<smoothly-input type="postal-code" name="zip" style={{ width: "calc(60% - 2px)" }}>
							ZipCode
						</smoothly-input>
						<smoothly-input type="text" name="testing">
							Texttest
						</smoothly-input>
						<smoothly-input type="password" name="password">
							Password
						</smoothly-input>
						<smoothly-input type="email" name="email">
							Email
						</smoothly-input>
						<smoothly-input type="price" currency="SEK" name="price">
							Price
						</smoothly-input>
						<smoothly-input type="percent" name="percent">
							Percent
						</smoothly-input>
						<smoothly-input type="phone" name="phone">
							Phone
						</smoothly-input>
						<smoothly-input-date name="some-date">Calendar</smoothly-input-date>
						<smoothly-input-date name="some-date" color="tertiary">
							Calendar (chosen color)
						</smoothly-input-date>
					</fieldset>
					<fieldset>
						<h2>Smoothly Radio</h2>
						<h3>Deselectable Radio List with button</h3>
						<smoothly-radio-button deselectable decoration="button">
							<smoothly-radio-button-item value={{ some: "content", yes: "sir" }} color="primary">
								<span>Option 1</span>
								<span slot="expansion">Some description.</span>
							</smoothly-radio-button-item>
							<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }}>
								<span>Option 2</span>
								<span slot="expansion">Some other description.</span>
							</smoothly-radio-button-item>
							<smoothly-radio-button-item value={{ some: "one", yes: "kid" }}>
								<span>Option 3</span>
							</smoothly-radio-button-item>
						</smoothly-radio-button>
						<h3>Radio List with button</h3>
						<smoothly-radio-button decoration="button">
							<smoothly-radio-button-item value={{ some: "content", yes: "sir" }} color="warning">
								<span>Option 1</span>
								<span slot="expansion">Some description.</span>
							</smoothly-radio-button-item>
							<smoothly-radio-button-item value={{ some: "thing", yes: "miss" }}>
								<span>Option 2</span>
								<span slot="expansion">Some other description.</span>
							</smoothly-radio-button-item>
							<smoothly-radio-button-item value={{ some: "one", yes: "kid" }}>
								<span>Option 3</span>
							</smoothly-radio-button-item>
						</smoothly-radio-button>
						<h3>
							Radio List <b>without button</b>
						</h3>
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
							</smoothly-radio-button-item>
						</smoothly-radio-button>
						<smoothly-radio name="option" value="1">
							option 1
						</smoothly-radio>
						<smoothly-radio name="option" value="2" checked>
							option 2
						</smoothly-radio>
						<smoothly-radio name="option" value="3">
							option 3
						</smoothly-radio>
					</fieldset>
					<fieldset>
						<h2>Smoothly Accordion</h2>
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
					</fieldset>
					<fieldset>
						<h2>Smoothly checkbox</h2>
						<smoothly-checkbox selectAll={true} intermediate={true}></smoothly-checkbox>
						<smoothly-checkbox></smoothly-checkbox>
						<smoothly-checkbox disabled={true}></smoothly-checkbox>
					</fieldset>
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
