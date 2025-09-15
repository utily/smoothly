import { Component, Event, EventEmitter, h, Host, Prop, VNode, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-table-expandable-row",
	styleUrl: "style.scss",
	scoped: true,
})
export class SmoothlyTableExpandableRow {
	private detailElement?: HTMLDivElement
	private expandButton?: HTMLDivElement
	@Prop({ mutable: true, reflect: true }) open = false
	@Event() smoothlyTableExpandableRowChange: EventEmitter<boolean>

	isStacked(eventPath: EventTarget[]): boolean {
		for (const el of eventPath) {
			if (el instanceof HTMLElement && el.tagName.toLowerCase() == "smoothly-table") {
				return el.classList.contains("cards")
			}
		}
		return false
	}

	clickHandler(event: MouseEvent): void {
		const isStacked = this.isStacked(event.composedPath())
		if (isStacked) {
			const clickedOnExpandButton = this.expandButton && event.composedPath().includes(this.expandButton)
			if (clickedOnExpandButton) {
				this.open = !this.open
			}
		} else {
			const clickedOnDetail = this.detailElement && event.composedPath().includes(this.detailElement)
			if (!clickedOnDetail) {
				const selection = window.getSelection()?.toString().trim()
				if ((selection?.length ?? 0) == 0)
					this.open = !this.open
			}
		}
	}
	@Watch("open")
	openChange() {
		this.smoothlyTableExpandableRowChange.emit(this.open)
	}

	render(): VNode | VNode[] {
		return (
			<Host onClick={(e: MouseEvent) => this.clickHandler(e)}>
				<slot />
				<div class={"detail"} ref={e => (this.detailElement = e)}>
					<slot name="detail" />
				</div>
				<div ref={e => (this.expandButton = e)} class="smoothly-expand-button"></div>
			</Host>
		)
	}
}
