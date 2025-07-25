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
	VNode,
	Watch,
} from "@stencil/core"
import { Color } from "../../../model"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"
import { Input } from "../Input"
import { Looks } from "../Looks"

@Component({
	tag: "smoothly-input-file",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFile implements ComponentWillLoad, Input, Clearable, Editable {
	@Element() element: HTMLSmoothlyInputFileElement
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop({ reflect: true }) disabled?: boolean
	@Prop() accept?: string
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks?: Looks
	@Prop({ reflect: true }) camera: "front" | "back"
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@State() dragging = false
	@Event() smoothlyInputLooks: EventEmitter<(looks?: Looks, color?: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: Editable) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	parent: Editable | undefined
	private observer = Editable.Observer.create(this)
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	private initialValue: SmoothlyInputFile["value"]

	private get files(): FileList {
		this.transfer.items.clear()
		this.value && this.transfer.items.add(this.value)
		return this.transfer.files
	}

	async componentWillLoad(): Promise<void> {
		this.smoothlyInputLooks.emit(
			(looks, color) => ((this.looks = this.looks ?? looks), !this.color && (this.color = color))
		)
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.smoothlyInputLoad.emit(parent => (this.parent = parent))
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
		this.observer.publish()
	}
	async disconnectedCallback() {
		if (!this.element.isConnected)
			await this.unregister()
	}
	@Watch("name")
	nameChange(_: string | undefined, oldName: string | undefined) {
		Input.formRename(this, oldName)
	}
	@Method()
	async register() {
		Input.formAdd(this)
	}
	@Method()
	async unregister() {
		Input.formRemove(this)
	}
	@Method()
	async getValue(): Promise<File | undefined> {
		return this.value
	}
	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Listen("smoothlyInputLoad")
	smoothlyInputLoadHandler(event: CustomEvent<(parent: SmoothlyInputFile) => void>): void {
		Input.registerSubAction(this, event)
	}
	@Method()
	async listen(listener: Editable.Observer.Listener): Promise<void> {
		this.observer.subscribe(listener)
	}
	@Method()
	async edit(editable: boolean): Promise<void> {
		this.readonly = !editable
	}
	@Method()
	async reset(): Promise<void> {
		this.value = this.initialValue
	}
	@Method()
	async setInitialValue(): Promise<void> {
		this.initialValue = this.value
		this.valueChanged()
	}
	@Method()
	async binary(): Promise<boolean> {
		return true
	}

	@Watch("value")
	async valueChanged(): Promise<void> {
		this.changed = this.initialValue !== this.value
		this.smoothlyInput.emit({ [this.name]: await this.getValue() })
		this.observer.publish()
	}

	inputHandler(event: Event): void {
		event.stopPropagation()
		if (this.input?.files?.length)
			this.value = this.input?.files[0]
	}
	dropHandler(event: DragEvent): void {
		event.preventDefault()
		event.stopPropagation()
		this.dragging = false
		if (event.dataTransfer?.files.length)
			this.value = event.dataTransfer.files[0]
	}
	clickHandler(event: MouseEvent): void {
		if (!this.readonly && !this.disabled && !event.composedPath().find(target => target == this.input)) {
			this.input?.click()
		}
	}
	dragOverHandler(event: DragEvent): void {
		event.preventDefault()
		event.stopPropagation()
	}
	dragEnterHandler(event: DragEvent): void {
		event.preventDefault()
		!this.readonly && !this.disabled && (this.dragging = true)
	}
	dragLeaveHandler(event: DragEvent): void {
		event.stopPropagation()
		this.dragging = false
	}

	render(): VNode | VNode[] {
		return (
			<Host
				class={{ dragging: this.dragging, "has-value": !!this.value }}
				tabindex={this.disabled ? undefined : 0}
				onClick={(e: MouseEvent) => this.clickHandler(e)}
				onDragOver={(e: DragEvent) => this.dragOverHandler(e)}
				onDragEnter={(e: DragEvent) => this.dragEnterHandler(e)}>
				<label>
					<slot name={"label"} />
				</label>
				<div class="input">
					<smoothly-button disabled={this.disabled} type={"button"} color={this.color} fill={"clear"} size="flexible">
						<slot name={"button"} />
					</smoothly-button>
					<span>{this.value?.name ?? this.placeholder}</span>
					<div class={"drag-overlay"} onDrop={e => this.dropHandler(e)} onDragLeave={e => this.dragLeaveHandler(e)}>
						<smoothly-icon name={"document-attach-outline"} />
					</div>
					<input
						onFocus={() => console.log("focus file input!")}
						ref={element => (this.input = element)}
						type={"file"}
						disabled={this.disabled}
						capture={this.camera == "back" ? "environment" : "user"}
						accept={this.accept ?? (!this.camera ? undefined : "image/jpeg")}
						files={this.files}
						onInput={e => this.inputHandler(e)}
					/>
				</div>
				<div class="end" onClick={(e: MouseEvent) => e.stopPropagation()}>
					<slot name="end" />
				</div>
			</Host>
		)
	}
}
