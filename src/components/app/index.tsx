import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { SmoothlyAppRoomCustomEvent } from "../../components"
import { Color } from "../../model"

type Room = {
	element: HTMLSmoothlyAppRoomElement
}
@Component({
	tag: "smoothly-app",
	styleUrl: "style.css",
	scoped: false,
})
export class SmoothlyApp {
	@Prop({ reflect: true }) label?: string
	@Prop() color: Color
	@Prop() home?: string
	@Prop({ mutable: true, reflect: true }) menuOpen = false
	@Prop({ reflect: true }) navBreakpoint: `${number}${"px" | "em" | "rem"}` = "48rem"
	@State() mobileMode = false
	@State() selected?: Room
	@Event() smoothlyUrlChange: EventEmitter<string>
	private burgerElement?: HTMLSmoothlyBurgerElement
	private navElement?: HTMLElement
	mainElement?: HTMLElement
	rooms: Record<string, Room | undefined> = {}

	componentWillLoad() {
		const mediaQuery = window.matchMedia(`(max-width: ${this.navBreakpoint})`)
		this.mobileMode = mediaQuery.matches
		mediaQuery.addEventListener("change", e => this.updateMobileMode(e.matches))
	}
	componentDidLoad() {
		this.updateMobileMode(this.mobileMode)
	}
	updateMobileMode(mobileMode: boolean) {
		console.log("media query changed", mobileMode)
		this.mobileMode = mobileMode
		Object.values(this.rooms).forEach(room => room?.element.setMobileMode(mobileMode))
		this.burgerElement?.setMobileMode(mobileMode)
	}

	async componentDidRender() {
		if (!this.selected && !window.location.search)
			(this.home && this.rooms[this.home]
				? this.rooms[this.home]
				: Object.values(this.rooms).find(room => !room?.element.disabled)
			)?.element.setSelected(true)
	}
	@Method()
	async selectRoom(path: string) {
		this.rooms[path]?.element.setSelected(true)
	}
	@Watch("selected")
	async selectedChanged() {
		Object.values(this.rooms).forEach(
			room => room?.element.path != this.selected?.element.path && room?.element.setSelected(false)
		)
		const content = await this.selected?.element.getContent()
		requestAnimationFrame(() => {
			if (this.mainElement && content)
				this.mainElement.replaceChildren(content)
		})
	}
	@Listen("popstate", { target: "window" })
	async locationChangeHandler(event: PopStateEvent) {
		this.rooms[event.state.smoothlyPath]?.element.setSelected(true, { history: true })
		this.smoothlyUrlChange.emit(window.location.href)
	}
	@Listen("smoothlyRoomSelect")
	roomSelectedHandler(event: SmoothlyAppRoomCustomEvent<{ history: boolean; query?: string }>) {
		this.selected = { element: event.target }
		if (this.mobileMode)
			this.menuOpen = false
		if (!event.detail.history) {
			const path = this.selected.element.path.toString()
			const location = new URL(window.location.pathname == path ? window.location.href : window.location.origin)
			location.pathname = path
			location.search = event.detail.query ? `?${event.detail.query}` : ""
			window.history.pushState({ smoothlyPath: path, smoothlyQuery: event.detail.query || "" }, "", location.href)
		}
	}
	@Listen("smoothlyRoomLoad")
	roomLoadedHandler(event: SmoothlyAppRoomCustomEvent<{ selected: boolean }>) {
		const room = (this.rooms[event.target.path.toString()] = { element: event.target })
		if (room.element.selected) {
			this.selected = room
		}
	}
	@Listen("click", { target: "window" })
	clickHandler(event: MouseEvent) {
		if (this.mobileMode && !event.composedPath().some(e => e == this.burgerElement || e == this.navElement))
			this.menuOpen = false
	}
	render() {
		return (
			<Host class={{ "smoothly-mobile-mode": this.mobileMode }}>
				<smoothly-notifier>
					<header color={this.color}>
						<h1>
							<a href={""}>{this.label}</a>
						</h1>
						<slot name="header" />
						<nav ref={e => (this.navElement = e)}>
							<ul>
								<div class={"nav-start-container"}>
									<slot name="nav-start" />
								</div>
								<slot />
								<div class={"nav-end-container"}>
									<slot name="nav-end" />
								</div>
							</ul>
						</nav>
						<smoothly-burger
							ref={e => (this.burgerElement = e)}
							open={this.menuOpen}
							onSmoothlyNavStatus={e => (e.stopPropagation(), (this.menuOpen = e.detail))}
						/>
					</header>
					<main ref={e => (this.mainElement = e)} />
				</smoothly-notifier>
			</Host>
		)
	}
}
