import { Component, Event, EventEmitter, h } from "@stencil/core"
import { Notice } from "../../model"
@Component({
	tag: "smoothly-display-demo",
})
export class SmoothlyDisplayDemo {
	@Event() notice: EventEmitter<Notice>
	private noticeWarning(notice: Notice) {
		console.log("emit", notice)
		this.notice.emit(notice)
	}
	render() {
		return [
			<main>
				<fieldset>
					<h2>Smoothly display</h2>
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
						<dt>display amount without decimals</dt>
						<dd>
							<smoothly-display-amount amount={200} currency="SEK" toInteger={true}></smoothly-display-amount>
						</dd>
						<dt>display amount with decimals if they are set, otherwise no decimal</dt>
						<dd>
							<smoothly-display-amount amount={200.20} currency="SEK" toInteger={true}></smoothly-display-amount>
						</dd>
						<dt>display amount with decimals</dt>
						<dd>
							<smoothly-display-amount amount={200.20} currency="SEK"></smoothly-display-amount>
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
						<dt>date</dt>
						<dd>
							<smoothly-display type="date" value="2022-07-07"></smoothly-display>
						</dd>
						<dt>date time</dt>
						<dd>
							<smoothly-display type="date-time" format={{year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}} value="2022-07-07T02:02:02Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "2-digit", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"}} value="2022-07-07T02:02:02Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"}} value="2022-07-07T12:22:24Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}} value="2022-07-07T12:22:24Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "numeric", month: "short", day: "numeric"}} value="2022-07-07T00:00+02:00"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "2-digit", month: "numeric", day: "numeric"}} value="2022-07-07T00:00+02:00"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display type="date-time" format={{year: "2-digit", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone:"Europe/Stockholm"}} value="2022-07-07T12:15Z"></smoothly-display>
						</dd>
						<dt>Deprecated display date time</dt>
						<dt>Display amount</dt>
						<dd>
							<smoothly-display-amount currency="SEK" amount="1289.5"></smoothly-display-amount>
						</dd>
						<dt>Quiet</dt>
						<dd>
							<smoothly-quiet color="dark">-</smoothly-quiet>
						</dd>
						<dt>Duration</dt>
						<dd><smoothly-display type="duration" value={{hours: 13, minutes: 100}} /><smoothly-display type="duration" value={{hours: 8, minutes: 30}} /><smoothly-display type="duration" value={{hours: 0, minutes: 3}} /></dd>
					</dl>
				</fieldset>
				<fieldset>
					<h2>Smoothly skeleton</h2>
					<smoothly-skeleton period={3} distance="20rem" width="20rem"></smoothly-skeleton>
					<smoothly-skeleton period={3} distance="20rem" color="200,200,255"></smoothly-skeleton>
					<smoothly-skeleton period={3} distance="20rem" color="var(--smoothly-warning-color)"></smoothly-skeleton>
					<smoothly-skeleton period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="center" period={3} distance="20rem" width="20rem"></smoothly-skeleton>
					<smoothly-skeleton align="center" period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="center" period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="center" period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="right" period={3} distance="20rem" width="20rem"></smoothly-skeleton>
					<smoothly-skeleton align="right" period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="right" period={3} distance="20rem" ></smoothly-skeleton>
					<smoothly-skeleton align="right" period={3} distance="20rem" ></smoothly-skeleton>
				</fieldset>
				<fieldset>
					<h2>Smoothly URL encoded</h2>
					<smoothly-urlencoded data="hej=hopp&tjena=moss"></smoothly-urlencoded>
				</fieldset>
				<fieldset>
					<h2>Smoothly popup</h2>
					<div style={{display: "flex", justifyContent: "space-between"}}>
						<smoothly-popup direction="down">
							Click for popup
							<span slot="popup" color="dark" style={{whiteSpace: "nowrap"}}>Some popup stuff that has a lot of text</span>
						</smoothly-popup>
						<smoothly-popup direction="down">
							Click for popup
							<span slot="popup" color="dark" style={{whiteSpace: "nowrap"}}>Some popup with a bunch of text.</span>
						</smoothly-popup>
					</div>
					<smoothly-popup>
						<div>Popup, click me</div>
						<div color="dark" slot="popup">
							1 line popup
						</div>
					</smoothly-popup>
				</fieldset>
				<fieldset>
				<h2>Test of different kinds of notifier</h2>
					<button onClick={() => this.noticeWarning(Notice.warn("This is a test warning notice."))}>warning</button>
					<button onClick={() => this.noticeWarning(Notice.succeeded("This is a test success notice."))}>success</button>
					<button onClick={() => this.noticeWarning(Notice.failed("This is a test danger notice."))}>danger</button>
					<button
						onClick={() =>
							this.noticeWarning(
								Notice.execute(
									"This is a test execute notice.",
									() =>
										new Promise<[boolean, string]>(resolve =>
											window.setTimeout(() => resolve([true, "This went great"]), 3000)
										)
								)
							)
						}>
						execute
					</button>
					<button
						onClick={() =>
							this.noticeWarning(
								Notice.delay(
									"This is a test delay notice.",
									() =>
										new Promise<[boolean, string]>(resolve =>
											window.setTimeout(() => resolve([true, "This went great"]), 3000)
										)
								)
							)
						}>
						delay
					</button>
				</fieldset>
				<fieldset>
					<h2>Smoothly spinner</h2>
					<div style={{position: "relative", height: "10em"}}>Large Spinner<smoothly-spinner active size="large" style={{"--background-color": "255,255,255", "--background-opacity": "0.2", "--spinner-color": "0,130,0", }}></smoothly-spinner></div>
					<div style={{position: "relative", height: "10em"}}>Medium Spinner<smoothly-spinner active size="medium"></smoothly-spinner></div>
					<div style={{position: "relative", height: "10em"}}>Small Spinner<smoothly-spinner active size="small"></smoothly-spinner></div>
					<div style={{position: "absolute", left: "500px", top: "150px" }}><smoothly-svg url="https://theme.payfunc.com/intergiro/animated-logo.svg"></smoothly-svg></div>
				</fieldset>
				<fieldset>
					<h2>Smoothly summary</h2>
					<smoothly-summary color="light" fill="clear" size="large">
						<p slot="summary">Some title</p>
						<p slot="content">Some content</p>
					</smoothly-summary>
					<smoothly-summary color="light" fill="clear" size="large">
						<p slot="summary">Some title</p>
						<p slot="content">Some content</p>
					</smoothly-summary>
					<smoothly-summary color="danger" fill="clear">
						<div slot="summary" style={{display: "flex", gap: "0.3rem"}}><span>Person</span><smoothly-icon name="person" color="light" fill="clear" size="tiny"></smoothly-icon></div>
						<p slot="content">Some person information.</p>
					</smoothly-summary>
					<smoothly-summary color="danger" fill="clear" open>
						<p slot="summary">Some other title</p>
						<p slot="content">A lot more content, yes please. A lot more content, yes please. A lot more content, yes please. A lot more content, yes please. A lot more content, yes please.A lot more content, yes please. A lot more content, yes please. A lot more content, yes please. A lot more content, yes please.</p>
					</smoothly-summary>
				</fieldset>
			</main>,
		]
	}
}
