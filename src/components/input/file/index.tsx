import {
	Component,
	ComponentWillLoad,
	Event,
	EventEmitter,
	h,
	Host,
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
	@Prop({ mutable: true }) changed = false
	@Prop({ reflect: true, mutable: true }) readonly = false
	@Prop() accept?: string
	@Prop({ reflect: true, mutable: true }) color?: Color
	@Prop({ reflect: true, mutable: true }) looks: Looks = "plain"
	@Prop({ reflect: true }) camera: "front" | "back"
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@State() dragging = false
	@Event() smoothlyInputLooks: EventEmitter<(looks: Looks, color: Color) => void>
	@Event() smoothlyInput: EventEmitter<Record<string, any>>
	@Event() smoothlyInputLoad: EventEmitter<(parent: HTMLElement) => void>
	@Event() smoothlyFormDisable: EventEmitter<(disabled: boolean) => void>
	private listener: { changed?: (parent: Editable) => Promise<void> }
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	private initialValue: SmoothlyInputFile["value"]

	private get files(): FileList {
		this.transfer.items.clear()
		this.value && this.transfer.items.add(this.value)
		return this.transfer.files
	}

	componentWillLoad(): void {
		this.smoothlyInputLooks.emit((looks, color) => ((this.looks = looks), !this.color && (this.color = color)))
		this.smoothlyInput.emit({ [this.name]: this.value })
		this.smoothlyInputLoad.emit(() => {})
		!this.readonly && this.smoothlyFormDisable.emit(readonly => (this.readonly = readonly))
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
	}
	@Method()
	async listen(property: "changed", listener: (parent: Editable) => Promise<void>): Promise<void> {
		this.listener[property] = listener
		listener(this)
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
	valueChanged(): void {
		this.changed = this.initialValue !== this.value
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	inputHandler(event: Event): void {
		event.stopPropagation()
		if (this.input?.files?.length) {
			this.value = this.input?.files[0]
			this.smoothlyInput.emit({ [this.name]: this.value })
		}
	}
	dropHandler(event: DragEvent): void {
		event.preventDefault()
		event.stopPropagation()
		this.dragging = false
		if (event.dataTransfer?.files.length) {
			this.value = event.dataTransfer.files[0]
			this.smoothlyInput.emit({ [this.name]: this.value })
		}
	}
	clickHandler(event: MouseEvent): void {
		if (!this.readonly && !event.composedPath().find(target => target == this.input)) {
			this.input?.click()
		}
	}
	dragOverHandler(event: DragEvent): void {
		event.preventDefault()
		event.stopPropagation()
	}
	dragEnterHandler(event: DragEvent): void {
		event.preventDefault()
		!this.readonly && (this.dragging = true)
	}
	dragDropHandler(event: DragEvent): void {
		event.preventDefault()
		event.stopPropagation()
		this.dragging = false
		if (event.dataTransfer?.files.length) {
			this.value = event.dataTransfer.files[0]
			this.smoothlyInput.emit({ [this.name]: this.value })
		}
	}
	dragLeaveHandler(event: DragEvent): void {
		event.stopPropagation()
		this.dragging = false
	}

	render(): VNode | VNode[] {
		return (
			<Host
				class={{ dragging: this.dragging }}
				tabindex={0}
				onClick={(e: MouseEvent) => this.clickHandler(e)}
				onDragOver={(e: DragEvent) => this.dragOverHandler(e)}
				onDragEnter={(e: DragEvent) => this.dragEnterHandler(e)}>
				<label>
					<slot name={"label"} />
				</label>
				<div class="input">
					<smoothly-button color={this.color} fill={"clear"} size="flexible">
						<slot name={"button"} />
					</smoothly-button>
					<span>{this.value?.name ?? this.placeholder}</span>
					<div class={"mask"} onDrop={e => this.dropHandler(e)} onDragLeave={e => this.dragLeaveHandler(e)} />
					<input
						ref={element => (this.input = element)}
						type={"file"}
						capture={this.camera == "back" ? "environment" : "user"}
						accept={this.accept ?? (!this.camera ? undefined : "image/jpeg")}
						files={this.files}
						onInput={e => this.inputHandler(e)}
					/>
				</div>
				<slot />
			</Host>
		)
	}
}
