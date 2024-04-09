import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	Fragment,
	FunctionalComponent,
	h,
	Host,
	Method,
	Prop,
	State,
	Watch,
} from "@stencil/core"
import { JSX } from "@stencil/core/internal"
import "urlpattern-polyfill"
import global from "../../../global"
import { Icon } from "../../../model"

const Observers = global().Observers

@Component({
	tag: "smoothly-app-room",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyAppRoom implements ComponentWillLoad {
	@Element() element: HTMLElement
	@Prop({ reflect: true }) label?: string
	@Prop({ reflect: true }) icon?: Icon
	@Prop({ reflect: true }) disabled: boolean
	@Prop() path: string | URLPattern = ""
	@Prop() to?: string
	@Prop({ reflect: true, mutable: true }) selected?: boolean
	@Prop() component?: FunctionalComponent | JSX.Element | JSX.Element[]
	@Prop() spinner = false
	@State() shouldLoad = false
	@State() loaded = false
	@Event() smoothlyRoomSelected: EventEmitter<{ history: boolean }>
	@Event() smoothlyRoomLoaded: EventEmitter<{ selected: boolean }>
	private contentElement?: HTMLElement

	componentWillLoad() {
		this.selected = (typeof this.path == "string" ? new URLPattern({ pathname: this.path }) : this.path).test(
			window.location
		)
		this.smoothlyRoomLoaded.emit({ selected: this.selected })
	}

	private load(): void {
		this.shouldLoad = true
		this.unobserve()
	}
	private observe(): void {
		if (this.contentElement && !Observers.has(this.contentElement)) {
			const observer = new IntersectionObserver(entries => {
				if (entries.find(entry => entry.target == this.contentElement)?.isIntersecting)
					this.load()
			})
			Observers.set(this.contentElement, observer)
			observer.observe(this.contentElement)
		}
	}
	private unobserve(): void {
		if (this.contentElement) {
			Observers.get(this.contentElement)?.disconnect()
			Observers.remove(this.contentElement)
		}
	}

	@Watch("component")
	contentChanged(): void {
		if (!this.component)
			this.unobserve()
		else
			this.observe()
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
	referenceHandler(element?: HTMLElement) {
		this.contentElement?.removeEventListener("smoothlyLazyLoaded", this.lazyLoadedHandler)
		if (element) {
			this.contentChanged()
			this.contentElement = element
			element.addEventListener("smoothlyLazyLoaded", this.lazyLoadedHandler)
		}
	}
	/**
	 * Must be defined as arrow function.
	 * Must be added with `this.contentElement.addEventListener("smoothlyLazyLoaded", this.lazyLoadedHandler)`
	 * due to the element being moved outside of this host node.
	 */
	lazyLoadedHandler = (event: CustomEvent<boolean>) => {
		event.stopPropagation()
		this.loaded = event.detail
	}

	render() {
		return (
			<Host>
				<li>
					<a href={typeof this.path == "string" ? this.path : this.path.pathname} onClick={e => this.clickHandler(e)}>
						{this.icon ? <smoothly-icon name={this.icon} toolTip={this.label}></smoothly-icon> : this.label}
					</a>
				</li>
				<main ref={e => this.referenceHandler(e)}>
					{!this.component || !this.shouldLoad ? null : (
						<Fragment>
							{this.spinner && this.shouldLoad && !this.loaded && <smoothly-spinner active />}
							{typeof this.component == "function" ? <this.component /> : this.component}
						</Fragment>
					)}
					<slot></slot>
				</main>
			</Host>
		)
	}
}
