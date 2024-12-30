// TODO: Should be imported with
// import * as model from "../model/index"
// But test fails because of test not handling ESM-module of imported libraries.
import { describe, expect, it } from "vitest"
import { Listenable, ListenerBatch, WithListenable } from "./Listenable"
import { StateBase } from "./StateBase"

describe("Listenable", () => {
	async function asyncContextSwitch(callback?: () => void): Promise<void> {
		await new Promise<void>(resolve => setTimeout(() => resolve(callback?.()), 0))
	}
	class State extends StateBase<State> {
		get foo() {
			return "bar"
		}
		disabled = false
		count = 0
		static create() {
			return Listenable.load(new State())
		}
	}
	it("load", () => {
		const state = State.create()
		expect(typeof state.listen).toEqual("function")
		expect(typeof state.unlisten).toEqual("function")
		expect(typeof state.batchListen).toEqual("function")
		expect(typeof state.batchUnlisten).toEqual("function")
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
	it("batchListen and batchUnlisten", () => {
		const state = State.create()
		class FakeComponent {
			disabled: boolean
			count: number
			listeners: ListenerBatch<State> = {
				disabled: (disabled: boolean) => (this.disabled = disabled),
				count: (count: number) => (this.count = count),
			}
			constructor() {
				this.componentWillLoad()
			}
			componentWillLoad() {
				state.batchListen(this.listeners)
			}
			disconnectedCallback() {
				state.batchUnlisten(this.listeners)
			}
		}
		const components = [new FakeComponent(), new FakeComponent()]
		expect(components.every(components => components.disabled == false)).toBeTruthy()
		expect(components.every(components => components.count == 0)).toBeTruthy()
		state.disabled = true
		state.count++
		expect(components.every(components => components.disabled == true)).toBeTruthy()
		expect(components.every(components => components.count == 1)).toBeTruthy()
		components[0].disconnectedCallback()
		state.disabled = false
		state.count = 123
		expect(components[0].disabled).toEqual(true)
		expect(components[0].count).toEqual(1)
		expect(components[1].disabled).toEqual(false)
		expect(components[1].count).toEqual(123)
	})
	it("internal subscriptions", async () => {
		class Dependency extends StateBase<Dependency> {
			#value?: Dependency["value"]
			get value(): number | undefined {
				return (this.#value ??= (asyncContextSwitch(() => (this.listenable.value = 100)), undefined))
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
			#dependency: Dependant["dependency"]
			get dependency(): Dependency["value"] {
				return this.#dependency
			}
			private set dependency(dependency: Dependant["dependency"]) {
				this.#dependency = dependency
				this.calculate()
			}

			private calculate() {
				if (this.dependency != undefined && this.raw != undefined)
					this.listenable.value = this.dependency + this.raw
				else if (this.#value != undefined)
					this.listenable.value = undefined
			}

			private subscriptions = {
				dependency: (value: Dependency["value"]) => (this.listenable.dependency = value),
			}

			static create(dependency: WithListenable<Dependency>, options?: { lazy?: boolean }): WithListenable<Dependant> {
				const backend = new this()
				const listenable = Listenable.load(backend)
				dependency.listen("value", value => backend.subscriptions.dependency(value), options)
				return listenable
			}
		}
		class State {
			readonly dependency = Dependency.create()
			readonly dependant: WithListenable<Dependant>
			constructor(options?: { lazy?: boolean }) {
				this.dependant = Dependant.create(this.dependency, options)
			}
		}

		const eager = new State()
		await asyncContextSwitch()
		expect(eager.dependant.dependency).toEqual(100)
		expect(eager.dependant.raw).toEqual(undefined)
		expect(eager.dependant.value).toEqual(undefined)
		expect(eager.dependency.value).toEqual(100)
		await asyncContextSwitch()
		expect(eager.dependant.dependency).toEqual(100)
		expect(eager.dependant.raw).toEqual(undefined)
		expect(eager.dependant.value).toEqual(undefined)
		expect(eager.dependency.value).toEqual(100)
		eager.dependant.raw = 50
		await asyncContextSwitch()
		expect(eager.dependant.dependency).toEqual(100)
		expect(eager.dependant.raw).toEqual(50)
		expect(eager.dependant.value).toEqual(150)
		expect(eager.dependency.value).toEqual(100)
		eager.dependency.value = 200
		await asyncContextSwitch()
		expect(eager.dependant.value).toEqual(250)

		const lazy = new State({ lazy: true })
		await asyncContextSwitch()
		expect(lazy.dependant.dependency).toEqual(undefined)
		expect(lazy.dependant.raw).toEqual(undefined)
		expect(lazy.dependant.value).toEqual(undefined)
		expect(lazy.dependency.value).toEqual(undefined)
		await asyncContextSwitch()
		expect(lazy.dependant.dependency).toEqual(100)
		expect(lazy.dependant.raw).toEqual(undefined)
		expect(lazy.dependant.value).toEqual(undefined)
		expect(lazy.dependency.value).toEqual(100)
		lazy.dependant.raw = 50
		await asyncContextSwitch()
		expect(lazy.dependant.raw).toEqual(50)
		expect(lazy.dependant.value).toEqual(150)
		lazy.dependency.value = 200
		await asyncContextSwitch()
		expect(lazy.dependant.value).toEqual(250)
	})
})
