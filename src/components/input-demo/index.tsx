import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
})
export class SmoothlyInputDemo {
	render() {
		return [
			<h2>Buttons</h2>,
			<section>
				<h4>Without color</h4>
				<smoothly-button expand="full">Expand Full</smoothly-button>,
				<smoothly-button expand="block">Expand Block</smoothly-button>,
				<smoothly-button fill="clear">Fill Clear</smoothly-button>,
				<smoothly-button fill="default">Fill Default</smoothly-button>,
				<smoothly-button fill="outline">Fill Outline</smoothly-button>,
				<smoothly-button fill="solid">Fill Solid</smoothly-button>,
				<smoothly-button type="link">type link</smoothly-button>,<h4>With color</h4>
				<smoothly-button color="secondary" fill="clear">
					Color Secondary + Fill Clear
				</smoothly-button>
				,
				<smoothly-button color="secondary" fill="default">
					Color Secondary + Fill Default
				</smoothly-button>
				,
				<smoothly-button color="secondary" fill="outline">
					Color Secondary + Fill Outline
				</smoothly-button>
				,
				<smoothly-button color="secondary" fill="solid">
					Color Secondary + Fill Solid
				</smoothly-button>
				,
				<smoothly-button color="secondary" expand="full">
					Expand Full
				</smoothly-button>
				,
				<smoothly-button color="secondary" expand="block">
					Expand Block
				</smoothly-button>
				,<smoothly-button type="link">type link</smoothly-button>,
				<smoothly-button link="https://google.com">link</smoothly-button>,
				<smoothly-button link="https://google.com" type="link">
					link + type link
				</smoothly-button>
				,<smoothly-button disabled>Disabled</smoothly-button>,
			</section>,
			<h2>Border</h2>,
			<smoothly-form looks="border">
				<smoothly-input type="email" name="email">
					Email
				</smoothly-input>
				<smoothly-input type="password" name="password">
					Password
				</smoothly-input>
				<smoothly-submit expand="block" onSubmit={(e: Event) => alert(e)} color="success" fill="solid">
					Send
				</smoothly-submit>
			</smoothly-form>,
			<h2>Grid</h2>,
			<h4>Contact</h4>,
			<smoothly-form looks="grid">
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
				<smoothly-input type="card-expires" name="card">
					Expires
				</smoothly-input>
				<smoothly-input type="card-csc" name="card">
					CVV/CVC
				</smoothly-input>
				<smoothly-input type="text" name="firstName">
					First Name
				</smoothly-input>
				<smoothly-input type="text" name="name.first">
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
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
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
				<smoothly-input type="text" name="testing" style={{ width: "40%" }}>
					Texttest
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
			<h4>Smoothly Radio Buttons</h4>,
			<smoothly-form>
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
				<smoothly-submit slot="submit" expand="block" color="success" fill="solid">
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
			<h2>Line</h2>,
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
			<h2>Smoothly addresses</h2>,
			<smoothly-form looks="grid" style={{ margin: "2em" }}>
				<smoothly-address
					value={{
						allowed: "Visit",
						countryCode: "SE",
						street: "Korkstigen 2",
						zipCode: "654 32",
						city: "Fejksala",
					}}></smoothly-address>
				<smoothly-address
					editable={true}
					value={{
						allowed: "Billing",
						countryCode: "SE",
						street: "Stigvägen 34",
						zipCode: "123 45",
						city: "Hobbiton",
					}}></smoothly-address>
				<smoothly-addresses
					// allowed="billing delivery visit"
					// editable={true}
					value={[
						{ allowed: "Delivery", countryCode: "SE", street: "Rundslingan 3", zipCode: "987 65", city: "Klotby" },
						{ allowed: "Billing", countryCode: "SE", street: "Gångbanan 34", zipCode: "543 21", city: "Traskträsk" },
					]}></smoothly-addresses>
				<smoothly-submit expand="block" slot="submit" onSubmit={(e: Event) => alert(e)} color="success">
					Submit
				</smoothly-submit>
			</smoothly-form>,
			<smoothly-trigger expand="block" color="success" onClick={(e: UIEvent) => console.log(e.detail)}>
				Trigger
			</smoothly-trigger>,
			<smoothly-backtotop></smoothly-backtotop>,
		]
	}
}
