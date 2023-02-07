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
	@Prop({ mutable: true }) placeholder: string | undefined
	@State() isExpanded = false
	@State() freeSearchValue: string
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop({ mutable: true }) inputValue: Criteria
	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()
		event.target && this.inputs.set(event.target, () => (event.target as HTMLSmoothlyFilterInputElement).clear())
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
		this.filters.emit(selectively.any(this.inputValue))
	}

	clearHandler(event: MouseEvent) {
		this.inputs.forEach(c => c())
		this.filters.emit((this.criteria = {}))
	}

	render() {
		return [
			<smoothly-form looks="border">
				<smoothly-input
					name="filter"
					ref={(element: HTMLSmoothlyInputElement) => (this.freeSearchElement = element)}
					value={selectivelyCreate(this.criteria).stringify()}
					onKeyDown={() => this.onKeyDown()}
					placeholder={this.placeholder}
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
							onClick={e => this.clearHandler(e)}
						/>
						{/* to be replaced with smoothly-button */}
						<aside
							class="btn"
							onClick={() => {
								this.isExpanded = !this.isExpanded
							}}>
							{this.isExpanded ? (
								<smoothly-icon name="options" size="small" />
							) : (
								<smoothly-icon name="options-outline" size="small" />
							)}
						</aside>
					</section>
				</smoothly-input>
			</smoothly-form>,

			<section hidden={!this.isExpanded} class={this.isExpanded ? "container arrow-top" : "hidden"}>
				<div hidden={!this.isExpanded} class={this.isExpanded ? "container-wrapper" : "hidden"}>
					{this.isExpanded && <slot name="filter" />}
				</div>
			</section>,
		]
	}
}
