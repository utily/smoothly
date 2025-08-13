import {
	Component,
	Event,
	EventEmitter,
	FunctionalComponent,
	h,
	Host,
	Listen,
	Method,
	Prop,
	VNode,
} from "@stencil/core"
import "urlpattern-polyfill"
import { Icon } from "../../../model"

@Component({
	tag: "smoothly-app-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppRoom {
	private query?: string
	@Prop({ reflect: true }) label?: string
	@Prop({ reflect: true }) icon?: Icon
	@Prop({ reflect: true }) disabled: boolean
	@Prop() path: string | URLPattern = ""
	@Prop({ reflect: true, mutable: true }) selected?: boolean
	@Prop() content?: VNode | FunctionalComponent
	@Event() smoothlyRoomSelect: EventEmitter<{ history: boolean; query?: string }>
	@Event() smoothlyRoomLoad: EventEmitter<{ selected: boolean }>
	@Event() smoothlyUrlChange: EventEmitter<string>
	private contentElement?: HTMLElement
	componentDidRender() {
		this.selected && this.smoothlyUrlChange.emit(window.location.href)
	}
	componentWillLoad() {
		this.selected = (typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(
			window.location
		)
		this.smoothlyRoomLoad.emit({ selected: this.selected })
		this.selected && window.history.replaceState({ smoothlyPath: this.path }, "", window.location.href)
	}
	@Method()
	async getContent(): Promise<HTMLElement | undefined> {
		return this.contentElement
	}
	@Method()
	async setSelected(selected: boolean, options?: { history?: boolean }): Promise<void> {
		this.selected = selected
		if (selected) {
			this.smoothlyRoomSelect.emit({ history: !!options?.history, query: this.query })
		}
	}
	@Listen("smoothlyUrlUpdate", { target: "window" })
	async setQuery(event: CustomEvent<{ query?: string; path: string }>): Promise<void> {
		if (event.detail.path == this.path && this.query != event.detail.query) {
			this.query = event.detail.query
			window.history.pushState(
				{ smoothlyPath: this.path, smoothlyQuery: this.query },
				"",
				`${window.location.pathname}${this.query ? `?${this.query}` : ""}`
			)
			this.smoothlyUrlChange.emit(window.location.href)
		}
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
						{this.icon && <smoothly-icon name={this.icon} />}
						{this.label && <span class="label">{this.label}</span>}
					</a>
				</li>
				<div ref={e => (this.contentElement = e)}>
					{this.content && <smoothly-lazy content={this.content} />}
					<slot />
				</div>
			</Host>
		)
	}
}
