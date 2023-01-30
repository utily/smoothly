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
				<div style={{ display: "inline-block" }}>
					<smoothly-toggle>
						<smoothly-icon name="card" fill="solid" slot="icon-slot"></smoothly-icon>
					</smoothly-toggle>
					<smoothly-toggle>
						<smoothly-icon name="briefcase" slot="icon-slot"></smoothly-icon>
					</smoothly-toggle>
					<smoothly-toggle>
						<smoothly-icon name="airplane" slot="icon-slot"></smoothly-icon>
					</smoothly-toggle>
				</div>
				<div style={{ display: "flex", marginTop: "1em" }}>
					<smoothly-toggle disabled shape="rounded" name="This"></smoothly-toggle>
					<smoothly-toggle shape="rounded" name="That"></smoothly-toggle>
					<smoothly-toggle shape="rounded" name="Press"></smoothly-toggle>
				</div>
				<h4>Toggle switches</h4>
				<div style={{ display: "inline-block", height: "3em", width: "6em", padding: "1em" }}>
					<smoothly-toggle-switch disabled={true}></smoothly-toggle-switch>
				</div>
				<div style={{ display: "inline-block", height: "3em", width: "6em", padding: "1em" }}>
					<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
				</div>
				<div style={{ display: "inline-block", height: "2em", width: "4em", padding: "1em" }}>
					<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
					<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
					<smoothly-toggle-switch disabled={false}></smoothly-toggle-switch>
				</div>
				<h4>Links with icons</h4>
				<div style={{ display: "inline" }}>
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
				</div>

				<h4>Size and Color test</h4>
				<smoothly-button color="primary" fill="solid" size="small">
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

				<h4>Expand examples</h4>
				<smoothly-button color="light" fill="solid" expand="full">
					Color Secondary + Default
				</smoothly-button>
				<smoothly-button color="dark" fill="solid" expand="block">
					Color Warning + Large
				</smoothly-button>
				<h4>Fill examples</h4>
				<smoothly-button shape="rounded" color="default" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button color="primary" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button shape="rounded" color="secondary" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button color="tertiary" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button shape="rounded" color="success" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button color="warning" fill="solid">
					Fill Solid
				</smoothly-button>

				<h4>Outline different colors</h4>
				<smoothly-button shape="rounded" color="default" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button color="primary" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button shape="rounded" color="secondary" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button color="tertiary" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button shape="rounded" color="success" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button color="warning" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button shape="rounded" color="danger" fill="outline">
					Fill Outline
				</smoothly-button>

				<h4>Clear different colors</h4>
				<smoothly-button shape="rounded" color="default" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button color="primary" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button shape="rounded" color="secondary" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button color="tertiary" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button shape="rounded" color="success" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button color="warning" fill="clear">
					Fill Clear
				<smoothly-button color="warning" fill="solid" size="large" shape="rounded">
					Color Warning + Large
				</smoothly-button>

				<h4>Size and Color test</h4>
				<smoothly-button color="primary" fill="solid" size="small">
					Color Primary + Small
				</smoothly-button>
				<smoothly-button color="secondary" fill="solid">
					Color Secondary + Default
				</smoothly-button>
				<smoothly-button color="warning" fill="solid" size="large">
					Color Warning + Large
				</smoothly-button>
				<h4>Expand</h4>
				<smoothly-button fill="outline" expand="block" color="medium">
					Fill Outline + Expand Block
				</smoothly-button>
				<smoothly-button fill="solid" expand="full" color="light">
					Fill Solid + Expand Full
				</smoothly-button>

				<h4>Fill examples</h4>
				<smoothly-button shape="rounded" color="warning" fill="solid">
					Fill Solid
				</smoothly-button>
				<smoothly-button color="secondary" fill="clear">
					Fill Clear
				</smoothly-button>
				<smoothly-button shape="rounded" color="medium" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button color="light" fill="default">
					Fill Default
				</smoothly-button>

				<h4>Outline different colors</h4>
				<smoothly-button shape="rounded" color="warning" fill="outline">
					Fill Solid
				</smoothly-button>
				<smoothly-button color="secondary" fill="outline">
					Fill Clear
				</smoothly-button>
				<smoothly-button shape="rounded" color="medium" fill="outline">
					Fill Outline
				</smoothly-button>
				<smoothly-button color="light" fill="outline">
					Fill Default
				</smoothly-button>

				<h4>Buttons with Icon in "start"</h4>
				<div style={{ display: "flex" }}>
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
				</div>
				<h4>Buttons with Icon in default slot, Fill Clear</h4>
				<smoothly-button fill="clear" color="success" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="warning" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="danger" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="secondary" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="tertiary" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="light" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>

				<h4>Other fills</h4>
				<smoothly-button fill="solid" color="warning" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="solid" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="clear" color="danger" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="default" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<smoothly-button fill="outline" color="success" style={{ width: "7em", padding: "none" }}>
					<smoothly-icon fill="clear" name="funnel-outline"></smoothly-icon>
				</smoothly-button>
				<h4>Buttons with Icon in "end"</h4>
				<div style={{ display: "flex" }}>
					<smoothly-button fill="solid" color="warning" type="button">
						<a href="https://google.com">link</a>
				</div>

				<h4>Buttons with Icon in "end"</h4>
				<div style={{ display: "flex" }}>
					<smoothly-button fill="solid" color="light">
						Go Forward
						<smoothly-icon name="arrow-forward" slot="end"></smoothly-icon>
					</smoothly-button>
				</div>

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
				<smoothly-button type="button">
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
				<smoothly-submit slot="submit" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Card</h4>,
			<smoothly-form looks="grid">
				<smoothly-input type="card-number" name="card" style={{ width: "80%" }}>
					Card #
				</smoothly-input>
				<smoothly-submit slot="submit" color="success" fill="solid">
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
				<smoothly-submit slot="submit" color="success" fill="solid">
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
				<smoothly-submit slot="submit" color="success" fill="solid">
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
				<smoothly-submit slot="submit" color="success" fill="solid">
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
				<smoothly-submit slot="submit" color="success" fill="solid">
					<smoothly-icon name="checkmark-circle"></smoothly-icon>
				</smoothly-submit>
			</smoothly-form>,
			<h4>Smoothly checkboxes</h4>,
			<smoothly-form looks="grid">
				<smoothly-checkbox selectAll={true} intermediate={true} style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox style={{ width: "100%" }}></smoothly-checkbox>
				<smoothly-checkbox disabled={true} style={{ width: "100%" }}></smoothly-checkbox>
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
				<smoothly-submit slot="submit" onSubmit={(e: Event) => alert(e)} color="success">
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
