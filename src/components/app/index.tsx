import { Component, h, Listen, Prop, State, Watch } from "@stencil/core"
import { Color } from "../../model"

interface Selected {
	room: HTMLSmoothlyAppRoomElement
	content: HTMLElement
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
	@State() selected?: Selected
	mainElement?: HTMLElement
	rooms: Record<string, Selected> = {}

	@Watch("selected")
	selectedChanged(value: Selected | undefined, previous: Selected | undefined) {
		if (previous) {
			previous.room.selected = false
		}
		if (value) {
			value.room.selected = true
			const path = value.room.path.toString()
			this.rooms[path] = value

			history.pushState({ smoothlyPath: path }, value.room.label ?? "", path)

			if (this.mainElement) {
				this.mainElement.innerHTML = ""
				this.mainElement.appendChild(value.content)
			}
		}
	}

	@Listen("burgerStatus")
	burgerStatusHandler(event: CustomEvent) {
		event.stopPropagation()
		this.menuOpen = event.detail ? true : false
	}

	@Listen("popstate", { target: "window" })
	locationChangeHandler(event: PopStateEvent) {
		if (typeof event.state.smoothlyPath != "string" && event.state.smoothlyPath !== this.selected?.room.path) {
			this.selected = this.rooms[event.state.smoothlyPath]
		}
		if (this.mainElement) {
			this.mainElement.innerHTML = ""
			this.mainElement.appendChild(this.rooms[event.state.smoothlyPath].content)
		}
	}

	@Listen("smoothlyRoomSelected")
	roomSelectedHandler(event: CustomEvent<HTMLElement>) {
		this.selected = { room: event.target as HTMLSmoothlyAppRoomElement, content: event.detail }
	}

	render() {
		return (
			<smoothly-notifier>
				<header color={this.color}>
					<h1>
						<a href={""}>{this.label}</a>
					</h1>
					<slot name="header"></slot>
					<nav>
						<ul class={this.menuOpen.toString()}>
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
