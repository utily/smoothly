import { Component, Event, EventEmitter, h, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"

@Component({
	tag: "smoothly-filter-field",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterField {
	input: HTMLSmoothlyInputElement | undefined
	@Prop() criteria: selectively.Criteria
	@Event() filterField: EventEmitter<selectively.Criteria>
	@Method()
	async clear(): Promise<void> {
		await this.input?.clear()
	}
	render() {
		const string = this.criteria.toString()
		return (
			<smoothly-input
				name="filter"
				ref={e => (this.input = e)}
				value={string}
				delay={1}
				onSmoothlyInputLooks={e => e.stopPropagation()}
				onSmoothlyBlur={e => e.stopPropagation()}
				onSmoothlyFormDisable={e => e.stopPropagation()}
				onSmoothlyInputLoad={e => e.stopPropagation()}
				onSmoothlyChange={e => e.stopPropagation()}
				onSmoothlyInput={e => {
					e.stopPropagation()
					if ("filter" in e.detail && typeof e.detail.filter == "string")
						this.filterField.emit(selectively.parse(e.detail.filter))
				}}>
				<smoothly-icon slot="start" name="funnel-outline" size="small" />
				Filter
			</smoothly-input>
		)
	}
}
