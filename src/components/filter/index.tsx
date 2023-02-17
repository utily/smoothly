import { Component, Event, EventEmitter, h, Listen, Method, Prop, State } from "@stencil/core"
import * as selectively from "selectively"
import { Criteria } from "selectively"
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
	@State() rule = ""
	@Prop({ mutable: true }) criteria: Record<string, Criteria> = {}
	@Prop({ mutable: true }) inputValue: Criteria
	@State() filter: selectively.selectively.Rule

	@Listen("filter")
	filterHandler(event: CustomEvent<string>) {
		event.stopPropagation()
		console.log("event.detail", event.detail)

		if (Clearable.is(event.target)) {
			const target = event.target
			Object.keys(event.detail).forEach(key => this.inputs.set(key, target))
		}

		this.rule = `${this.rule} ${event.detail}`
		this.filter = selectively.parse(this.rule)

		this.filters.emit(this.filter)
	}

	@Event() filters: EventEmitter<Criteria>
	onKeyDown(event: KeyboardEvent) {
		console.log("the event", event)
		this.freeSearchValue = this.freeSearchElement?.value
		this.inputValue = selectively.includes(this.freeSearchValue)
		// this.filters.emit(this.inputValue ? selectively.any(this.inputValue) : selectively.and())
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
					value={this.filter}
					onKeyDown={event => this.onKeyDown(event)}
					placeholder={this.placeholder}
					readonly>
					<section slot="start">
						<slot name="start" />
					</section>
					<slot />
					<section slot="end">
						<smoothly-button size="flexible" onClick={e => this.clear(e)}>
							<smoothly-icon
								class={Object.keys(this.criteria).length >= 1 ? "btn clear" : "btn hidden"}
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
