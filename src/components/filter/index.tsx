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
	private inputs: Map<EventTarget, () => void> = new Map()
	@State() isExpanded = false
	@State() freeSearchValue: string
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop({ mutable: true }) inputValue: Criteria
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
	@Event() filters: EventEmitter<Criteria>
	onKeyDown() {
		this.freeSearchValue = this.freeSearchElement.value
		this.inputValue = selectively.includes(this.freeSearchValue)
		console.log("input value: ", this.inputValue)

		this.filters.emit(selectively.any(this.inputValue))
	}

	@Listen("clearAll")
	handleClearAll(event: CustomEvent<() => void>) {
		console.log("event.target: ", event.target)
		console.log("event.detail: ", event.detail)
		event.target && this.inputs.set(event.target, event.detail)
	}

	@Event() cleared: EventEmitter
	clickHandle(ev: MouseEvent) {
		//Array.from(this.inputs.values()).forEach(value => value())
		// Array.from(this.inputs.values(), value => value())

		for (const clear of this.inputs.values())
			clear()

		this.criteria = {}
		this.cleared.emit()
		// this.cleared.emit((this.criteria = {}))
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
				{/* to be replaced with smoothly-button */}
				<section slot="end">
					<smoothly-icon
						class={Object.keys(this.criteria).length >= 1 ? "btn clear" : "btn hidden"}
						name="close"
						size="tiny"
						onClick={ev => this.clickHandle(ev)}
					/>
					{/* to be replaced with smoothly-button */}
					<aside
						class="btn"
						onClick={() => {
							this.isExpanded = !this.isExpanded
						}}>
						{this.isExpanded ? (
							<smoothly-icon name="options" size="tiny" />
						) : (
							<smoothly-icon name="options-outline" size="tiny" />
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
