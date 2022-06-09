import { Component, Event, EventEmitter, h, Host, Listen, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-table-header",
	styleUrl: "style.css",
	scoped: true,
})
export class TableHeader {
	@Prop() name: string
	@Prop({ mutable: true }) sortDirection?: "ascending" | "descending" = "ascending"
	@Event() sort: EventEmitter<{ property: string; direction: "ascending" | "descending" }>
	@Listen("click")
	onClick(event: MouseEvent) {
		this.sort.emit({
			property: this.name,
			direction: (this.sortDirection = this.sortDirection == "ascending" ? "descending" : "ascending"),
		})
		event.preventDefault()
		event.stopPropagation()
	}
	render() {
		return (
			<Host>
				<slot></slot>
				{this.renderSortIcon()}
			</Host>
		)
	}
	private renderSortIcon(): any {
		let result: any | undefined
		switch (this.sortDirection) {
			case "ascending":
				result = <ion-icon name="chevron-up-outline" class="sort-icon"></ion-icon>
				break
			case "descending":
				result = <ion-icon name="chevron-down-outline" class="sort-icon"></ion-icon>
				break
		}
		return result
	}
}
