// tslint:disable-next-line: no-implicit-dependencies
import { Component, Prop, h } from "@stencil/core"

@Component({
	tag: "smoothly-banner",
	styleUrl: "style.css",
})

export class Banner {
	@Prop() title: string
	render() {
		return [
			<header>
				<h1>{ this.title }</h1>
			</header>,
		]
	}
}
