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
	State,
	Watch,
} from "@stencil/core"
import { http } from "cloudly-http"
import { isly } from "isly"
import { SmoothlyFormCustomEvent } from "../../components"
import { Color, Data, Notice, Submit } from "../../model"
import { Clearable } from "../input/Clearable"
import { Editable } from "../input/Editable"
import { Input } from "../input/Input"
import { Looks } from "../input/Looks"
import { Submittable } from "../input/Submittable"
import { Validatable } from "../input/Validatable"

@Component({
	tag: "smoothly-form",
	styleUrl: "style.css",
})
export class SmoothlyForm implements ComponentWillLoad, Clearable, Submittable, Editable {
	@Element() element: HTMLSmoothlyFormElement
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ mutable: true }) value: Readonly<Data> = {}
	@Prop({ reflect: true, mutable: true }) flaw: isly.Flaw
	@Prop() action?: string
	@Prop() type?: "update" | "change" | "fetch" | "create" = this.action ? "create" : undefined
	@Prop({ mutable: true }) readonly = false
	@Prop({ reflect: true, attribute: "looks" }) looks: Looks = "plain"
	@Prop() name?: string
	@Prop() prevent = true
	@Prop({ mutable: true }) changed = false
	@Prop() validator: (data: Readonly<Data>) => Promise<isly.Flaw | undefined> = async value =>
		Object.keys(value).length > 0 ? undefined : { type: "object", message: "At least one input must be set." }
	@State() processing?: Promise<boolean>
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

	@Watch("flaw")
	async flawChange(flaw?: isly.Flaw) {
		console.log("smoothly-form.setFlaw", flaw)
		if (flaw) {
			this.setFlaw(flaw)
		} else {
			// TODO remove
		}
	}

	setFlaw(flaw: isly.Flaw) {
		if (typeof flaw.property == "string") {
			const input = this.inputs.get(flaw.property)
			if (Editable.Element.is(input)) {
				input.flaw = flaw
				// if (input instanceof HTMLElement) {
				// 	const flawElement = document.createElement("smoothly-input-flaw") as HTMLSmoothlyInputFlawElement
				// 	flawElement.color = "danger"
				// 	flawElement.value = flaw
				// 	input.parentNode?.insertBefore(flawElement, input)
				// }
			}
		}
		flaw.flaws?.forEach(f => this.setFlaw(f))
	}

	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		;(this.listeners[property] ??= []).push(listener)
		listener(this)
	}
	@Watch("value")
	watchValue() {
		this.changed = [...this.inputs.values()].some(input => (Editable.type.is(input) ? input.changed : true))
		this.listeners.changed?.forEach(l => l(this))
	}
	@Watch("readonly")
	watchReadonly() {
		this.listeners.changed?.forEach(l => l(this))
	}
	@Listen("smoothlyInputLooks")
	smoothlyInputLooksHandler(event: CustomEvent<(looks: Looks, color: Color | undefined) => void>) {
		event.stopPropagation()
		event.detail(this.looks, this.color)
	}
	@Listen("smoothlyInput")
	async smoothlyInputHandler(event: CustomEvent<Record<string, any>>): Promise<void> {
		this.value = Data.merge(this.value, event.detail)
		this.smoothlyFormInput.emit(Data.convertArrays(this.value))
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
		if (Input.Element.is(event.target)) {
			if (await event.target.binary?.())
				this.contentType = "form-data"
			this.value = Data.merge(this.value, { [event.target.name]: event.target.value })
			this.inputs.set(event.target.name, event.target)
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
			this.setInitialValue()
			this.readonlyAtLoad && this.edit(!this.readonlyAtLoad)
		}
		this.processing = undefined
	}
	@Method()
	async clear(): Promise<void> {
		this.inputs.forEach(input => Clearable.is(input) && input.clear())
		this.smoothlyFormClear.emit()
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.inputs.forEach(input => Editable.Element.type.is(input) && input.edit(editable))
		this.readonly = !editable
		this.smoothlyFormEdit.emit(editable)
	}
	@Method()
	async reset(): Promise<void> {
		this.inputs.forEach(input => Editable.Element.type.is(input) && input.reset())
		this.changed = [...this.inputs.values()].some(input => (Editable.type.is(input) ? input.changed : true))
		this.smoothlyFormReset.emit()
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.inputs.forEach(input => Editable.Element.type.is(input) && input.setInitialValue())
	}
	@Method()
	async validate(): Promise<boolean> {
		const flaw = Data.fromFlaw(await this.validator(this.value))
		return (
			[...this.inputs.entries()].every(([name, input]) => {
				if ("warning" in input && typeof input.warning == "string")
					input.warning = Data.get(flaw, name)
				return Validatable.is(input) ? input.validate() : true
			}) && Object.keys(flaw).length == 0
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
					<smoothly-input-flaw color="danger" value={this.flaw}></smoothly-input-flaw>
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
