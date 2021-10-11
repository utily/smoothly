import { Component, Element, h, Host, Listen } from "@stencil/core"

@Component({
	tag: "smoothly-table-row",
	styleUrl: "style.css",
	scoped: true,
})
export class TableRow {
	@Element() element: HTMLSmoothlyTableRowElement
	expansions: HTMLTableRowElement[] = []

	@Listen("expansionOpen")
	onDetailsLoaded(event: CustomEvent<HTMLElement | undefined>) {
		if (event.detail) {
			console.log(event.detail)
			this.element.after(event.detail)
		}
	}
	render() {
		return (
			<Host>
				<slot></slot>
			</Host>
		)
	}
}
