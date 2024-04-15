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
		const rule = selectively.create(expression)
		if (rule instanceof selectively.And && rule.rules.length > 0)
			for (const option of this.options.values())
				option.selected(rule.rules.some(r => r.is(option.state)))
		else
			this.options.forEach(o => o.selected(false))
		this.updating = false
	}
	pickerHandler(event: CustomEvent<Record<string, unknown>>) {
		event.stopPropagation()
		if (!this.updating) {
			const detail = event.detail[this.property]
			const manipulate = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
				const result = { ...criteria }
				if (this.multiple && isly.string().array({ criteria: "minLength", value: 1 }).is(detail)) {
					result[this.property] = selectively.within(detail)
				} else if (typeof detail == "string") {
					result[this.property] = selectively.is(detail)
				} else {
					delete result[this.property]
				}
				return result
			}
			this.smoothlyFilterManipulate.emit(manipulate.bind(this))
		}
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
