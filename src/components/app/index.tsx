import { Component, h, Listen, Method, Prop, State, Watch } from "@stencil/core"
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
	@Prop() testPropToSeeIfComponentsDTsReactsWhenNotUpdated?: string
	@Prop() home?: string
	@Prop({ mutable: true, reflect: true }) menuOpen = false
	@State() selected?: Room
	private burgerVisibility: boolean
	private burgerElement?: HTMLElement
	private navElement?: HTMLElement
	mainElement?: HTMLElement
	rooms: Record<string, Room | undefined> = {}
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
		if (this.mainElement && content) {
			this.mainElement.innerHTML = ""
			this.mainElement.appendChild(content)
		}
	}
	burgerVisibilityHandler(event: CustomEvent<boolean>) {
		this.burgerVisibility = event.detail
	}
	burgerStatusHandler(event: CustomEvent<boolean>) {
		event.stopPropagation()
		this.menuOpen = event.detail
	}
	@Listen("popstate", { target: "window" })
	async locationChangeHandler(event: PopStateEvent) {
		this.rooms[event.state.smoothlyPath]?.element.setSelected(true, { history: true })
	}
	@Listen("smoothlyRoomSelected")
	roomSelectedHandler(event: SmoothlyAppRoomCustomEvent<{ history: boolean }>) {
		this.selected = { element: event.target }
		if (this.burgerVisibility)
			this.menuOpen = false
		if (!event.detail.history) {
			const path = this.selected.element.path.toString()
			const location = new URL(window.location.pathname == path ? window.location.href : window.location.origin)
			location.pathname = path
			window.history.pushState({ smoothlyPath: path }, "", location.href)
		}
	}
	@Listen("smoothlyRoomLoaded")
	roomLoadedHandler(event: SmoothlyAppRoomCustomEvent<{ selected: boolean }>) {
		const room = (this.rooms[event.target.path.toString()] = { element: event.target })
		if (room.element.selected) {
			this.selected = room
			window.history.replaceState({ smoothlyPath: room.element.path }, "", window.location.href)
		}
	}
	@Listen("click", { target: "window" })
	clickHandler(event: MouseEvent) {
		if (this.burgerVisibility)
			if (event.composedPath().some(e => e == this.burgerElement || e == this.navElement))
				!this.menuOpen
			else
				this.menuOpen = false
	}
	render() {
		return (
			<smoothly-notifier>
				<header color={this.color}>
					<h1>
						<a href={""}>{this.label}</a>
					</h1>
					<slot name="header" />
					<nav ref={e => (this.navElement = e)} class={{ "menu-open": this.menuOpen }}>
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
						onSmoothlyNavStatus={e => this.burgerStatusHandler(e)}
						onSmoothlyVisibleStatus={e => this.burgerVisibilityHandler(e)}
					/>
				</header>
				<main ref={e => (this.mainElement = e)} />
			</smoothly-notifier>
		)
	}
}
