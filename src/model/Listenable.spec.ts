import { Listenable } from "./Listenable"

describe("Listenable", () => {
	class State {
		disabled = false
	}
	const state = Listenable.load(new State())
	it("load", () => {
		class FakeComponent {
			disabled: boolean
			constructor() {
				state.listen("disabled", value => (this.disabled = value))
			}
		}
		const components = [new FakeComponent(), new FakeComponent()]
		expect(components.every(component => !component.disabled))
		state.disabled = true
		expect(components.every(component => component.disabled)).toEqual(true)
	})
})
