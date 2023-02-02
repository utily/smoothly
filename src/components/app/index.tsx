import { Component, ComponentWillLoad, h, Listen, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-app",
	styleUrl: "style.css",
	scoped: false,
})
export class SmoothlyApp implements ComponentWillLoad {
	@Prop() label = "App"
	@State() selected?: HTMLSmoothlyRoomElement
	mainElement?: HTMLElement

	componentWillLoad(): void | Promise<void> {
		const pushState = history.pushState
		history.pushState = (...argument: any[]) => {
			pushState.apply(history, ...argument)
			this.locationChangeHandler()
		}
		const replaceState = history.replaceState
		history.replaceState = (...argument: any[]) => {
			replaceState.apply(history, ...argument)
			this.locationChangeHandler()
		}
		window.addEventListener("popstate", () => this.locationChangeHandler())
	}
	locationChangeHandler() {
		alert("change")
	}

	@Listen("smoothlyRoomSelected")
	roomSelectedHandler(event: CustomEvent<HTMLElement>) {
		if (this.selected)
			this.selected.selected = false
		if ((event.target as HTMLSmoothlyRoomElement).selected || !this.selected) {
			this.selected = event.target as HTMLSmoothlyRoomElement
			if (this.mainElement) {
				this.mainElement.innerHTML = ""
				this.mainElement.appendChild(event.detail)
			}
		}
	}
	render() {
		return (
			<smoothly-notifier>
				<header>
					<h1>
						<a href={"/"}>{this.label}</a>
					</h1>
					<slot name="header"></slot>
					<nav>
						<ul>
							<slot name="nav-start"></slot>
							<slot></slot>
							<slot name="nav-end"></slot>
						</ul>
					</nav>
				</header>
				<main ref={e => (this.mainElement = e)}></main>
			</smoothly-notifier>
		)
	}
}
