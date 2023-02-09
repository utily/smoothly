import { Component, Event, EventEmitter, h, Method, Prop, State } from "@stencil/core"
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
	@Prop({ mutable: true }) value: any
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
	@State() criteria: Criteria

	@Event() filter: EventEmitter<Criteria>
	private onFilter() {
		this.value = this.smoothlyInput.value
		let criteria: selectively.Criteria
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
		this.filter.emit({ [this.name]: criteria })
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
					this.value = e.detail.value
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
