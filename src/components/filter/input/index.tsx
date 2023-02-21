import { Component, Event, EventEmitter, h, Method, Prop } from "@stencil/core"
import { Currency } from "isoly"
import * as selectively from "selectively"
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
	@Prop() comparison: "equals" | "less" | "greater" | "starts" | "ends" | "includes" = "includes"
	@Prop({ mutable: true }) filter: Criteria
	@Event() smoothlyFilter: EventEmitter<Criteria>

	private onFilter() {
		this.value = this.smoothlyInput.value
		let result: Criteria = ""
		let criteria: Criteria

		switch (this.comparison) {
			case "equals":
				criteria = this.value
				break
			case "less":
				criteria = selectively.lesserThan(this.value)
				break
			case "greater":
				criteria = selectively.greaterThan(this.value)
				break
			case "starts":
				criteria = selectively.startsWith(this.value)
				break
			case "ends":
				criteria = selectively.endsWith(this.value)
				break
			default:
			case "includes":
				criteria = selectively.includes(this.value)
				break
		}

		result = this.name
			.split(".")
			.reverse()
			.reduce<Criteria>((previousValue, currentValue) => ({ [currentValue]: previousValue }), criteria)
		this.smoothlyFilter.emit(result)
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
				onKeyDown={() => this.onFilter()}
				onSmoothlyInput={e => {
					this.value = e.detail.value ?? ""
				}}
				placeholder={this.placeholder}>
				<section slot="start">
					<slot name="start" />
				</section>
				<slot />
			</smoothly-input>,
		]
	}
}
