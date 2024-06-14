import { Component, Element, Event, EventEmitter, h, Prop, Watch } from "@stencil/core"

@Component({
	tag: "smoothly-0-accordion-item",
	styleUrl: "style.css",
	scoped: true,
})
export class Smoothly0AccordionItem {
	@Prop() name: string
	@Prop() brand?: string | string[]
	@Prop({ mutable: true, reflect: true }) open?: boolean
	@Element() me: HTMLElement
	@Event() smoothlyAccordionItemDidLoad!: EventEmitter<void>
	@Event() smoothlyAccordionItemDidUnload!: EventEmitter<void>
	@Event() smoothlyOpen!: EventEmitter<{ name: string; open: boolean }>
	@Event() smoothlyClose!: EventEmitter<{ name: string; open: boolean }>
	@Watch("open")
	openChanged(isChecked: boolean) {
		this.open = isChecked
		if (isChecked) {
			this.smoothlyOpen.emit({
				open: true,
				name: this.name,
			})
		}
	}
	componentDidLoad() {
		const summary = this.me.getElementsByTagName("summary")
		if (summary.length > 0) {
			const onClick = (e: UIEvent) => {
				if (this.open)
					this.smoothlyClose.emit({ open: this.open, name: this.name })
				else
					this.open = true
				e.preventDefault()
			}
			summary[0].addEventListener("click", onClick)
			summary[0].addEventListener("touch", onClick)
		}
		this.smoothlyAccordionItemDidLoad.emit()
	}
	disconnectedCallback() {
		this.smoothlyAccordionItemDidUnload.emit()
	}
	render() {
		return (
			<details open={this.open}>
				<summary>
					{this.open ? (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path d="M256 48C141.6 48 48 141.6 48 256s93.6 208 208 208 208-93.6 208-208S370.4 48 256 48zm-42.7 318.9L106.7 260.3l29.9-29.9 76.8 76.8 162.1-162.1 29.9 29.9-192.1 191.9z" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path d="M256 48C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.399c-91.518 0-166.399-74.882-166.399-166.399S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.399 256 422.399z" />
						</svg>
					)}
					{this.name}
					{typeof this.brand == "string" ? (
						<span class={this.brand.toLowerCase()}>{this.brand}</span>
					) : Array.isArray(this.brand) ? (
						this.brand.map(b => <span class={b.toLowerCase()}>{b}</span>)
					) : (
						[]
					)}
				</summary>
				<fieldset disabled={!this.open} name={this.name}>
					<slot />
				</fieldset>
			</details>
		)
	}
}
