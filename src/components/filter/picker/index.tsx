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
	@Prop() property: string
	@Prop() multiple = false
	@Event() smoothlyFilterUpdate: EventEmitter<Filter.Update>
	@Event() smoothlyFilterManipulate: EventEmitter<Filter.Manipulate>
	componentDidLoad() {
		this.smoothlyFilterUpdate.emit(this.update.bind(this))
	}
	@Listen("smoothlyPickerOptionChange")
	optionChangeHandler(event: CustomEvent<Option>) {
		event.stopPropagation()
		this.options.set(event.detail.value, {
			state: { [this.property]: event.detail.value },
			selected: event.detail.set.selected,
		})
	}
	update(expression: selectively.Criteria): void {
		this.updating = true
		if (expression instanceof selectively.And && expression.rules.length > 0)
			for (const option of this.options.values()) {
				if (expression.rules.some(r => r.is(option.state))) {
					option.selected(true)
					break
				}
			}
		else
			this.options.forEach(o => o.selected(false))
		this.updating = false
	}
	pickerHandler(event: CustomEvent<Record<string, unknown>>) {
		event.stopPropagation()
		if (!this.updating) {
			const argument = event.detail[this.property]
			const manipulate = (criteria: selectively.Criteria): selectively.Criteria => {
				let result: selectively.Criteria = criteria
				const newCriteria = this.getCriteria(argument)
				if (!(result instanceof selectively.Rule)) {
					result = newCriteria ? selectively.and(result, newCriteria) : result
				} else if (result instanceof selectively.And) {
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
	}
	findInstanceOf(criteria: selectively.Criteria, property: string): boolean {
		return criteria instanceof selectively.Property && criteria.name == property
	}
	private getCriteria(detail: unknown): selectively.Rule | undefined {
		let result: selectively.Criteria | undefined
		if (this.multiple && isly.string().array({ criteria: "minLength", value: 1 }).is(detail))
			result = selectively.property(this.property, selectively.within(detail))
		else if (typeof detail == "string")
			result = selectively.property(this.property, selectively.is(detail))
		else
			result = undefined
		return result
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
				<span slot="label">
					{[this.property.slice(0, 1).toUpperCase(), this.property.slice(1, this.property.length)].join("")}
				</span>
				<span slot="search">Search</span>
				<slot />
			</smoothly-picker>
		)
	}
}
