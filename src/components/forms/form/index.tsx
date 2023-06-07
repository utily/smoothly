import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { Changeable } from "../Changeable"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Layout, Placement } from "../Input"
import { Input } from "../Input"
import { Resetable } from "../Resetable"
import { Stylable } from "../Stylable"
import { Submitable } from "../Submitable"

@Component({
	tag: "smoothly-form-new",
	styleUrl: "style.css",
})
export class SmoothlyFormNew implements Changeable, Clearable, Editable, Submitable, Resetable {
	@Prop({ reflect: true }) layout: Layout = "border"
	@Prop({ reflect: true }) placement: Placement = "float"
	@Prop() method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS"
	@Prop() action?: string
	@Prop() prevent = true
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) reactive = false
	@State() value: Readonly<Record<string, any>> = {}
	@State() changed = false
	@State() focus = false
	@Event() smoothlyFormInput: EventEmitter<Record<string, any>>
	@Event() smoothlyFormSubmit: EventEmitter<Record<string, any>>
	private inputs: Input[] = []
	private clearables: Clearable[] = []
	private editabbles: Editable[] = []
	private stylables: Stylable[] = []
	private listeners: {
		changed?: ((parent: Changeable) => Promise<void>)[]
		valid?: ((parent: Submitable) => Promise<void>)[]
	} = {}

	@Watch("value")
	onValueChange() {
		this.changed =
			Object.values(this.value).filter(value => {
				if (Array.isArray(value)) {
					if (value.length > 0)
						return value
				} else if (typeof value == "object" && value != (undefined || null)) {
					if (Object.values(value).filter(value => Boolean(value)).length > 0)
						return value
				} else if (typeof value == "string" && value)
					return value
				else if (value != (null || undefined))
					return value
			}).length > 0
		this.listeners.changed?.forEach(listener => listener(this))
	}

	@Listen("smoothlyInputLoad")
	onSmoothlyInputLoad(e: CustomEvent) {
		if (Input.is(e.target))
			this.inputs.push(e.target)
		if (Clearable.is(e.target))
			this.clearables.push(e.target)
		if (Editable.is(e.target)) {
			this.editabbles.push(e.target)
			e.target.setReadonly(e.target.readonly || this.readonly)
		}
		if (Stylable.is(e.target)) {
			this.stylables.push(e.target)
			e.target.setStyle(this.layout, this.placement)
		}
	}

	@Listen("smoothlyInput")
	async onSmoothlyInput(event: CustomEvent<Record<string, any>>) {
		this.value = { ...this.value, ...event.detail }
		this.smoothlyFormInput.emit(this.value)
		this.listeners.valid?.forEach(listener => listener(this))
	}

	@Listen("smoothlyButtonLoad")
	async onSmoothlyButtonLoad(event: CustomEvent<(parent: SmoothlyFormNew) => void>) {
		event.detail(this)
	}

	@Method()
	async submit() {
		this.smoothlyFormSubmit.emit(this.value)
	}

	@Method()
	async clear() {
		this.clearables.forEach(clearable => clearable.clear())
	}

	@Method()
	async setReadonly(readonly: boolean) {
		this.readonly = readonly
		this.editabbles.forEach(editable => editable.setReadonly(this.readonly))
		this.listeners.changed?.forEach(listener => listener(this))
	}

	@Method()
	async listen(property: "changed" | "valid", listener: (parent: Changeable | Submitable) => Promise<void>) {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}

	@Method()
	async reset(values: { [key: string]: any }) {
		this.inputs.forEach(input => {
			input.value = values[input.name]
		})
	}

	@Method()
	async getValues() {
		return this.value
	}

	@Method()
	async isValid() {
		return this.inputs.filter(input => input.required && !input.value).length == 0
	}

	render() {
		return (
			<Host>
				<form
					onMouseEnter={() => (this.focus = true)}
					onMouseLeave={() => (this.focus = false)}
					action={this.action}
					method={this.method}
					onSubmit={(e: Event) => {
						if (this.prevent)
							e.preventDefault()
						this.submit()
					}}>
					<div class="form-input">
						<slot></slot>
					</div>
					<div class="form-button">
						<div class={`form-action ${this.reactive && !this.focus ? "fadeIn" : ""}`}>
							<slot name="edit"></slot>
							<slot name="clear"></slot>
						</div>
						<slot name="submit"></slot>
					</div>
				</form>
			</Host>
		)
	}
}
