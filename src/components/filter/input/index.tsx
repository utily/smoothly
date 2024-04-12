import { Component, Event, EventEmitter, h, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilterInput {
	input: HTMLSmoothlyInputElement
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value = ""
	@Prop() placeholder?: string
	@Prop() comparison: "equals" | "less" | "greater" | "starts" | "ends" | "within" | "some" | "has" | "includes" =
		"includes"
	@Event() filter: EventEmitter<{ type: string; criteria: selectively.Criteria }>
	private onFilter(event: KeyboardEvent): void {
		event.stopPropagation()
		this.value = this.input.value
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
			case "within":
				criteria = selectively.within([this.value])
				break
			case "has":
				criteria = selectively.has(this.value)
				break
			case "some":
				criteria = selectively.some(selectively.includes(this.value))
				break
			default:
			case "includes":
				criteria = selectively.includes(this.value)
				break
		}
		const result: selectively.Criteria = this.name
			.split(".")
			.reverse()
			.reduce<selectively.Criteria>((previousValue, currentValue) => ({ [currentValue]: previousValue }), criteria)
		this.filter.emit({ type: "input", criteria: result })
	}
	@Method()
	async clear(): Promise<void> {
		this.input.clear()
	}
	render() {
		return (
			<smoothly-input
				name={this.name}
				ref={(element: HTMLSmoothlyInputElement) => (this.input = element)}
				value={this.value}
				onKeyDown={e => this.onFilter(e)}
				placeholder={this.placeholder}>
				<div slot="start">
					<slot name="start" />
				</div>
				<slot />
			</smoothly-input>
		)
	}
}
