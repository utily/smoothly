import { Component, Element, h, Host, Listen, Method, Prop } from "@stencil/core"
import { Color, Trigger } from "../../model"

@Component({
	tag: "smoothly-dialog",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyDialog {
	@Element() element: HTMLSmoothlyDialogElement
	@Prop({ reflect: true }) color: Color | undefined = "primary"
	@Prop({ mutable: true, reflect: true }) open = true
	@Prop({ reflect: true }) closable = false
	@Prop({ reflect: true }) header: string | undefined

	@Listen("click")
	clickHandler(event: CustomEvent<Trigger>): void {
		event.stopPropagation()
		if (event.composedPath().at(0) == this.element)
			this.close()
	}
	@Method()
	async close(): Promise<void> {
		this.open = false
	}
	render(): ReturnType<typeof Host> {
		return (
			<Host>
				<header>
					{this.closable && (
						<smoothly-button fill="clear" size="flexible" onClick={() => this.close()}>
							<smoothly-icon name="close-circle" fill="solid" color={this.color}></smoothly-icon>
						</smoothly-button>
					)}
					{this.header ? <h1>{this.header}</h1> : <slot name="header"></slot>}
				</header>
				<main>
					<slot></slot>
				</main>
			</Host>
		)
	}
}
//
