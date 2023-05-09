import { Component, ComponentDidLoad, Event, EventEmitter, h, Prop } from "@stencil/core"
import "urlpattern-polyfill"
import { Icon } from "../../icon/Icon"

@Component({
	tag: "smoothly-app-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppRoom implements ComponentDidLoad {
	@Prop() label?: string
	@Prop() icon?: Icon
	@Prop() path: string | URLPattern = ""
	@Prop() to?: string
	@Prop({ reflect: true }) selected?: boolean
	@Event() smoothlyRoomSelected: EventEmitter<HTMLElement>
	@Event() smoothlyRoomLoaded: EventEmitter<HTMLElement>
	contentElement: HTMLElement

	componentDidLoad(): void | Promise<void> {
		if ((typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(window.location))
			this.smoothlyRoomSelected.emit(this.contentElement)
		else
			this.smoothlyRoomLoaded.emit(this.contentElement)
	}
	render() {
		return [
			<li>
				<a
					href={typeof this.path == "string" ? this.path : this.path.pathname}
					onClick={(event: PointerEvent) => {
						if (!event.metaKey && !event.ctrlKey && event.which != 2 && event.button != 1) {
							event.preventDefault()
							this.smoothlyRoomSelected.emit(this.contentElement)
						}
					}}>
					{this.icon ? <smoothly-icon name={this.icon} toolTip={this.label}></smoothly-icon> : this.label}
				</a>
			</li>,
			<main ref={(e: HTMLElement) => (this.contentElement = e)}>
				<slot></slot>
			</main>,
		]
	}
}
