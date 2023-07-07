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
		this.template = Array.from(this.element.childNodes).filter(childNode => childNode.nodeName == "SMOOTHLY-INPUT")

		console.log("Nodetemplate", this.template)
	}

	addInputs(event: MouseEvent) {
		this.counter++
		console.log(this.counter)
	}
	render() {
		const multiple = Array.from({ length: this.counter }, (_, index) =>
			this.template.reduce<Node[]>((result, node) => {
				const clonedNode = node.cloneNode(true)

				result.push(clonedNode)
				return result
			}, [])
		).flat()
		console.log("multiple", multiple)

		return (
			<Host>
				<slot name="inputs" />

				<smoothly-slot-elements nodes={multiple} clone={false}></smoothly-slot-elements>

				<smoothly-button type="button" onClick={e => this.addInputs(e)}>
					<smoothly-icon name="add-circle" />
				</smoothly-button>
			</Host>
		)
	}
}
