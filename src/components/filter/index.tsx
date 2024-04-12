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
	state: Record<string, selectively.Criteria> = {}
	filters: Map<string, Filter.Update> = new Map<string, Filter.Update>() // maybe set?
	@State() criteria: selectively.Criteria = {}
	@State() expanded = false
	@Event() smoothlyFilter: EventEmitter<selectively.Criteria>

	@Listen("filterRegister")
	registerHandler(event: CustomEvent<Filter.Update>) {
		event.stopPropagation()
		if (Filter.Element.type.is(event.target))
			this.filters.set(event.target.property, event.detail)
	}
	@Listen("filter")
	filterHandler(event: CustomEvent<Filter.Function>) {
		event.stopPropagation()
		this.updating = true
		this.state = event.detail(this.state)
		this.smoothlyFilter.emit((this.criteria = selectively.create(this.state)))
		this.filters.forEach(update => update(this.criteria))
		this.updating = false
	}
	@Listen("filterField")
	filterFieldHandler(event: CustomEvent<selectively.Criteria>) {
		event.stopPropagation()
		if (!this.updating) {
			this.state = {}
			this.smoothlyFilter.emit((this.criteria = selectively.and(event.detail)))
			this.filters.forEach(update => update(this.criteria))
		}
	}
	clear(): void {
		this.state = {}
		this.field?.clear()
		this.smoothlyFilter.emit((this.criteria = {}))
		this.filters.forEach(update => update({}))
	}

	render() {
		return (
			<Host>
				<slot name="bar" />
				<smoothly-filter-field criteria={this.criteria} ref={e => (this.field = e)} />
				<smoothly-icon
					name={"close"}
					toolTip={"Clear all filters"}
					size="small"
					onClick={() => {
						this.clear()
					}}
				/>
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
