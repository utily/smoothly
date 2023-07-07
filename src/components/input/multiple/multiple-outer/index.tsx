import { Component, Element, FunctionalComponent, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-multiple-outer-input",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyMultipleOuterInput {
	@Element() element: HTMLSmoothlyMultipleInputElement
	@State() counter = 0

	@Prop() name: string
	@Prop() default: number
	@State() template: string[]

	componentDidLoad() {
		this.template = Array.from(this.element.children)
			.map(value => value.outerHTML.replace(/<!---->/, ""))
			.filter(node => node.startsWith("<smoothly-input"))
		console.log("outerhtml", this.template)
	}

	addInputs(event: MouseEvent) {
		this.counter++
		console.log(this.counter)
	}
	render() {
		const multiple = Array.from({ length: this.counter }, (_, index) =>
			this.template.reduce<string[]>((result, node) => {
				if (node.startsWith("<smoothly-input"))
					result.push(node)
				return result
			}, [])
		).flat()
		console.log("Outermultiple", multiple)

		return (
			<Host>
				<Wrapper>
					<slot />
				</Wrapper>

				<smoothly-multiple-slot-elements nodes={multiple}></smoothly-multiple-slot-elements>

				<smoothly-button type="button" onClick={e => this.addInputs(e)}>
					<smoothly-icon name="add-circle" />
				</smoothly-button>
			</Host>
		)
	}
}
const Wrapper: FunctionalComponent = (props, children) => {
	console.log("children", children)
	return children
}
