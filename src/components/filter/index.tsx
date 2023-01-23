import { Component, Event, EventEmitter, h, Listen, Prop, State } from "@stencil/core"
import { create as selectivelyCreate, Criteria } from "selectively"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilter {
	@State() isExpanded = false
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Event() filters: EventEmitter<Criteria>

	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()
		this.filters.emit((this.criteria = { ...this.criteria, ...event.detail }))
	}

	render() {
		return [
			//main filter
			<main>
				<smoothly-icon name="search-outline" size="tiny" />
				<smoothly-input name="filter" value={selectivelyCreate(this.criteria).stringify()}></smoothly-input>
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
