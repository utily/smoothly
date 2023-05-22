import { Component, h, Listen, Prop, State, Watch } from "@stencil/core"
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
	@Prop() label = "App"
	@Prop() color: Color
	@Prop({ mutable: true, reflect: true }) menuOpen = false
	@State() selected?: Room
	mainElement?: HTMLElement
	rooms: Record<string, Room> = {}

	@Watch("selected")
	async selectedChanged(value: Room | undefined, previous: Room | undefined) {
		if (previous) {
			previous.element.selected = false
		}
		if (value) {
			value.element.selected = true
			const path = value.element.path.toString()
			this.rooms[path] = value

			history.pushState({ smoothlyPath: path }, value.element.label ?? "", path)

			if (this.mainElement) {
				this.mainElement.innerHTML = ""
				this.mainElement.appendChild(await value.element.getContent())
			}
		}
	}
	@Listen("burgerStatus")
	burgerStatusHandler(event: CustomEvent) {
		event.stopPropagation()
		this.menuOpen = event.detail ? true : false
	}
	@Listen("popstate", { target: "window" })
	async locationChangeHandler(event: PopStateEvent) {
		if (typeof event.state.smoothlyPath != "string" && event.state.smoothlyPath !== this.selected?.element.path) {
			this.selected = this.rooms[event.state.smoothlyPath]
		}
		if (this.mainElement) {
			this.mainElement.innerHTML = ""
			this.mainElement.appendChild(await this.rooms[event.state.smoothlyPath].element.getContent())
		}
	}
	@Listen("smoothlyRoomSelected")
	roomSelectedHandler(event: SmoothlyAppRoomCustomEvent<HTMLSmoothlyAppRoomElement>) {
		this.selected = { element: event.target }
	}
	@Listen("smoothlyRoomLoaded")
	roomLoadedHandler(event: SmoothlyAppRoomCustomEvent<HTMLSmoothlyAppRoomElement>) {
		this.rooms[event.target.path.toString()] = { element: event.target }
	}
	render() {
		return (
			<smoothly-notifier>
				<header color={this.color}>
					<h1>
						<a href={""}>{this.label}</a>
					</h1>
					<slot name="header"></slot>
					<nav class={this.menuOpen.toString()}>
						<ul>
							<slot name="nav-start"></slot>
							<slot> </slot>
							<slot name="nav-end"></slot>
						</ul>
					</nav>
					<smoothly-burger></smoothly-burger>
				</header>
				<main ref={e => (this.mainElement = e)}></main>
			</smoothly-notifier>
		)
	}
}
