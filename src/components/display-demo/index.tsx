import { Component, h } from "@stencil/core"
@Component({
	tag: "smoothly-display-demo",
})
export class SmoothlyDisplayDemo {
	render() {
		return [
			<main>
				<smoothly-popup>
					<div>Popup, click me</div>
					<div color="dark" slot="popup">1 line popup</div>
				</smoothly-popup>
				<smoothly-display-date-time datetime="2019-08-15T08:08:17.65Z"></smoothly-display-date-time>
				<dl>
					<dt>text</dt>
					<dd>
						<smoothly-display type="text" value="text"></smoothly-display>
					</dd>
					<dt>postal code</dt>
					<dd>
						<smoothly-display type="postal-code" value="752 31"></smoothly-display>
					</dd>
					<dt>password</dt>
					<dd>
						<smoothly-display type="password" value="password"></smoothly-display>
					</dd>
					<dt>email</dt>
					<dd>
						<smoothly-display type="email" value="test@example.com"></smoothly-display>
					</dd>
					<dt>price</dt>
					<dd>
						<smoothly-display type="price" value="13.37" currency="SEK"></smoothly-display>
					</dd>
					<dt>percent</dt>
					<dd>
						<smoothly-display type="percent" value="42"></smoothly-display>
					</dd>
					<dt>phone</dt>
					<dd>
						<smoothly-display type="phone" value="0101881108"></smoothly-display>
					</dd>
					<dt>card number</dt>
					<dd>
						<smoothly-display type="card-number" value="4111111111111111"></smoothly-display>
					</dd>
					<dt>card expires</dt>
					<dd>
						<smoothly-display type="card-expires" value="7/22"></smoothly-display>
					</dd>
					<dt>card csc</dt>
					<dd>
						<smoothly-display type="card-csc" value="987"></smoothly-display>
					</dd>
				</dl>
				<smoothly-urlencoded data="hej=hopp&tjena=moss"></smoothly-urlencoded>
				<smoothly-notifier notice={{ type: "warning", message: "This is a test warning notice." }}></smoothly-notifier>
			</main>,
		]
	}
}
