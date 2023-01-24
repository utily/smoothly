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
			//main filter
			<main>
				<smoothly-icon name="search-outline" size="tiny" />
				<smoothly-input
					name="filter"
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
