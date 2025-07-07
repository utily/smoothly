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
	@Prop() tooltip: string
	@Prop() not: boolean
	@Prop({ reflect: true }) flip = false
	@Prop({ mutable: true }) active = false
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentWillLoad() {
		this.active && this.activeHandler()
	}
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		if (expression instanceof selectively.And && expression.rules.length > 0) {
			this.active = Object.entries(this.properties).every(([key, value]) =>
				expression.rules.some(r => {
					const criteria = !this.not ? r : r instanceof selectively.Not ? r.criteria : undefined
					return value == ""
						? !(criteria instanceof selectively.Property && criteria.name == key)
						: this.isCriteria(criteria, key, value)
				})
			)
		} else
			this.active = false
	}
	private isCriteria(criteria: selectively.Rule | undefined, key: string, value: string): boolean {
		const [property, ...rest] = key.split(".")
		return (
			criteria instanceof selectively.Property &&
			criteria.name == property &&
			((criteria.criteria instanceof selectively.Is && criteria.criteria.value == value) ||
				this.isCriteria(criteria.criteria, rest.join("."), value))
		)
	}

	activeHandler(activate?: true) {
		const manipulate: Filter.Manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
			let result: selectively.Criteria = criteria
			activate && (this.active = !this.active)
			if (result instanceof selectively.And) {
				for (const [key, value] of Object.entries(this.properties)) {
					const newCriteria =
						!this.active || (this.active && value == "")
							? undefined
							: this.not
							? selectively.not(this.createCriteria(key, value))
							: this.createCriteria(key, value)
					const index = result.rules.findIndex(r => this.findInstanceOf(r, key))
					!newCriteria && index >= 0
						? result.rules.splice(index, 1)
						: !newCriteria
						? undefined
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
	createCriteria(key: string, value: string): selectively.Rule {
		const [property, ...rest] = key.split(".")
		return selectively.property(
			property,
			rest.length == 0 ? selectively.is(value) : this.createCriteria(rest.join("."), value)
		)
	}
	findInstanceOf(criteria: selectively.Criteria, property: string): boolean {
		const check = !this.not ? criteria : criteria instanceof selectively.Not ? criteria.criteria : false
		const [key, ...rest] = property.split(".")
		return (
			check instanceof selectively.Property &&
			check.name == key &&
			(rest.length == 0 || (!!check.criteria && this.findInstanceOf(check.criteria, rest.join("."))))
		)
	}
	render() {
		return (
			<smoothly-icon
				fill="clear"
				color={this.active ? "success" : "medium"}
				name={(this.active ? `${this.icon}` : `${this.icon}-outline`) as Icon}
				tooltip={this.tooltip}
				onClick={() => this.activeHandler(true)}
			/>
		)
	}
}
