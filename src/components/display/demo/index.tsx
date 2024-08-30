import { Component, Event, EventEmitter, h, State } from "@stencil/core"
import { isoly } from "isoly"
import { Color, Notice } from "../../../model"
@Component({
	tag: "smoothly-display-demo",
})
export class SmoothlyDisplayDemo {
	@State() downloadingSpinner: boolean
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
						<dt>Duration</dt>
						<dd>
							<div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{ hours: 13, minutes: 100 }} />
									{" h"}
								</div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{ hours: 8 }} />
									{" h"}
								</div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{ minutes: 3 }} />
									{" h"}
								</div>
								<div>
									<smoothly-display
										style={{ display: "inline" }}
										type="duration"
										value={{ hours: -13, minutes: 100 }}
									/>
									{" h"}
								</div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{ hours: -8 }} />
									{" h"}
								</div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{}} />
									{" h"}
								</div>
								<div>
									<smoothly-display style={{ display: "inline" }} type="duration" value={{ minutes: -3 }} />
									{" h"}
								</div>
							</div>
						</dd>
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
							<smoothly-display-amount amount={200.2} currency="SEK" toInteger={true}></smoothly-display-amount>
						</dd>
						<dt>display amount with decimals</dt>
						<dd>
							<smoothly-display-amount amount={200.2} currency="SEK"></smoothly-display-amount>
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
							<smoothly-display
								type="date-time"
								format={{
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "numeric",
									second: "numeric",
								}}
								value="2022-07-07T02:02:02Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{
									year: "2-digit",
									month: "long",
									day: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
								}}
								value="2022-07-07T02:02:02Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
									hour: "numeric",
									minute: "numeric",
									second: "numeric",
								}}
								value="2022-07-07T12:22:24Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{
									year: "numeric",
									month: "numeric",
									day: "numeric",
									hour: "numeric",
									minute: "numeric",
									second: "numeric",
								}}
								value="2022-07-07T12:22:24Z"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{ year: "numeric", month: "short", day: "numeric" }}
								value="2022-07-07T00:00+02:00"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{ year: "2-digit", month: "numeric", day: "numeric" }}
								value="2022-07-07T00:00+02:00"></smoothly-display>
						</dd>
						<dd>
							<smoothly-display
								type="date-time"
								format={{
									year: "2-digit",
									month: "numeric",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
									timeZone: "Europe/Stockholm",
								}}
								value="2022-07-07T12:15Z"></smoothly-display>
						</dd>
						<dt>Display JSON (collapsed)</dt>
						<dd>
							<smoothly-display-demo-json />
						</dd>
						<dt>Display amount</dt>
						<dd>
							<smoothly-display-amount currency="SEK" amount="1289.5"></smoothly-display-amount>
						</dd>
					</dl>
				</fieldset>
				<h2>With labels</h2>
				<dd>
					<smoothly-display label="Today" type="date" value={isoly.Date.now()}></smoothly-display>
					<smoothly-display label="Total amount" type="price" currency="SEK" value={6789}></smoothly-display>
					<smoothly-display label="Total amount" type="price" currency="GBP" value={678.9}></smoothly-display>
					<smoothly-display
						label="Logs"
						type="json"
						value={[
							{ type: "trace", message: "Hello" },
							{ type: "error", message: "Oh no!" },
						]}></smoothly-display>
				</dd>
				<fieldset>
					<h2>Test of different kinds of notifier</h2>
					<button onClick={() => this.noticeWarning(Notice.warn("This is a test warning notice."))}>warning</button>
					<button onClick={() => this.noticeWarning(Notice.succeeded("This is a test success notice."))}>
						success
					</button>
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
					<div style={{ width: "fit-content" }}>
						Large
						<smoothly-spinner
							size="large"
							style={{
								"--spinner-background": "200,255,200",
								"--spinner-background-opacity": "0.2",
								"--spinner-color": "0,130,0",
							}}></smoothly-spinner>
					</div>
					<div style={{ width: "fit-content" }}>
						Medium
						<smoothly-spinner size="medium"></smoothly-spinner>
					</div>
					<div style={{ width: "fit-content" }}>
						Small
						<smoothly-spinner size="small"></smoothly-spinner>
					</div>
					<div>
						Icon sized spinner on button
						{Color.types.map(color => (
							<smoothly-button
								size="icon"
								color={color}
								shape="rounded"
								onClick={() => {
									this.downloadingSpinner = true
									setTimeout(() => (this.downloadingSpinner = false), 3000)
								}}>
								{!this.downloadingSpinner && <smoothly-icon name="download-outline"></smoothly-icon>}
								{this.downloadingSpinner && (
									<smoothly-spinner size="icon" style={{ "--spinner-background-opacity": "0" }}></smoothly-spinner>
								)}
							</smoothly-button>
						))}
					</div>
					<h3>Spinner with overlay</h3>
					<div style={{ position: "relative", height: "10em" }}>
						Large Overlay Spinner
						<smoothly-spinner
							overlay
							size="large"
							style={{
								"--spinner-background": "255,200,255",
								"--spinner-background-opacity": "0.5",
								"--spinner-color": "0,130,0",
							}}></smoothly-spinner>
					</div>
					<div style={{ position: "relative", height: "10em" }}>
						Medium Overlay Spinner
						<smoothly-spinner overlay color="secondary" size="medium"></smoothly-spinner>
					</div>
					<div style={{ position: "relative", height: "10em" }}>
						Small Overlay Spinner
						<smoothly-spinner overlay size="small"></smoothly-spinner>
					</div>
				</fieldset>
				<fieldset>
					<h2>Smoothly summary</h2>
					<smoothly-summary>
						<p slot="summary">Some title</p>
						<p slot="content">Some content</p>
					</smoothly-summary>
					<smoothly-summary size="large">
						<p slot="summary">Some title</p>
						<p slot="content">Some content</p>
					</smoothly-summary>
					<smoothly-summary color="danger" fill="clear">
						<div slot="summary" style={{ display: "flex", gap: "0.3rem" }}>
							<span>Person</span>
							<smoothly-icon name="person" color="light" fill="clear" size="tiny"></smoothly-icon>
						</div>
						<p slot="content">Some person information.</p>
					</smoothly-summary>
					<smoothly-summary color="danger" fill="clear" open>
						<p slot="summary">Some other title</p>
						<p slot="content">
							A lot more content, yes please. A lot more content, yes please. A lot more content, yes please. A lot more
							content, yes please. A lot more content, yes please.A lot more content, yes please. A lot more content,
							yes please. A lot more content, yes please. A lot more content, yes please.
						</p>
					</smoothly-summary>
					<h2>Label</h2>
					{labels.map(l => (
						<smoothly-label hue={l.hue} description={l.description} shape={"rectangle"}>
							{l.name}
						</smoothly-label>
					))}
				</fieldset>
			</main>,
		]
	}
}
const labels = [
	{
		name: "2fa",
		hue: 120,
		description: "User has two factor authentication enabled.",
	},
	{
		name: "expired",
		hue: 240,
		description: "User's password has expired.",
	},
	{
		name: "inactive",
		hue: 60,
		description: "User is inactive.",
	},
]
