import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State } from "@stencil/core"
import { create as selectivelyCreate, Criteria } from "selectively"
import { Clearable } from "./Clearable"

@Component({
	tag: "smoothly-filter",
	styleUrl: "style.css",
	shadow: true,
})
export class SmoothlyFilter {
	private inputs = new Map<string, Clearable>()
	@State() expanded = false
	@Prop({ mutable: true }) filter: Record<string, Criteria> = {}
	@Event() smoothlyFilter: EventEmitter<Record<string, Criteria>>
	@Element() element: HTMLSmoothlyFilterElement

	@Listen("smoothlyFilter", { capture: true })
	filterHandler(event: CustomEvent<Record<string, Criteria>>) {
		if (event.target != this.element) {
			if (Clearable.is(event.target)) {
				const target = event.target
				Object.keys(event.detail).forEach(key => this.inputs.set(key, target))
			}
			this.smoothlyFilter.emit((this.filter = { ...this.filter, ...event.detail }))
		}
	}

	@Method()
	async clear(): Promise<void> {
		new Set(this.inputs.values()).forEach(input => input.clear())
		this.smoothlyFilter.emit((this.filter = {}))
	}

	render() {
		return [
			<smoothly-input name="filter" readonly value={selectivelyCreate(this.filter).stringify()}>
				<section slot="start">
					<slot name="start" />
				</section>
				<slot />
				<section slot="end">
					<smoothly-button size="flexible" onClick={() => this.clear()}>
						<smoothly-icon
							class={Object.keys(this.filter).length >= 1 ? "btn clear" : "btn hidden"}
							name="close"
							size="tiny"
						/>
					</smoothly-button>
					<smoothly-button
						size="flexible"
						class="btn"
						onClick={() => {
							this.expanded = !this.expanded
						}}>
						{this.expanded ? (
							<smoothly-icon name="options" size="small" />
						) : (
							<smoothly-icon name="options-outline" size="small" />
						)}
					</smoothly-button>
				</section>
			</smoothly-input>,
			<section hidden={!this.expanded} class={this.expanded ? "container arrow-top" : "hidden"}>
				<div hidden={!this.expanded} class={this.expanded ? "container-wrapper" : "hidden"}>
					{this.expanded && <slot name="filter" />}
				</div>
			</section>,
		]
	}
}
