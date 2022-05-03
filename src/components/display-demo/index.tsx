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
				<smoothly-popup>
					<div>Popup, click me</div>
					<div color="dark" slot="popup">
						1 line popup
					</div>
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
					<dt>Quiet</dt>
					<dd>
						<smoothly-quiet color="dark">-</smoothly-quiet>
					</dd>
				</dl>
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
				<smoothly-urlencoded data="hej=hopp&tjena=moss"></smoothly-urlencoded>
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
				<p>Test of diffrent kinds of notifier:</p>
				<button onClick={() => this.noticeWarning(Notice.warn("This is a test warning notice."))}>warning</button>
				<button onClick={() => this.noticeWarning(Notice.succeded("This is a test success notice."))}>success</button>
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
				<div style={{position: "relative", height: "10em"}}>Large Spinner<smoothly-spinner active size="large" style={{"--background-color": "255,255,255", "--background-opacity": "0.2", "--spinner-color": "0,130,0", }}></smoothly-spinner></div>
				<div style={{position: "relative", height: "10em"}}>Medium Spinner<smoothly-spinner active size="medium"></smoothly-spinner></div>
				<div style={{position: "relative", height: "10em"}}>Small Spinner<smoothly-spinner active size="small"></smoothly-spinner></div>
				<smoothly-svg></smoothly-svg>
			</main>,
		]
	}
}
