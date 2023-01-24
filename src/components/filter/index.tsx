import { Component, Event, EventEmitter, h, Listen, Prop, State, Watch } from "@stencil/core"
import * as selectively from "selectively"
import { Criteria } from "selectively"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilter {
	freeSearchElement: HTMLSmoothlyInputElement

	@Prop({ reflect: true }) name: string
	@State() isExpanded = false
	@State() freeSearchValue: string
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop() comparison = "includes"
	@Prop({ mutable: true }) inputValue: Criteria

	@Event() filters: EventEmitter<Criteria>

	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()
		this.filters.emit((this.criteria = { ...this.criteria, ...event.detail }))
		console.log("working filter", this.criteria)
	}

	onKeyDown() {
		this.freeSearchValue = this.freeSearchElement.value
		this.inputValue = selectively.includes(this.freeSearchValue)
		this.filters.emit((this.criteria = { ...this.criteria, ...{ name: this.inputValue } }))
		console.log("inputValue", this.inputValue)

		console.log("nonworking filter", this.criteria)
	}

	render() {
		return [
			//main filter
			<main>
				<smoothly-icon name="search-outline" size="tiny" />
				<smoothly-input
					name="filter"
					// value={selectivelyCreate(this.criteria).stringify()}
					ref={(element: HTMLSmoothlyInputElement) => (this.freeSearchElement = element)}
					onKeyDown={() => this.onKeyDown()}></smoothly-input>
				<smoothly-button
					onClick={() => {
						this.isExpanded = !this.isExpanded
					}}>
					{this.isExpanded ? (
						<smoothly-icon name="funnel" size="tiny" />
					) : (
						<smoothly-icon name="funnel-outline" size="tiny" />
					)}
				</smoothly-button>
			</main>,
			<section hidden={!this.isExpanded} class={{ container: this.isExpanded }}>
				{/* arrow */}
				<div hidden={!this.isExpanded} class={{ arrow: this.isExpanded }}></div>
				<slot></slot>
			</section>,
		]
	}
}
