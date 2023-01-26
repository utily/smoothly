import { Component, Event, EventEmitter, h, Listen, Prop, State } from "@stencil/core"
import * as selectively from "selectively"
import { create as selectivelyCreate, Criteria } from "selectively"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilter {
	freeSearchElement: HTMLSmoothlyInputElement

	@State() isExpanded = false
	@State() freeSearchValue: string
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop({ mutable: true }) inputValue: Criteria
	@State() opacity: "1"

	@Event() filters: EventEmitter<Criteria>

	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()

		!this.freeSearchValue
			? this.filters.emit((this.criteria = { ...this.criteria, ...event.detail }))
			: this.filters.emit(
					selectively.and(
						selectively.any(selectively.includes(this.freeSearchValue)),
						(this.criteria = { ...this.criteria, ...event.detail })
					)
			  )
	}

	onKeyDown() {
		this.freeSearchValue = this.freeSearchElement.value
		this.inputValue = selectively.includes(this.freeSearchValue)

		this.filters.emit(selectively.any(this.inputValue))
	}

	render() {
		return [
			<smoothly-input
				name="filter"
				ref={(element: HTMLSmoothlyInputElement) => (this.freeSearchElement = element)}
				value={selectivelyCreate(this.criteria).stringify()}
				onKeyDown={() => this.onKeyDown()}
				readonly>
				{/* icon */}
				<section slot="start">
					<slot name="start" />
				</section>
				<slot />
				<section slot="end">
					{/* <smoothly-icon name="close" size="tiny" /> */}
					<aside
						class="btn"
						onClick={() => {
							this.isExpanded = !this.isExpanded
						}}>
						{this.isExpanded ? (
							<smoothly-icon name="funnel" size="tiny" />
						) : (
							<smoothly-icon name="funnel-outline" size="tiny" />
						)}
					</aside>
				</section>
			</smoothly-input>,

			<section hidden={!this.isExpanded} class={this.isExpanded ? "container arrow-top" : "hidden"}>
				<div hidden={!this.isExpanded} class={this.isExpanded ? "container-wrapper" : "hidden"}>
					{this.isExpanded && <slot name="filter" />}
				</div>
			</section>,
		]
	}
}
