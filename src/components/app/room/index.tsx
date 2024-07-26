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
	@Prop({ reflect: true }) disabled: boolean
	@Prop() path: string | URLPattern = ""
	@Prop({ reflect: true, mutable: true }) selected?: boolean
	@Prop() content?: VNode | FunctionalComponent
	@Event() smoothlyRoomSelected: EventEmitter<{ history: boolean }>
	@Event() smoothlyRoomLoaded: EventEmitter<{ selected: boolean }>
	private contentElement?: HTMLElement

	componentWillLoad() {
		this.selected = (typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(
			window.location
		)
		this.smoothlyRoomLoaded.emit({ selected: this.selected })
	}

	@Method()
	async getContent(): Promise<HTMLElement | undefined> {
		return this.contentElement
	}
	@Method()
	async setSelected(selected: boolean, options?: { history?: boolean }): Promise<void> {
		this.selected = selected
		if (selected)
			this.smoothlyRoomSelected.emit({ history: !!options?.history })
	}

	clickHandler(event: MouseEvent) {
		if (!event.metaKey && !event.ctrlKey && event.which != 2 && event.button != 1) {
			event.preventDefault()
			this.setSelected(true)
		}
	}

	render() {
		return (
			<Host>
				<li>
					<a href={typeof this.path == "string" ? this.path : this.path.pathname} onClick={e => this.clickHandler(e)}>
						{this.icon ? <smoothly-icon name={this.icon} toolTip={this.label}></smoothly-icon> : this.label}
					</a>
				</li>
				<div ref={e => (this.contentElement = e)}>
					{this.content && <smoothly-lazy content={this.content} />}
					<slot></slot>
				</div>
			</Host>
		)
	}
}
