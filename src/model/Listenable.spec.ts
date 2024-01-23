// TODO: Should be imported with
// import * as model from "../model/index"
// But test fails because of test not handling ESM-module of imported libraries.
import { Listenable, WithListenable } from "./Listenable"
import { StateBase } from "./StateBase"

describe("Listenable", () => {
	async function sleep(duration: number): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, duration))
	}
	class State extends StateBase<State> {
		get foo() {
			return "bar"
		}
		disabled = false
		static create() {
			return Listenable.load(new State())
		}
	}
	it("load", () => {
		const state = State.create()
		expect(typeof state.listen).toEqual("function")
		expect(typeof state.unlisten).toEqual("function")
		expect(state.disabled).toEqual(false)
	})
	it("subscribe", () => {
		const state = State.create()
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
		expect(state.foo).toEqual("bar")
		expect(components.every(component => !component.disabled))
		state.disabled = true
		expect(components.every(component => component.disabled)).toEqual(true)
	})
	it("unsubscribe", () => {
		const state = State.create()
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
	it("internal subscriptions", async () => {
		class Dependency extends StateBase<Dependency> {
			#value?: Dependency["value"]
			get value(): number | undefined {
				return (this.#value ??=
					(new Promise(resolve => setTimeout(() => resolve((this.listenable.value = 100)), 0)), undefined))
			}
			set value(value: Dependency["value"]) {
				this.#value = value
			}
			static create(): WithListenable<Dependency> {
				const backend = new this()
				const listenable = Listenable.load(backend)
				return listenable
			}
		}
		class Dependant extends StateBase<Dependant> {
			#raw: Dependant["raw"]
			get raw(): number | undefined {
				return this.#raw
			}
			set raw(raw: Dependant["raw"]) {
				this.#raw = raw
				this.calculate()
			}
			#value: Dependant["value"]
			get value(): number | undefined {
				return (this.#value ??= (this.calculate(), undefined))
			}
			private set value(value: Dependant["value"]) {
				this.#value = value
			}
			#foo: Dependant["foo"]
			get foo(): Dependency["value"] {
				return this.#foo
			}
			private set foo(foo: Dependant["foo"]) {
				this.#foo = foo
				this.calculate()
			}

			private calculate() {
				if (this.foo != undefined && this.raw != undefined)
					this.listenable.value = this.foo + this.raw
			}

			private subscriptions = {
				foo: (value: Dependency["value"]) => (this.foo = value),
			}

			static create(foo: WithListenable<Dependency>, options?: { lazy?: boolean }): WithListenable<Dependant> {
				const backend = new this()
				const listenable = Listenable.load(backend)
				foo.listen("value", value => backend.subscriptions.foo(value), options)
				return listenable
			}
		}
		class State {
			readonly dependency: WithListenable<Dependency>
			readonly dependant: WithListenable<Dependant>
			constructor(options?: { lazy?: boolean }) {
				this.dependency = Dependency.create()
				this.dependant = Dependant.create(this.dependency, options)
			}
		}

		const eager = new State()
		await sleep(0) // context switch. do not remove
		expect(eager.dependant.foo).toEqual(100)
		expect(eager.dependant.raw).toEqual(undefined)
		expect(eager.dependant.value).toEqual(undefined)
		expect(eager.dependency.value).toEqual(100)
		await sleep(0) // context switch. do not remove
		expect(eager.dependant.foo).toEqual(100)
		expect(eager.dependant.raw).toEqual(undefined)
		expect(eager.dependant.value).toEqual(undefined)
		expect(eager.dependency.value).toEqual(100)
		eager.dependant.raw = 50
		await sleep(0) // context switch. do not remove
		expect(eager.dependant.foo).toEqual(100)
		expect(eager.dependant.raw).toEqual(50)
		expect(eager.dependant.value).toEqual(150)
		expect(eager.dependency.value).toEqual(100)
		eager.dependency.value = 200
		await sleep(0) // context switch. do not remove
		expect(eager.dependant.value).toEqual(250)

		const lazy = new State({ lazy: true })
		await sleep(0) // context switch. do not remove
		expect(lazy.dependant.foo).toEqual(undefined)
		expect(lazy.dependant.raw).toEqual(undefined)
		expect(lazy.dependant.value).toEqual(undefined)
		expect(lazy.dependency.value).toEqual(undefined)
		await sleep(0) // context switch. do not remove
		expect(lazy.dependant.foo).toEqual(100)
		expect(lazy.dependant.raw).toEqual(undefined)
		expect(lazy.dependant.value).toEqual(undefined)
		expect(lazy.dependency.value).toEqual(100)
		lazy.dependant.raw = 50
		await sleep(0) // context switch. do not remove
		expect(lazy.dependant.raw).toEqual(50)
		expect(lazy.dependant.value).toEqual(150)
		lazy.dependency.value = 200
		await sleep(0) // context switch. do not remove
		expect(lazy.dependant.value).toEqual(250)
	})
})
