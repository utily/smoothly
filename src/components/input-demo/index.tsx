import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-input-demo",
})
export class SmoothlyInputDemo {
	render() {
		return (
			<form action="done" style={{ position: "relative" }}>
				<header>
					<h5>Address</h5>
				</header>
				<main>
					<smoothly-input type="text" name="name">
						Name
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
					<smoothly-radio name="option" value="1">
						option 1
					</smoothly-radio>
					<smoothly-radio name="option" value="2" checked>
						option 2
					</smoothly-radio>
					<smoothly-radio name="option" value="3">
						option 3
					</smoothly-radio>
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
					<smoothly-display-amount currency="SEK" amount="1289.5"></smoothly-display-amount>
					<smoothly-display-date-time datetime="2019-01-31T20:01:34"></smoothly-display-date-time>
					<smoothly-checkbox name="order" value="12341231"></smoothly-checkbox>
					<smoothly-address-display value='{ "countryCode": "SE", "street": "Korkstigen 2", "zipCode": "654 31", "city": "Fejksala" }'></smoothly-address-display>
					<smoothly-address
						editable={false}
						value='{ "countryCode": "SE", "street": "Stigvägen 34", "zipCode": "123 45", "city": "Hobbiton" }'></smoothly-address>
					<smoothly-addresses
						allowed="billing delivery visit"
						editable={true}
						value='{ "billing": { "countryCode": "SE", "street": "Rundslingan 3", "zipCode": "987 65", "city": "Klotby" }, "visit": { "countryCode": "SE", "street": "Gångbanan 34", "zipCode": "543 21", "city": "Traskträsk" } }'></smoothly-addresses>
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
				</main>
				<footer>
					<smoothly-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success">
						Submit
					</smoothly-submit>
					<smoothly-trigger expand="block" color="success" onClick={(e: UIEvent) => console.log(e.detail)}>
						Trigger
					</smoothly-trigger>
				</footer>
			</form>
		)
	}
}
