import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core"
import { Currency } from "isoly"
import * as selectively from "selectively"
import { Criteria } from "selectively"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterInput {
	@Prop({ reflect: true }) name: string
	@Prop() value: any
	@Prop({ reflect: true }) type = "text"
	@Prop({ mutable: true, reflect: true }) required = false
	@Prop() minLength = 0
	@Prop({ reflect: true }) showLabel = true
	@Prop() maxLength: number = Number.POSITIVE_INFINITY
	@Prop() autocomplete = true
	@Prop() pattern: RegExp | undefined
	@Prop() placeholder: string | undefined
	@Prop() disabled = false
	@Prop() readonly = false
	@Prop({ reflect: true }) currency?: Currency
	@Prop() comparison: "equals" | "less" | "greater" | "starts" | "ends" | "includes" = "includes"

	@State() isExpanded = false

	@Event() filter: EventEmitter<Criteria>

	private onFilter() {
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

	render() {
		return [
			<smoothly-input
				name={this.name}
				onChange={(event: CustomEvent) => (this.value = event.detail)}
				onBlur={() => this.onFilter()}>
				<smoothly-icon slot="start" name="search-outline" size="tiny"></smoothly-icon>
				<smoothly-button slot="end" onClick={() => (this.isExpanded = !this.isExpanded)}>
					{this.isExpanded ? (
						<smoothly-icon name="funnel" size="tiny"></smoothly-icon>
					) : (
						<smoothly-icon name="funnel-outline" size="tiny"></smoothly-icon>
					)}
				</smoothly-button>
			</smoothly-input>,
			<smoothly-filter-advanced hidden={!this.isExpanded}></smoothly-filter-advanced>,
		]
	}
}
