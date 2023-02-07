import { Component, Event, EventEmitter, h, Listen, Method, Prop, State } from "@stencil/core"
import * as selectively from "selectively"
import { create as selectivelyCreate, Criteria } from "selectively"
import { Clearable } from "./Clearable"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilter {
	private freeSearchElement?: HTMLSmoothlyInputElement
	private inputs = new Map<string, Clearable>()
	@Prop({ mutable: true }) placeholder: string | undefined
	@State() expanded = false
	@State() freeSearchValue: string
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop({ mutable: true }) inputValue: Criteria

	@Listen("filter")
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		event.stopPropagation()

		if (Clearable.is(event.target)) {
			const target = event.target
			Object.keys(event.detail).forEach(key => this.inputs.set(key, target))
		}
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
		this.freeSearchValue = this.freeSearchElement?.value
		this.inputValue = selectively.includes(this.freeSearchValue)
		this.filters.emit(selectively.any(this.inputValue))
	}

	@Method()
	async clear(event: MouseEvent): Promise<void> {
		new Set(this.inputs.values()).forEach(input => input.clear())
		this.filters.emit((this.criteria = {}))
	}

	render() {
		return [
			<smoothly-form looks="border">
				<smoothly-input
					name="filter"
					ref={element => (this.freeSearchElement = element)}
					value={selectivelyCreate(this.criteria).stringify()}
					onKeyDown={() => this.onKeyDown()}
					placeholder={this.placeholder}
					readonly>
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
							onClick={e => this.clear(e)}
						/>
						{/* to be replaced with smoothly-button */}
						<aside
							class="btn"
							onClick={() => {
								this.expanded = !this.expanded
							}}>
							{this.expanded ? (
								<smoothly-icon name="options" size="small" />
							) : (
								<smoothly-icon name="options-outline" size="small" />
							)}
						</aside>
					</section>
				</smoothly-input>
			</smoothly-form>,

			<section hidden={!this.expanded} class={this.expanded ? "container arrow-top" : "hidden"}>
				<div hidden={!this.expanded} class={this.expanded ? "container-wrapper" : "hidden"}>
					{this.expanded && <slot name="filter" />}
				</div>
			</section>,
		]
	}
}
