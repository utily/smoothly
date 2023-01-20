import { Component, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"
import { create as selectivelyCreate, Criteria } from "selectively"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilter {
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Event() filter: EventEmitter<Criteria>

	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		this.filter.emit((this.criteria = { ...this.criteria, ...event.detail }))
	}

	render() {
		return [
			<smoothly-input name="filter" disabled value={selectivelyCreate(this.criteria).stringify()}></smoothly-input>,
			<slot></slot>,
		]
	}
}
