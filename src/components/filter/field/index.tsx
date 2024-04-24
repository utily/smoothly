import { Component, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"

@Component({
	tag: "smoothly-filter-field",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterField {
	input: HTMLSmoothlyInputElement | undefined
	@Prop() criteria: selectively.Criteria
	@Event() smoothlyFilterField: EventEmitter<selectively.Rule>
	@Method()
	async clear(): Promise<void> {
		await this.input?.clear()
	}
	filterFieldEmit() {
		this.smoothlyFilterField.emit(selectively.parse(this.input?.value ?? ""))
	}
	render() {
		return (
			<Host onKeyDown={(e: KeyboardEvent) => e.key == "Enter" && this.filterFieldEmit()}>
				<smoothly-input
					name="filter"
					ref={e => (this.input = e)}
					value={this.criteria.toString()}
					onSmoothlyInputLooks={e => e.stopPropagation()}
					onSmoothlyBlur={e => {
						e.stopPropagation()
						this.filterFieldEmit()
					}}
					onSmoothlyFormDisable={e => e.stopPropagation()}
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyChange={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
					}}>
					Filter
				</smoothly-input>
			</Host>
		)
	}
}
