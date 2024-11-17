import { Component, h, Host, State } from "@stencil/core"
import { isoly } from "isoly"

@Component({
	tag: "smoothly-input-demo",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDemo {
	@State() duration: isoly.TimeSpan = { hours: 8 }
	@State() alphanumeric: string = "!@##"
	@State() date?: isoly.Date

	render() {
		return (
			<Host>
				<smoothly-form /* onSmoothlyFormInput={e => console.log(e.detail)} */>
					<smoothly-input-next value={12.5} name={"price"} type="price" currency="EUR"></smoothly-input-next>
					<smoothly-input type="price" currency="EUR">
						price
					</smoothly-input>
					<smoothly-input-next name={"date"} type="date" value={this.date ?? "2023-05-11"}></smoothly-input-next>
					<smoothly-button
						color="light"
						onClick={() => (this.date = this.date ? isoly.Date.next(this.date) : isoly.Date.now())}>
						Next day
					</smoothly-button>
					<smoothly-input-next name={"text"}></smoothly-input-next>
					<smoothly-input>text</smoothly-input>
					<smoothly-input-next name={"password"} type="password"></smoothly-input-next>
					<smoothly-input type="password">password</smoothly-input>
					<smoothly-input-next value={"41111111"} name={"cardNumber"} type="card-number"></smoothly-input-next>
					<smoothly-input type="card-number">card-number</smoothly-input>
					<smoothly-input-next value={[5, 11]} name={"cardExpires"} type="card-expires"></smoothly-input-next>
					<smoothly-input type="card-expires">card-expires</smoothly-input>
					<smoothly-input-next name={"cardCsc"} type="card-csc"></smoothly-input-next>
					<smoothly-input type="card-csc">card-csc</smoothly-input>
					<smoothly-input-next name={"email"} type="email"></smoothly-input-next>
					<smoothly-input type="email">email</smoothly-input>
					<smoothly-input-next name={"phone"} type="phone"></smoothly-input-next>
					<smoothly-input type="phone">phone</smoothly-input>
					<smoothly-input-next name={"integer"} type="integer"></smoothly-input-next>
					<smoothly-input type="integer">integer</smoothly-input>
				</smoothly-form>
			</Host>
		)
	}
}
