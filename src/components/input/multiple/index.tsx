import { Component, Element, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-multiple-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyMultipleInput {
	@Element() element: HTMLSmoothlyMultipleInputElement
	@State() counter = 0

	@Prop() name: string
	@Prop() default: number
	@State() template: Node[]

	componentDidLoad() {
		this.template = Array.from(this.element.childNodes).filter(childNode => childNode.nodeName == "SHADOW-WRAP")

		console.log("template", this.template)
	}

	addInputs(event: MouseEvent) {
		this.counter++
		console.log(this.counter)
	}
	render() {
		const multiple = Array.from({ length: this.counter }, (_, index) =>
			this.template.reduce<Node[]>((result, node) => {
				const clonedNode = node.cloneNode(true)
				if (clonedNode instanceof HTMLElement) {
					clonedNode.childNodes.forEach(node => {
						if (node instanceof HTMLElement) {
							const name = node.getAttribute("name")
							node.setAttribute("name", `${index}+${name}`)
						}
					})
				}
				result.push(clonedNode)
				return result
			}, [])
		).flat()
		console.log("multiple", multiple)

		return (
			<Host>
				<shadow-wrap>
					<slot />
				</shadow-wrap>
				<smoothly-slot-elements nodes={multiple}></smoothly-slot-elements>

				<smoothly-button type="button" onClick={e => this.addInputs(e)}>
					<smoothly-icon name="add-circle" />
				</smoothly-button>
			</Host>
		)
	}
}
