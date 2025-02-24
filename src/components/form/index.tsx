import {
	Component,
	ComponentWillLoad,
	Element,
	Event,
	EventEmitter,
	h,
	Host,
	Listen,
	Method,
	Prop,
	Watch,
} from "@stencil/core"
import { http } from "cloudly-http"
import { isly } from "isly"
import { SmoothlyFormCustomEvent } from "../../components"
import { Key } from "../../components/input/Key"
import { Color, Data, Notice, Submit } from "../../model"
import { Clearable } from "../input/Clearable"
import { Editable } from "../input/Editable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Submittable } from "../input/Submittable"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm implements ComponentWillLoad, Clearable, Submittable, Editable {
	@Element() element: HTMLSmoothlyFormElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) value: Readonly<Data> = {}
	@Prop() action?: string
	@Prop() validator?: isly.Type<any>
	@Prop() type?: "update" | "change" | "fetch" | "create" = this.action ? "create" : undefined
	@Prop({ mutable: true }) readonly = false
	@Prop({ reflect: true, attribute: "looks" }) looks?: Looks
	@Prop({ reflect: true }) name?: string
	@Prop() prevent = true
	@Prop({ mutable: true }) changed = false
	@Prop({ mutable: true }) processing?: Promise<boolean>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	@Event() smoothlyFormInput: EventEmitter<Data>
	@Event() smoothlyFormSubmit: EventEmitter<Submit>
	@Event() smoothlyFormReset: EventEmitter<void>
	@Event() smoothlyFormEdit: EventEmitter<boolean>
	@Event() smoothlyFormClear: EventEmitter<void>
	@Event() notice: EventEmitter<Notice>
	private contentType: "json" | "form-data" = "json"
	private inputs = new Map<string, Input.Element>()
	private readonlyAtLoad = this.readonly
	private listeners: {
		changed?: ((parent: Editable) => Promise<void>)[]
	} = {}

	componentWillLoad(): void {
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
	}
	@Method()
	async removeInput(name: string) {
		if (this.element.isConnected) {
			this.value = Data.remove(this.value, name)
			this.inputs.delete(name)
			this.smoothlyFormInput.emit(Data.convertArrays(this.value))
		}
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}
	@Watch("value")
	async watchValue() {
		this.changed = [...this.inputs.values()].some(input => (Editable.type.is(input) ? input.changed : true))
		if (this.validator) {
			const flaws = this.validator
				?.flaw(Data.convertArrays(this.value))
				.flaws?.reduce((r: Record<string, isly.Flaw>, f) => (f.property ? { ...r, [f.property]: f } : r), {})
			for (const [property, input] of this.inputs.entries()) {
				this.validate(flaws, property, input)
			}
		}
		this.listeners.changed?.forEach(l => l(this))
	}
	validate(flaws: Record<string, isly.Flaw> | undefined, property: string, input: Input.Element) {
		if (property.includes(".")) {
			const [key, ...rest] = property.split(".")
			const nestedFlaws = flaws?.[key]?.flaws ?? []
			this.validate(
				nestedFlaws.reduce((r: Record<string, isly.Flaw>, f) => (f.property ? { ...r, [f.property]: f } : r), {}),
				rest.join("."),
				input
			)
		} else {
			const flaw = flaws?.[property]
			input && (input.invalid = !!flaw)
		}
	}
	@Watch("readonly")
	watchReadonly() {
		this.listeners.changed?.forEach(l => l(this))
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks?: Looks, color?: Color) => void>) {
		event.stopPropagation()
		event.detail(this.looks, this.color)
	}
	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		this.value = Data.merge(this.value, event.detail)
		this.smoothlyFormInput.emit(Data.convertArrays(this.value))
	}
	@Listen("smoothlyKeydown")
	async smoothlyKeydownHandler(event: CustomEvent<Key>): Promise<void> {
		if (event.detail.key == "Enter" && this.inputs.has(event.detail.name)) {
			event.stopPropagation()
			await this.submit()
		}
	}
	@Listen("smoothlyFormSubmit", { target: "window" })
	windowSubmitHandler(event: SmoothlyFormCustomEvent<Submit>): void {
		event.target == this.element && event.detail.result(false)
	}
	@Listen("smoothlyFormSubmit")
	submitHandler(event: SmoothlyFormCustomEvent<Submit>): void {
		this.action && event.stopPropagation()
	}
	@Listen("smoothlyInputLoad")
	async smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyForm) => void>): Promise<void> {
		event.stopPropagation()
		event.detail(this)
		const inputComponent = event.target
		if (Input.Element.is(inputComponent)) {
			if (await inputComponent.binary?.())
				this.contentType = "form-data"
			const inputValue = await inputComponent.getValue() // Needs to await value separately to avoid race condition
			this.value = Data.merge(this.value, { [inputComponent.name]: inputValue })
			this.smoothlyFormInput.emit(Data.convertArrays(this.value))
			this.inputs.set(inputComponent.name, inputComponent)
		}
	}
	@Listen("smoothlyFormDisable")
	async smoothlyFormDisableHandler(event: CustomEvent): Promise<void> {
		event.stopPropagation()
		event.detail(this.readonly)
	}
	@Method()
	async submit(remove?: boolean): Promise<void> {
		this.processing = new Promise(resolve => {
			this.smoothlyFormSubmit.emit({
				value: Data.convertArrays(this.value),
				result: resolve,
				type: remove == true ? "remove" : this.type,
			})
			if (this.action) {
				const action = this.action
				this.notice.emit(
					Notice.execute("Submitting form", async () => {
						const method = remove
							? "DELETE"
							: !this.type || this.type == "create"
							? "POST"
							: this.type == "change"
							? "PUT"
							: this.type == "update"
							? "PATCH"
							: "GET"
						const response = await http
							.fetch(
								http.Request.create(
									method == "GET"
										? { method, url: `${action}?${http.Search.stringify(this.value)}` }
										: {
												method,
												url: action,
												...(this.value && {
													header: { contentType: this.contentType ? "multipart/form-data" : "application/json" },
													body: this.value,
												}),
										  }
								)
							)
							.catch(() => undefined)
						const result =
							!response || response?.status < 200 || response.status >= 300
								? ([false, "Failed to submit form."] as const)
								: ([true, "Form successfully submitted."] as const)
						resolve(result[0])
						return [...result]
					})
				)
			}
		})
		if (await this.processing) {
			this.type == "create" && (await this.clear())
			await this.setInitialValue()
			this.readonlyAtLoad && (await this.edit(!this.readonlyAtLoad))
		}
		this.processing = undefined
	}
	@Method()
	async clear(): Promise<void> {
		await Promise.all([...this.inputs.values()].map(async input => Clearable.is(input) && input.clear()))
		this.smoothlyFormClear.emit()
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		await Promise.all(
			[...this.inputs.values()].map(async input => Editable.Element.type.is(input) && input.edit(editable))
		)
		this.readonly = !editable
		this.smoothlyFormEdit.emit(editable)
	}
	@Method()
	async reset(): Promise<void> {
		await Promise.all([...this.inputs.values()].map(input => Editable.Element.type.is(input) && input.reset()))
		this.changed = [...this.inputs.values()].some(input => (Editable.type.is(input) ? input.changed : true))
		this.smoothlyFormReset.emit()
	}
	@Method()
	async setInitialValue(): Promise<void> {
		await Promise.all(
			[...this.inputs.values()].map(input => Editable.Element.type.is(input) && input.setInitialValue())
		)
	}
	render() {
		return (
			<Host>
				<smoothly-spinner overlay hidden={!this.processing} />
				<form onSubmit={!this.prevent ? undefined : e => e.preventDefault()} name={this.name}>
					<fieldset>
						<slot></slot>
					</fieldset>
					<div>
						<slot name="clear" />
						<slot name="edit" />
						<slot name="reset" />
						<slot name="delete" />
						<slot name="submit" />
					</div>
				</form>
			</Host>
		)
	}
}
