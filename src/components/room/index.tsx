import { Component, ComponentDidLoad, Event, EventEmitter, h, Prop } from "@stencil/core"

@Component({
	tag: "smoothly-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyRoom implements ComponentDidLoad {
	@Prop() label?: string
	@Prop() icon?: string
	@Prop() path: string
	@Prop() to?: string
	@Prop({ reflect: true }) selected?: boolean
	@Event() smoothlyRoomSelected: EventEmitter<HTMLElement>
	contentElement: HTMLElement

	componentDidLoad(): void | Promise<void> {
		this.smoothlyRoomSelected.emit(this.contentElement)
	}
	render() {
		return [
			<li>
				<a
					href={this.path}
					onClick={(event: PointerEvent) => {
						if (!event.metaKey && !event.ctrlKey && event.which != 2 && event.button != 1) {
							event.preventDefault()
							this.selected = true
							this.smoothlyRoomSelected.emit(this.contentElement)
						}
					}}>
					{this.icon ? <smoothly-icon name={this.icon} toolTip={this.label} size="medium"></smoothly-icon> : this.label}
				</a>
			</li>,
			<content ref={(e: HTMLElement) => (this.contentElement = e)}>
				<slot></slot>
			</content>,
		]
	}
}
