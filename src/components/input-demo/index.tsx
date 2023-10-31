import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-0-input-demo",
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
						<smoothly-0-input
							type="text"
							name="name"
							readonly={true}
							value={"Readonly"}
							onSmoothlyBlur={() => console.log("smoothly blur")}>
							Readonly
						</smoothly-0-input>
						<smoothly-0-input type="text" name="name.last" onSmoothlyChange={e => console.log("smoothly change event")}>
							Name
						</smoothly-0-input>
						<smoothly-0-input
							type="text"
							name="name.first"
							onSmoothlyChange={e => console.log("smoothly change event")}>
							Name
						</smoothly-0-input>
						<smoothly-0-input-date></smoothly-0-input-date>
						<smoothly-0-input type="date" name="date">
							Date
						</smoothly-0-input>
						<smoothly-0-input type="date-time" name="date-time">
							Date-Time
						</smoothly-0-input>
						<smoothly-0-input type="divisor" name="divisor">
							Divisor
						</smoothly-0-input>
						<smoothly-0-input type="text" name="street" value="street">
							Street
						</smoothly-0-input>
						<smoothly-0-input type="card-number" name="card">
							Card #
						</smoothly-0-input>
						<smoothly-0-input type="card-expires" name="card" style={{ width: "calc(60% - 2px)" }}>
							Expires
						</smoothly-0-input>
						<smoothly-0-input type="card-csc" name="card" style={{ width: "calc(40% - 1px)", borderLeft: "none" }}>
							CVV/CVC
						</smoothly-0-input>
						<h3>Contact</h3>
						<smoothly-0-input type="postal-code" name="zip" style={{ width: "calc(60% - 2px)" }}>
							ZipCode
						</smoothly-0-input>
						<smoothly-0-input type="text" name="testing">
							Texttest
						</smoothly-0-input>
						<smoothly-0-input type="password" name="password">
							Password
						</smoothly-0-input>
						<smoothly-0-input type="email" name="email">
							Email
						</smoothly-0-input>
						<smoothly-0-input type="price" currency="SEK" name="price">
							Price
						</smoothly-0-input>
						<smoothly-0-input type="percent" name="percent">
							Percent
						</smoothly-0-input>
						<smoothly-0-input type="phone" name="phone">
							Phone
						</smoothly-0-input>
						<smoothly-0-input-date name="some-date">Calendar</smoothly-0-input-date>
						<smoothly-0-input-date name="some-date" color="tertiary">
							Calendar (chosen color)
						</smoothly-0-input-date>
						<smoothly-0-input-date name="some-date" flexible={true}>
							Calendar (no min-width)
						</smoothly-0-input-date>
					</fieldset>
					<fieldset>
						<h2>Smoothly Radio</h2>
						<h3>Deselectable Radio List with button</h3>
						<smoothly-0-radio-button deselectable decoration="button">
							<smoothly-0-radio-button-item value={{ some: "content", yes: "sir" }} color="primary" iconColor="medium">
								<span>Option 1</span>
								<span slot="expansion">Some description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "thing", yes: "miss" }} iconColor="light">
								<span>Option 2</span>
								<span slot="expansion">Some other description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "one", yes: "kid" }} iconColor="danger">
								<span>Option 3</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "some", yes: "thing" }} disabled={true}>
								<span>Option 4 (Disabled)</span>
							</smoothly-0-radio-button-item>
						</smoothly-0-radio-button>
						<h3>Radio List with button</h3>
						<smoothly-0-radio-button decoration="button">
							<smoothly-0-radio-button-item value={{ some: "content", yes: "sir" }} color="warning">
								<span>Option 1</span>
								<span slot="expansion">Some description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "thing", yes: "miss" }}>
								<span>Option 2</span>
								<span slot="expansion">Some other description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "one", yes: "kid" }}>
								<span>Option 3</span>
							</smoothly-0-radio-button-item>
						</smoothly-0-radio-button>
						<h3>
							Radio List <b>without button</b>
						</h3>
						<smoothly-0-radio-button>
							<smoothly-0-radio-button-item value={{ some: "content", yes: "sir" }} selected color="light">
								<span>Option 1</span>
								<span slot="expansion">Some description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "thing", yes: "miss" }} color="light">
								<span>Option 2</span>
								<span slot="expansion">Some other description.</span>
							</smoothly-0-radio-button-item>
							<smoothly-0-radio-button-item value={{ some: "one", yes: "kid" }} color="light">
								<span>Option 3</span>
							</smoothly-0-radio-button-item>
						</smoothly-0-radio-button>
						<smoothly-0-radio name="option" value="1">
							option 1
						</smoothly-0-radio>
						<smoothly-0-radio name="option" value="2" checked>
							option 2
						</smoothly-0-radio>
						<smoothly-0-radio name="option" value="3">
							option 3
						</smoothly-0-radio>
					</fieldset>
					<fieldset>
						<h2>Smoothly Accordion</h2>
						<smoothly-0-accordion>
							<smoothly-0-accordion-item name="A" open>
								<smoothly-0-radio name="a" value="1">
									a 1
								</smoothly-0-radio>
								<smoothly-0-radio name="a" value="2" checked>
									a 2
								</smoothly-0-radio>
								<smoothly-0-radio name="a" value="3">
									a 3
								</smoothly-0-radio>
							</smoothly-0-accordion-item>
							<smoothly-0-accordion-item name="B">
								<smoothly-0-radio name="b" value="1">
									b 1
								</smoothly-0-radio>
								<smoothly-0-radio name="b" value="2">
									b 2
								</smoothly-0-radio>
								<smoothly-0-radio name="b" value="3">
									b 3
								</smoothly-0-radio>
							</smoothly-0-accordion-item>
						</smoothly-0-accordion>
					</fieldset>
					<fieldset>
						<h2>Smoothly checkbox</h2>
						<smoothly-0-checkbox selectAll={true} intermediate={true}></smoothly-0-checkbox>
						<smoothly-0-checkbox></smoothly-0-checkbox>
						<smoothly-0-checkbox disabled={true}></smoothly-0-checkbox>
					</fieldset>
					<fieldset>
						<h2>Smoothly addresses</h2>
						<smoothly-0-address-display value='{ "countryCode": "SE", "street": "Korkstigen 2", "zipCode": "654 31", "city": "Fejksala" }'></smoothly-0-address-display>
						<smoothly-0-address
							editable={false}
							value='{ "countryCode": "SE", "street": "Stigvägen 34", "zipCode": "123 45", "city": "Hobbiton" }'></smoothly-0-address>
						<smoothly-0-addresses
							allowed="billing delivery visit"
							editable={true}
							value='{ "billing": { "countryCode": "SE", "street": "Rundslingan 3", "zipCode": "987 65", "city": "Klotby" }, "visit": { "countryCode": "SE", "street": "Gångbanan 34", "zipCode": "543 21", "city": "Traskträsk" } }'></smoothly-0-addresses>
					</fieldset>
				</main>
				<footer>
					<smoothly-0-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success">
						Submit
					</smoothly-0-submit>
					<smoothly-0-submit
						disabled={true}
						expand="block"
						onClick={e => console.log(e)}
						onSubmit={(e: Event) => alert(e)}
						color="success">
						Submit
					</smoothly-0-submit>
					<smoothly-0-trigger expand="block" color="success" onClick={(e: UIEvent) => console.log(e.detail)}>
						Trigger
					</smoothly-0-trigger>
				</footer>
			</form>,
			<smoothly-0-backtotop></smoothly-0-backtotop>,
		]
	}
}
