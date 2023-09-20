import { Component, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core"
import "urlpattern-polyfill"
import { Icon } from "../../icon/Icon"

@Component({
	tag: "smoothly-app-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppRoom {
	@Prop() label?: string
	@Prop() icon?: Icon
	@Prop() path: string | URLPattern = ""
	@Prop() to?: string
	@Prop({ reflect: true, mutable: true }) selected?: boolean
	@Event() smoothlyRoomSelected: EventEmitter
	@Event() smoothlyRoomLoaded: EventEmitter
	private contentElement?: HTMLElement

	componentWillLoad() {
		if ((typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(window.location))
			this.smoothlyRoomSelected.emit()
		else
			this.smoothlyRoomLoaded.emit()
	}

	@Method()
	async getContent(): Promise<HTMLElement | undefined> {
		return this.contentElement
	}

	render() {
		return (
			<Host>
				<li>
					<a
						href={typeof this.path == "string" ? this.path : this.path.pathname}
						onClick={(event: PointerEvent) => {
							if (!event.metaKey && !event.ctrlKey && event.which != 2 && event.button != 1) {
								event.preventDefault()
								this.smoothlyRoomSelected.emit()
							}
						}}>
						{this.icon ? <smoothly-icon name={this.icon} toolTip={this.label}></smoothly-icon> : this.label}
					</a>
				</li>
				<main ref={e => (this.contentElement = e)}>
					<slot></slot>
				</main>
			</Host>
		)
	}
}
