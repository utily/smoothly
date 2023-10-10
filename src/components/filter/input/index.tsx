import { Component, Event, EventEmitter, h, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilterInput {
	smoothlyInput: HTMLSmoothlyInputElement
	@Prop({ reflect: true }) name: string
	@Prop({ mutable: true }) value: any = ""
	@Prop() placeholder?: string
	@Prop() comparison: "equals" | "less" | "greater" | "starts" | "ends" | "within" | "some" | "has" | "includes" =
		"includes"
	@Event() filter: EventEmitter<selectively.Criteria>
	private onFilter(): void {
		this.value = this.smoothlyInput.value
		let result: selectively.Criteria = ""
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
				criteria = selectively.within(this.value)
				break
			case "has":
				criteria = selectively.has(this.value)
				break
			case "some":
				criteria = selectively.some(this.value)
				break
			default:
			case "includes":
				criteria = selectively.includes(this.value)
				break
		}
		result = this.name
			.split(".")
			.reverse()
			.reduce<selectively.Criteria>((previousValue, currentValue) => ({ [currentValue]: previousValue }), criteria)
		this.filter.emit(result)
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
				<div slot="start">
					<slot name="start" />
				</div>
				<slot />
			</smoothly-input>,
		]
	}
}
