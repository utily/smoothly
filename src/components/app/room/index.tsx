import { Component, Event, EventEmitter, FunctionalComponent, h, Host, Method, Prop, VNode } from "@stencil/core"
import "urlpattern-polyfill"
import { Icon } from "../../../model"

@Component({
	tag: "smoothly-app-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppRoom {
	@Prop({ reflect: true }) label?: string
	@Prop({ reflect: true }) icon?: Icon
	@Prop({ reflect: true }) disabled: boolean = false
	@Prop() path: string | URLPattern = ""
	@Prop({ reflect: true, mutable: true }) selected: boolean = false
	@Prop() content?: VNode | FunctionalComponent
	@Event() smoothlyRoomSelect: EventEmitter<{ history: boolean }>
	@Event() smoothlyRoomLoad: EventEmitter<{ selected: boolean }>
	private contentElement?: HTMLElement

	componentWillLoad() {
		this.selected = (typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(
			window.location
		)
		this.smoothlyRoomLoad.emit({ selected: this.selected })
	}
	@Method()
	async getContent(): Promise<HTMLElement | undefined> {
		return this.contentElement
	}
	@Method()
	async setSelected(selected: boolean, options?: { history?: boolean }): Promise<void> {
		this.selected = selected
		if (selected)
			this.smoothlyRoomSelect.emit({ history: !!options?.history })
	}

	render() {
		return (
			<Host>
				<div ref={e => (this.contentElement = e)}>
					{this.content && <smoothly-lazy content={this.content} />}
					<slot />
				</div>
			</Host>
		)
	}
}
