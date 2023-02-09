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
				<h4>Toggle button</h4>
				<smoothly-toggle>
					<smoothly-icon name="card" fill="solid" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<smoothly-toggle>
					<smoothly-icon name="briefcase" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<smoothly-toggle>
					<smoothly-icon name="airplane" slot="icon-slot"></smoothly-icon>
				</smoothly-toggle>
				<h4>Toggle switches</h4>
				<smoothly-toggle-switch disabled={false} size="small"></smoothly-toggle-switch>
				<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
				<smoothly-toggle-switch disabled={false} size="large"></smoothly-toggle-switch>
				<h4>Links with icons</h4>
				<smoothly-button type="link">
					<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
					type link
				</smoothly-button>
				<smoothly-button type="button" color="warning" fill="default">
					<smoothly-icon name="call" slot="start"></smoothly-icon>
					<a href="https://google.com">link</a>
				</smoothly-button>
				<smoothly-button link="https://google.com" type="link">
					<smoothly-icon name="arrow-forward" slot="end"></smoothly-icon>
					link + type link
				</smoothly-button>
				<h4>Size and Color test</h4>
				<smoothly-button color="primary" fill="solid" size="small" shape="rounded">
					Color Primary + Small
				</smoothly-button>
				<smoothly-button color="secondary" fill="solid" shape="rounded">
					Color Secondary + Default
				</smoothly-button>
				<smoothly-button color="warning" fill="solid" size="large">
					Color Warning + Large
				</smoothly-button>
				<smoothly-button color="danger" fill="solid" size="small" shape="rounded">
					Color Danger + Small
				</smoothly-button>
				<smoothly-button color="success" fill="solid" size="small" shape="rounded">
					Color Success + Small
				</smoothly-button>
				<smoothly-button color="tertiary" fill="solid" size="small" shape="rounded">
					Color Tertiary + Small
				</smoothly-button>
				<smoothly-button color="dark" fill="solid" size="small" shape="rounded">
					Color Dark + Small
				</smoothly-button>
				<smoothly-button color="medium" fill="solid" size="small" shape="rounded">
					Color Medium + Small
				</smoothly-button>
				<smoothly-button color="light" fill="solid" size="small" shape="rounded">
					Color Light + Small
				</smoothly-button>
				<h4>Expand examples</h4>
				<smoothly-button color="secondary" fill="solid" expand="full">
					Color Secondary + Default
				</smoothly-button>
				<smoothly-button color="warning" fill="solid" expand="block">
					Color Warning + Large
				</smoothly-button>
				<h4>Fill examples</h4>
				<smoothly-button shape="rounded" color="primary" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button shape="rounded" color="secondary" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button shape="rounded" color="tertiary" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button size="icon" shape="rounded" color="success" fill="solid">
					<smoothly-icon name="basketball" fill="solid"></smoothly-icon>
				</smoothly-button>
				<h4>Buttons with Icon in "start"</h4>
				<div style={{ display: "inline-block" }}>
					<smoothly-button shape="rounded" fill="solid" color="warning">
						<smoothly-icon name="checkmark-circle" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button shape="rounded" fill="solid" color="secondary">
						<smoothly-icon name="basketball" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button shape="rounded" fill="solid" color="success">
						<smoothly-icon name="call" slot="start"></smoothly-icon>
						Check
					</smoothly-button>
					<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
						<smoothly-icon name="call"></smoothly-icon>
					</smoothly-button>
				</div>
				<h4>Buttons with Icon in "end"</h4>
				<smoothly-button fill="solid" color="light">
					Go Forward
					<smoothly-icon name="arrow-forward" slot="end"></smoothly-icon>
				</smoothly-button>
				<h4>Test for icon button</h4>
				<smoothly-button size="icon" fill="solid" shape="rounded" color="success">
					<smoothly-icon name="call"></smoothly-icon>
				</smoothly-button>
				<smoothly-button size="icon" shape="rounded" color="warning" fill="solid">
					<smoothly-icon name="search-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button size="icon" shape="rounded" color="secondary">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-button>
				<h4>Link examples</h4>
				<smoothly-button type="link">type link</smoothly-button>
				<smoothly-button type="button" fill="clear">
					<a href="https://google.com">link</a>
				</smoothly-button>
				<smoothly-button link="https://google.com" type="link">
					link + type link
				</smoothly-button>
				<h4>Disabled buttons</h4>
				<smoothly-button disabled fill="solid" color="secondary">
					Disabled
				</smoothly-button>
				<smoothly-button type="link" link="https://google.com" disabled>
					Disabled link
				</smoothly-button>
			</section>,
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
				<smoothly-submit slot="submit" onSubmit={(e: Event) => alert(e)} color="success">
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
				<smoothly-submit slot="submit" onSubmit={(e: Event) => alert(e)} color="success">
					Send
				</smoothly-submit>
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
			<h4>Smoothly checkboxes</h4>,
			<smoothly-form looks="plain">
				<smoothly-checkbox style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox disabled={true} style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox label="Label" />
			</smoothly-form>,
			<h2>Smoothly addresses</h2>,
			<smoothly-form looks="grid" style={{ margin: "2em" }}>
				<smoothly-address
					style={{ width: "30%" }}
					value={{
						allowed: "Visit",
						countryCode: "SE",
						street: "Korkstigen 2",
						zipCode: "654 32",
						city: "Fejksala",
					}}></smoothly-address>
				<smoothly-address
					style={{ width: "30%" }}
					editable={true}
					value={{
						allowed: "Billing",
						countryCode: "SE",
						street: "Stigvägen 34",
						zipCode: "123 45",
						city: "Hobbiton",
					}}></smoothly-address>
				<smoothly-addresses
					style={{ width: "30%" }}
					// allowed="billing delivery visit"
					// editable={true}
					value={[
						{ allowed: "Delivery", countryCode: "SE", street: "Rundslingan 3", zipCode: "987 65", city: "Klotby" },
						{ allowed: "Billing", countryCode: "SE", street: "Gångbanan 34", zipCode: "543 21", city: "Traskträsk" },
					]}></smoothly-addresses>
				<smoothly-submit slot="submit" onSubmit={(e: Event) => alert(e)} color="success" fill="solid">
					Submit
				</smoothly-submit>
			</smoothly-form>,
			<smoothly-trigger color="success" onClick={(e: UIEvent) => console.log(e.detail)}>
				Trigger
			</smoothly-trigger>,
			<smoothly-backtotop></smoothly-backtotop>,
		]
	}
}
