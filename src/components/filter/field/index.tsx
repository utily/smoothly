import { Component, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"
import { Data } from "../../../model"

@Component({
	tag: "smoothly-filter-field",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterField {
	input: HTMLSmoothlyInputElement | undefined
	private value: string = ""
	@Prop() criteria: selectively.Criteria
	@Event() smoothlyFilterField: EventEmitter<selectively.Rule>
	@Method()
	async clear(): Promise<void> {
		await this.input?.clear()
	}
	filterFieldEmit() {
		this.smoothlyFilterField.emit(selectively.parse(this.value ?? ""))
	}
	updateValue(event: CustomEvent<Data>) {
		this.value = event.detail.filter as string
	}
	render() {
		return (
			<Host>
				<smoothly-input
					name="filter"
					ref={e => (this.input = e)}
					value={this.criteria.toString()}
					onSmoothlyInputLooks={e => e.stopPropagation()}
					onSmoothlyKeydown={e => {
						e.stopPropagation()
						e.detail.key == "Enter" && this.filterFieldEmit()
					}}
					onSmoothlyBlur={e => e.stopPropagation()}
					onSmoothlyFormDisable={e => e.stopPropagation()}
					onSmoothlyInputLoad={e => e.stopPropagation()}
					onSmoothlyChange={e => e.stopPropagation()}
					onSmoothlyInput={e => {
						e.stopPropagation()
						this.updateValue(e)
					}}>
					Filter
				</smoothly-input>
			</Host>
		)
	}
}
