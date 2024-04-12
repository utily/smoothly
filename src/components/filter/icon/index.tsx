import { Component, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core"
import { selectively } from "selectively"

@Component({
	tag: "smoothly-filter-icon",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyFilterIcon {
	@Prop({ reflect: true }) icon: "enter" | "exit" | "download" | "share" | "repeat" | "card" | "close-circle" | "trash"
	@Prop({ reflect: true }) property: string
	@Prop({ reflect: true }) flip = false
	@Prop() value: string | number
	@Prop() toolTip: string
	@Prop() comparison: "includes" | "less" | "greater" = "includes"
	@Prop({ mutable: true, reflect: true }) active = false
	@Event() filter: EventEmitter<{ type: string; criteria: selectively.Criteria | undefined }>

	activeHandler() {
		const value = this.active ? this.value : ""
		let criteria: selectively.Criteria
		switch (this.comparison) {
			case "less":
				criteria = selectively.lesserThan(value)
				break
			case "greater":
				criteria = selectively.greaterThan(value)
				break
			default:
			case "includes":
				criteria = selectively.includes(value.toString())
				break
		}
		const result: selectively.Criteria = this.property
			.split(".")
			.reverse()
			.reduce<selectively.Criteria>((previousValue, currentValue) => ({ [currentValue]: previousValue }), criteria)
		this.filter.emit({ type: "icon", criteria: result })
	}

	@Method()
	async clear(): Promise<void> {
		this.active = false
	}
	render() {
		return (
			<Host>
				<div class="icon">
					<smoothly-icon
						fill="clear"
						color={this.active ? "success" : "medium"}
						name={this.active ? `${this.icon}` : `${this.icon}-outline`}
						onClick={() => ((this.active = !this.active), this.activeHandler())}
						toolTip={this.toolTip}
					/>
				</div>
			</Host>
		)
	}
}
