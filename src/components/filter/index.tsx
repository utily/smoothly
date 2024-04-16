import { Component, Event, EventEmitter, h, Host, Listen, State } from "@stencil/core"
import { selectively } from "selectively"
import { Filter } from "./Filter"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilter {
	field: HTMLSmoothlyFilterFieldElement | undefined
	updating = false
	filters: Set<Filter.Update> = new Set<Filter.Update>() // maybe set?
	@State() detailChildren?: boolean
	@State() criteria: selectively.Criteria = selectively.and()
	@State() expanded = false
	@Event() smoothlyFilter: EventEmitter<selectively.Criteria>

	@Listen("smoothlyFilterUpdate")
	updateHandler(event: CustomEvent<Filter.Update>) {
		event.stopPropagation()
		if (Filter.Element.type.is(event.target))
			this.filters.add(event.detail)
	}
	@Listen("smoothlyFilterManipulate")
	manipulateHandler(event: CustomEvent<Filter.Manipulate>) {
		event.stopPropagation()
		this.updating = true
		this.criteria = event.detail(this.criteria)
		this.smoothlyFilter.emit(this.criteria)
		this.filters.forEach(update => update(this.criteria))
		this.updating = false
	}
	@Listen("filterField")
	filterFieldHandler(event: CustomEvent<selectively.Criteria>) {
		event.stopPropagation()
		if (!this.updating) {
			this.smoothlyFilter.emit((this.criteria = selectively.and(event.detail)))
			this.filters.forEach(update => update(this.criteria))
		}
	}
	clear(): void {
		this.field?.clear()
		this.smoothlyFilter.emit((this.criteria = selectively.and()))
		this.filters.forEach(update => update(this.criteria))
	}

	render() {
		return (
			<Host>
				<slot name="bar" />
				<smoothly-filter-field criteria={this.criteria} ref={e => (this.field = e)} />
				{this.criteria.toString() != "" && (
					<smoothly-icon
						name={"close"}
						toolTip={"Clear all filters"}
						size="small"
						onClick={() => {
							this.clear()
						}}
					/>
				)}
				<smoothly-icon
					name={this.expanded ? "options" : "options-outline"}
					toolTip={(this.expanded ? "Hide" : "Show") + " additional filters"}
					size="small"
					onClick={() => {
						this.expanded = !this.expanded
					}}
				/>
				<div class={this.expanded ? "container arrow-top" : "hidden"}>
					<slot name="detail" />
				</div>
			</Host>
		)
	}
}
