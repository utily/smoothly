import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { Icon } from "../../../model"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterIcon implements Filter {
	@Prop() icon: Icon
	@Prop() property: string
	@Prop() comparison: "includes" | "less" | "greater" = "includes"
	@Prop() value: string | number
	@Prop() toolTip: string
	@Prop({ reflect: true }) flip = false
	@Prop({ mutable: true, reflect: true }) active = false
	@Event() filterRegister: EventEmitter<Filter.Update>
	@Event() filter: EventEmitter<Filter.Function>
	componentDidLoad() {
		this.filterRegister.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		console.log("icon update: ", expression)

		expression
	}
	activeHandler() {
		let result: Filter.Function
		if (!this.active) {
			result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
				const result = { ...criteria }
				delete result[this.property]
				return result
			}
		} else {
			switch (this.comparison) {
				case "includes":
					result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
						const result = { ...criteria }
						result[this.property] = selectively.includes(this.value.toString())
						return result
					}
					break
				case "greater":
					result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
						const result = { ...criteria }
						result[this.property] = selectively.greaterThan(this.value)
						return result
					}
					break
				case "less":
					result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
						const result = { ...criteria }
						result[this.property] = selectively.lesserThan(this.value)
						return result
					}
					break
			}
		}
		this.filter.emit(result.bind(this))
	}
	render() {
		return (
			<smoothly-icon
				fill="clear"
				color={this.active ? "success" : "medium"}
				name={(this.active ? `${this.icon}` : `${this.icon}-outline`) as Icon}
				onClick={() => ((this.active = !this.active), this.activeHandler())}
				toolTip={this.toolTip}
			/>
		)
	}
}
