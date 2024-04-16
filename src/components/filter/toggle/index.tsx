import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { Icon } from "../../../model"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-toggle",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterToggle implements Filter {
	@Prop() icon: Icon
	@Prop() property: string
	@Prop() value: string | number
	@Prop() toolTip: string
	@Prop({ reflect: true }) flip = false
	@Prop({ mutable: true, reflect: true }) active = false
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		if (expression instanceof selectively.And && expression.rules.length > 0) {
			this.active = expression.rules.some(
				r =>
					r.is({ [this.property]: this.value }) &&
					r instanceof selectively.Property &&
					r.name == this.property &&
					r.criteria instanceof selectively.Is
			)
		} else
			this.active = false
	}
	activeHandler() {
		const manipulate: Filter.Manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
			let result: selectively.Criteria = criteria
			const newCriteria = !this.active ? undefined : selectively.property(this.property, selectively.is(this.value))
			if (result instanceof selectively.And) {
				const index = result.rules.findIndex(r => this.findInstanceOf(r, this.property))
				!newCriteria
					? result.rules.splice(index, 1)
					: index == -1
					? result.rules.push(newCriteria)
					: (result.rules[index] = newCriteria)
				result = selectively.and(...result.rules)
			}
			return result
		}
		this.smoothlyFilterManipulate.emit(manipulate.bind(this))
	}
	findInstanceOf(criteria: selectively.Criteria, property: string): boolean {
		return criteria instanceof selectively.Property && criteria.name == property
	}
	render() {
		return (
			<smoothly-icon
				fill="clear"
				color={this.active ? "success" : "medium"}
				name={(this.active ? `${this.icon}` : `${this.icon}-outline`) as Icon}
				toolTip={this.toolTip}
				onClick={() => ((this.active = !this.active), this.activeHandler())}
			/>
		)
	}
}
