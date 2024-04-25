import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { isly } from "isly"
import { Option } from "../../../model"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-picker",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterPicker implements Filter {
	updating = false
	options: Map<string, { state: Record<string, any>; selected: (selected: boolean) => void }> = new Map<
		string,
		{ state: Record<string, any>; selected: (selected: boolean) => void }
	>()
	@Prop() label: string
	@Prop() property: string
	@Prop() multiple = false
	@Prop() type: "array" | "string" = "string"
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		this.options.set(event.detail.value, {
			state: this.property.split(".").reduceRight((r, e) => ({ [e]: r }), event.detail.value),
			selected: event.detail.set.selected,
		})
	}
	update(expression: selectively.Criteria): void {
		this.updating = true
		if (expression instanceof selectively.And && expression.rules.length > 0)
			for (const option of this.options.values()) {
				option.selected(
					expression.rules.some(
						r =>
							this.isCriteria(r, this.property, option.state) &&
							(this.type == "array" ? this.findInstanceOf(r, this.property) : r.is(option.state))
					)
				)
			}
		else
			this.options.forEach(o => o.selected(false))
		this.updating = false
	}
	private isCriteria(criteria: selectively.Rule | undefined, key: string, value: Record<string, any> | any): boolean {
		const [property, ...rest] = key.split(".")
		return criteria instanceof selectively.Property && criteria.name == property
			? this.isCriteria(criteria.criteria, rest.join("."), value[property])
			: this.multiple
			? (criteria instanceof selectively.Within && criteria.value.some(e => e == value)) ||
			  (this.type == "array" && criteria instanceof selectively.Contains && criteria.criteria.some(e => e == value))
			: criteria instanceof selectively.Is && criteria.value == value
	}
	pickerHandler(event: CustomEvent<Record<string, unknown>>) {
		event.stopPropagation()
		if (!this.updating) {
			const argument = event.detail[this.property]
			const manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
				let result: selectively.Criteria = criteria
				const newCriteria = this.getCriteria(argument)
				if (!(result instanceof selectively.Rule))
					result = newCriteria ? selectively.and(result, newCriteria) : result
				else if (result instanceof selectively.And) {
					const index = result.rules.findIndex(r => this.findInstanceOf(r, this.property))
					!newCriteria && index >= 0
						? result.rules.splice(index, 1)
						: !newCriteria
						? undefined
						: index == -1
						? result.rules.push(newCriteria)
						: (result.rules[index] = newCriteria)
					result = selectively.and(...result.rules)
				}
				return result
			}
			this.smoothlyFilterManipulate.emit(manipulate.bind(this))
		}
	}
	findInstanceOf(criteria: selectively.Criteria, key: string): boolean {
		const [property, ...rest] = key.split(".")
		return (
			criteria instanceof selectively.Property &&
			criteria.name == property &&
			(criteria.criteria instanceof selectively.Within ||
				criteria.criteria instanceof selectively.Is ||
				criteria.criteria instanceof selectively.Contains ||
				(criteria.criteria instanceof selectively.Property && this.findInstanceOf(criteria.criteria, rest.join("."))))
		)
	}
	private getCriteria(detail: unknown): selectively.Rule | undefined {
		let result: selectively.Criteria | undefined
		if (this.multiple && isly.string().array({ criteria: "minLength", value: 1 }).is(detail))
			result = this.type == "array" ? selectively.contains(detail) : selectively.within(detail)
		else if (typeof detail == "string")
			result = selectively.is(detail)
		else
			result = undefined
		return result && this.property.split(".").reduceRight((r, e) => selectively.property(e, r), result)
	}

	render() {
		return (
			<smoothly-picker
				name={this.property}
				looks="border"
				multiple={this.multiple}
				onSmoothlyInputLooks={e => e.stopPropagation()}
				onSmoothlyChange={e => e.stopPropagation()}
				onSmoothlyPickerLoaded={e => e.stopPropagation()}
				onSmoothlyInput={e => this.pickerHandler(e)}>
				{this.label && (
					<span slot="label">
						{[this.label.slice(0, 1).toUpperCase(), this.label.slice(1, this.label.length)].join("")}
					</span>
				)}
				<span slot="search">Search</span>
				<slot />
			</smoothly-picker>
		)
	}
}
