// TODO: Should be imported with
// import * as model from "../model/index"
// But test fails because of test not handling ESM-module of imported libraries.
import { Listenable } from "./Listenable"

describe("Listenable", () => {
	class State {
		disabled = false
	}
	it("load", () => {
		const state = Listenable.load(new State())
		expect(typeof state.listen).toEqual("function")
		expect(typeof state.unlisten).toEqual("function")
		expect(state.disabled).toEqual(false)
	})
	it("subscribe", () => {
		const state = Listenable.load(new State())
		class FakeComponent {
			disabled: boolean
			constructor() {
				this.componentWillLoad()
			}
			componentWillLoad() {
				state.listen("disabled", disabled => (this.disabled = disabled))
			}
		}
		const components = [new FakeComponent(), new FakeComponent()]
		expect(components.every(component => !component.disabled))
		state.disabled = true
		expect(components.every(component => component.disabled)).toEqual(true)
	})
	it("unsubscribe", () => {
		const state = Listenable.load(new State())
		let count = 0
		class FakeComponent {
			disabled: boolean
			constructor() {
				this.subscribe = this.subscribe.bind(this)
				this.componentWillLoad()
			}
			subscribe(disabled: boolean) {
				count += 1
				this.disabled = disabled
			}
			componentWillLoad() {
				state.listen("disabled", this.subscribe)
			}
			disconnectedCallback() {
				state.unlisten("disabled", this.subscribe)
			}
		}
		const component = new FakeComponent()
		expect(count).toEqual(1)
		state.disabled = true
		expect(count).toEqual(2)
		component.disconnectedCallback()
		state.disabled = false
		expect(count).toEqual(2)
	})
})
