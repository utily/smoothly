import { Component, Event, EventEmitter, h, Prop, State } from "@stencil/core"
import { selectively } from "selectively"
import { tidily } from "tidily"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterInput implements Filter {
	type: tidily.Type = "text"
	@State() needle: selectively.Criteria = ""
	@Prop() property: string
	@Prop() placeholder: string
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		if (expression instanceof selectively.And && expression.rules.length > 0)
			for (const rule of expression.rules) {
				const criteria = this.isCriteria(rule, this.property)
				if (criteria) {
					this.needle = criteria.needle ?? ""
					break
				}
			}
		else
			this.needle = ""
	}
	private isCriteria(criteria: selectively.Rule | undefined, key: string): selectively.Includes | undefined {
		const [property, ...rest] = key.split(".")
		return (
			(criteria instanceof selectively.Property &&
				criteria.name == property &&
				((criteria.criteria instanceof selectively.Includes && criteria.criteria) ||
					(criteria.criteria instanceof selectively.Property && this.isCriteria(criteria.criteria, rest.join("."))))) ||
			undefined
		)
	}
	inputHandler(event: CustomEvent<Record<string, string>>) {
		event.stopPropagation()
		const needle = event.detail[this.property]
		const manipulate: Filter.Manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
			let result: selectively.Criteria = criteria
			const newCriteria = needle ? this.getCriteria(needle) : undefined
			if (result instanceof selectively.And) {
				const index = result.rules.findIndex(r => this.findInstanceOf(r, this.property))
				!newCriteria
					? index != -1 && result.rules.splice(index, 1)
					: index == -1
					? result.rules.push(newCriteria)
					: (result.rules[index] = newCriteria)
				result = selectively.and(...result.rules)
			}
			return result
		}
		this.smoothlyFilterManipulate.emit(manipulate.bind(this))
	}
	private getCriteria(needle: string): selectively.Rule | undefined {
		return this.property
			.split(".")
			.reduceRight((r: selectively.Rule, e) => selectively.property(e, r), selectively.includes(needle))
	}
	findInstanceOf(criteria: selectively.Criteria, property: string): boolean {
		const [key, ...rest] = property.split(".")
		return (
			criteria instanceof selectively.Property &&
			criteria.name == key &&
			(rest.length == 0 || (!!criteria.criteria && this.findInstanceOf(criteria.criteria, rest.join("."))))
		)
	}

	render() {
		return (
			<smoothly-input
				name={this.property}
				value={this.needle}
				type={this.type}
				placeholder={this.placeholder}
				onSmoothlyInputLooks={e => e.stopPropagation()}
				onSmoothlyBlur={e => e.stopPropagation()}
				onSmoothlyFormDisable={e => e.stopPropagation()}
				onSmoothlyInputLoad={e => e.stopPropagation()}
				onSmoothlyChange={e => e.stopPropagation()}
				onSmoothlyInput={e => this.inputHandler(e)}>
				<slot />
			</smoothly-input>
		)
	}
}
