import { Component, Event, EventEmitter, h, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { tidily } from "tidily"
import { Filter } from "../Filter"

@Component({
	tag: "smoothly-filter-input",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilterInput implements Filter {
	expression: selectively.Criteria = {}
	@Prop() property: string
	@Prop() type: tidily.Type = "text"
	@Prop() placeholder: string
	@Event() filterRegister: EventEmitter<Filter.Update>
	@Event() filter: EventEmitter<Filter.Function>
	componentDidLoad() {
		this.filterRegister.emit(this.update.bind(this))
	}
	update(expression: selectively.Criteria): void {
		expression
	}
	inputHandler(event: CustomEvent<Record<string, unknown>>) {
		let result: Filter.Function
		event.stopPropagation()
		console.log("input handler: ", event.detail)
		const detail = event.detail[this.property]
		if (typeof detail == "string") {
			result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
				const result = { ...criteria }
				result[this.property] = selectively.includes(detail)
				return result
			}
		} else {
			result = (criteria: Record<string, selectively.Criteria>): Record<string, selectively.Criteria> => {
				const result = { ...criteria }
				delete result[this.property]
				return result
			}
		}
		this.filter.emit(result.bind(this))
	}

	render() {
		return (
			<smoothly-input
				name={this.property}
				value={this.expression}
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
