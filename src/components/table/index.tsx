import { Component, ComponentWillLoad, Element, Event, EventEmitter, h, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table",
	styleUrl: "style.css",
	scoped: true,
})
export class Table implements ComponentWillLoad {
	private owner?: EventTarget
	private expandable: Map<EventTarget, { allowSpotlight: (allowed: boolean) => void } | undefined> = new Map()
	private expanded: Set<EventTarget> = new Set()
	@Element() element: HTMLSmoothlyTableElement
	@Prop({ mutable: true, reflect: true }) root = true
	@Prop({ reflect: true }) align: "middle" | "bottom" | "top" = "middle"
	@Event() smoothlyNestedTable: EventEmitter<() => void>
	@Event() smoothlySpotlightChange: EventEmitter<{ allowSpotlight: boolean; owner?: EventTarget }>
	@Event() smoothlyTableLoad: EventEmitter<(owner: EventTarget) => void>
	componentWillLoad() {
		this.smoothlyNestedTable.emit(() => (this.root = false))
		this.smoothlyTableLoad.emit((owner: EventTarget) => (this.owner = owner))
	}
	@Listen("smoothlyExpandableLoad")
	handleExpandableLoaded(event: CustomEvent<{ allowSpotlight: (allowed: boolean) => void }>) {
		event.stopPropagation()
		event.target && this.expandable.set(event.target, event.detail)
	}
	@Listen("smoothlyExpandableChange")
	handleExpandableState(event: CustomEvent<boolean>) {
		event.stopPropagation()
		event.target && (event.detail ? this.expanded.add(event.target) : this.expanded.delete(event.target))
		this.smoothlySpotlightChange.emit({ allowSpotlight: !this.expanded.size, owner: this.owner })
	}
	@Listen("smoothlySpotlightChange")
	handleSpotlightState(event: CustomEvent<{ allowSpotlight: boolean; owner?: EventTarget }>) {
		event.target != this.element &&
			(event.stopPropagation(),
			event.detail.owner && this.expandable.get(event.detail.owner)?.allowSpotlight(event.detail.allowSpotlight))
	}
	@Listen("smoothlyNestedTable")
	handleNestedTable(event: CustomEvent<() => void>) {
		event.target != this.element && (event.stopPropagation(), event.detail())
	}
	@Listen("smoothlyExpansionLoad")
	@Listen("smoothlyExpansionOpen")
	handleEvents(event: Event) {
		event.stopPropagation()
	}
	render() {
		return [<slot></slot>]
	}
}
