import { Component, Event, EventEmitter, h, Method, Prop, State } from "@stencil/core"
import { Currency } from "isoly"
// import * as selectively from "selectively"
import { Criteria } from "selectively"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilterInput {
	smoothlyInput: HTMLSmoothlyInputElement

	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value = ""
	@Prop({ reflect: true }) type = "text"
	@Prop({ mutable: true, reflect: true }) required = false
	@Prop() minLength = 0
	@Prop({ reflect: true }) showLabel = true
	@Prop() maxLength: number = Number.POSITIVE_INFINITY
	@Prop() autocomplete = true
	@Prop() pattern?: RegExp
	@Prop() placeholder?: string
	@Prop() disabled = false
	@Prop() readonly = false
	@Prop({ reflect: true }) currency?: Currency
	@Prop() comparison: "equals" | "less" | "greater" | "starts" | "ends" | "includes" | "some" = "includes"
	@State() criteria: Criteria

	@Event() filter: EventEmitter<string> //<{ name: string; value: string }>
	private onFilter(event: KeyboardEvent) {
		this.value = this.smoothlyInput.value

		// const result: Criteria = ""
		let criteria: string
		console.log("value", this.value)
		console.log("an event", event)

		switch (this.comparison) {
			case "equals":
				criteria = `:${this.value}`
				break
			case "less":
				criteria = `:<${this.value}` //selectively.lesserThan(this.value)
				break
			case "greater":
				criteria = `:>${this.value}` //selectively.greaterThan(this.value)
				break
			case "starts":
				criteria = `:${this.value}*` // selectively.startsWith(this.value)
				break
			case "ends":
				criteria = `:*${this.value}` // selectively.endsWith(this.value)
				break
			case "some":
				criteria = `:${this.value}`
				break
			default:
			case "includes":
				criteria = `:*${this.value}*` //selectively.includes(this.value)
				break
		}

		/*result = this.name
			.split(".")
			.reverse()
			.reduce<Criteria>((previousValue, currentValue) => ({ [currentValue]: previousValue }), criteria) */
		// this.filter.emit({ name: this.name, value: this.value == "" ? this.name + ":**" : this.name + criteria })
		// console.log("emit: ", { name: this.name, value: this.value == "" ? this.name + ":**" : this.name + criteria })
		// this.filter.emit({ name: this.name, value: this.value == "" ? "**" : criteria })
		// console.log({ name: this.name, value: this.value == "" ? "**" : criteria })
		this.filter.emit(this.name + criteria)
		console.log("criteria? ", this.name + criteria)
	}

	@Method()
	async clear() {
		this.value = ""
	}

	render() {
		return [
			<smoothly-input
				name={this.name}
				ref={(element: HTMLSmoothlyInputElement) => (this.smoothlyInput = element)}
				value={this.value}
				onKeyDown={event => this.onFilter(event)}
				onSmoothlyInput={e => {
					this.value = e.detail.value ?? ""
				}}
				placeholder={this.placeholder}>
				<div slot="start">
					<slot name="start" />
				</div>
				<slot />
			</smoothly-input>,
		]
	}
}
