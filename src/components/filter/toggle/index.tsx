import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { Icon } from "../../../model"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterToggle {
	@Prop() icon: Icon
	@Prop() properties: Record<string, string>
	@Prop() toolTip: string
	@Prop() not: boolean
	@Prop({ reflect: true }) flip = false
	@Prop({ mutable: true }) active = false
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		this.properties.pattern == "Colorpoint" && console.log("update.active", this.active)
		this.properties.pattern == "Colorpoint" && console.log("expression.expression", expression)
		if (expression instanceof selectively.And && expression.rules.length > 0) {
			this.active = Object.entries(this.properties).every(([key, value]) =>
				expression.rules.some(r => {
					const criteria = !this.not ? r : r instanceof selectively.Not ? r.criteria : undefined
					return (
						criteria?.is({ [key]: value }) &&
						criteria instanceof selectively.Property &&
						this.properties[criteria.name] &&
						criteria.criteria instanceof selectively.Is
					)
				})
			)
		} else
			this.active = false
	}
	activeHandler() {
		const manipulate: Filter.Manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
			let result: selectively.Criteria = criteria
			this.active = !this.active
			if (result instanceof selectively.And) {
				for (const [key, value] of Object.entries(this.properties)) {
					const newCriteria = !this.active
						? undefined
						: this.not
						? selectively.and(selectively.not(selectively.property(key, selectively.is(value))))
						: selectively.create({ [key]: value })
					this.properties.pattern == "Colorpoint" && console.log("newCriteria.newCriteria", newCriteria)
					const index = result.rules.findIndex(r => this.findInstanceOf(r, key))
					!newCriteria
						? result.rules.splice(index, 1)
						: index == -1
						? result.rules.push(newCriteria)
						: (result.rules[index] = newCriteria)
				}
				result = selectively.and(...result.rules)
			}
			return result
		}
		this.smoothlyFilterManipulate.emit(manipulate.bind(this))
	}
	findInstanceOf(criteria: selectively.Criteria, property: string): boolean {
		const check = !this.not ? criteria : criteria instanceof selectively.Not ? criteria.criteria : false
		return check instanceof selectively.Property && check.name == property
	}
	render() {
		this.properties.pattern == "Colorpoint" && console.log("this.active", this.active)
		return (
			<smoothly-icon
				fill="clear"
				color={this.active ? "success" : "medium"}
				name={(this.active ? `${this.icon}` : `${this.icon}-outline`) as Icon}
				toolTip={this.toolTip}
				onClick={() => this.activeHandler()}
			/>
		)
	}
}
