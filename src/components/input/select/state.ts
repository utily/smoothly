type State =
	| "closed"
	| "open:idle" // open, no filter
	| "open:filtering" // open, filter active

type Event =
	| { type: "OPEN" }
	| { type: "CLOSE" }
	| { type: "NAVIGATE"; dir: 1 | -1 }
	| { type: "SELECT" }
	| { type: "FILTER_START" }
	| { type: "FILTER_CLEAR" }
	| { type: "ESCAPE" }

export function transition(state: State, event: Event): State {
	switch (state) {
		case "closed":
			switch (event.type) {
				case "OPEN":
				case "NAVIGATE":
					return "open:idle"
				default:
					return state
			}

		case "open:idle":
			switch (event.type) {
				case "CLOSE":
					return "closed"
				case "FILTER_START":
					return "open:filtering"
				case "ESCAPE":
					return "closed"
				default:
					return state
			}

		case "open:filtering":
			switch (event.type) {
				case "FILTER_CLEAR":
					return "open:idle"
				case "ESCAPE":
					return "open:idle"
				case "CLOSE":
					return "closed"
				default:
					return state
			}
	}
}
