import { Component, Element, Prop, Listen, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-accordion",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAccordion {
	private items: HTMLSmoothlyAccordionItemElement[] = []
	@Element() me: HTMLElement
	@Prop({ mutable: true }) value?: string
	@Watch("value")
	valueChanged(value: string | undefined) {
		this.updateItems()
	}
	@Listen("smoothlySelect")
	@Listen("smoothlyDeselect")
	handleSelect(event: CustomEvent<{ name: string, checked: boolean }>) {
		console.log(event)
		if (event.detail.checked)
			this.value = event.detail.name
		else if (this.value == event.detail.name)
			this.value = undefined
	}
	@Listen("smoothlyAccordionItemDidLoad")
	onAccordionItemDidLoad(ev: Event) {
		const item = ev.target as HTMLSmoothlyAccordionItemElement
		this.items.push(item)
		if (this.value == undefined && item.checked)
			this.value = item.name
		else
			this.updateItems()
	}
	@Listen("smoothlyAccordionItemDidUnload")
	onAccordionItemDidUnload(ev: Event) {
		const index = this.items.indexOf(ev.target as HTMLSmoothlyAccordionItemElement)
		if (index > -1)
			this.items.splice(index, 1)
	}
	componentDidLoad() {
		this.updateItems()
	}
	private updateItems() {
		console.log("checked: " + this.value)
		let hasChecked = false
		for (const item of this.items)
			if (item.checked = (!hasChecked && item.name == this.value))
				hasChecked = true
	}

	render() {
		return [
			<slot></slot>,
		]
	}
}
