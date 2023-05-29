import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from "@stencil/core"
import { Clearable } from "../Clearable"
import { Editable } from "../Editable"

@Component({
	tag: "smoothly-input-file",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFile implements Clearable, Editable {
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	@State() dragging = false
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) readonly = false
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Event() smoothlyBlur: EventEmitter<void>
	@Event() smoothlyFocus: EventEmitter<void>
	@Event() smoothlyInput: EventEmitter<Record<string, File | undefined>>
	@Event() smoothlyChange: EventEmitter<Record<string, File | undefined>>
	@Event() smoothlyFormInputLoad: EventEmitter<void>

	componentWillLoad() {
		this.smoothlyFormInputLoad.emit()
		this.smoothlyInput.emit({ [this.name]: this.value })

		window.addEventListener("focus", (e: Event) => {
			if (!this.value)
				this.smoothlyBlur.emit()
		})
	}

	@Watch("value")
	onChangeValue(value: File, pre: File | undefined) {
		if (value != pre)
			this.smoothlyChange.emit({ [this.name]: this.value })
		this.smoothlyInput.emit({ [this.name]: this.value })
	}

	onClick() {
		this.smoothlyFocus.emit()
	}

	onDrop(event: DragEvent) {
		this.abortEvent(event)
		this.dragging = false
		if (event.dataTransfer?.files.length)
			this.value = event.dataTransfer.files[0]
	}

	onDragEnter() {
		this.dragging = true
		this.smoothlyFocus.emit()
	}

	onDragLeave() {
		console.log("leave")
		this.dragging = false
		this.smoothlyBlur.emit()
	}

	onInput() {
		this.dragging = false
		if (this.input?.files?.length)
			this.value = this.input?.files[0]
	}

	abortEvent(event: Event) {
		event.preventDefault()
		event.stopPropagation()
	}

	@Method()
	async clear(): Promise<void> {
		this.value = undefined
		this.smoothlyBlur.emit()
	}
	@Method()
	async setReadonly(readonly: boolean): Promise<void> {
		this.readonly = readonly
	}

	render() {
		return (
			<Host onDragOver={(event: Event) => this.abortEvent(event)} onDragEnter={() => this.onDragEnter()}>
				<span>{this.value?.name}</span>
				<div
					onDragLeave={() => this.onDragLeave()}
					class={`${this.dragging ? "overlayer" : "hidden"}`}
					onDrop={(event: DragEvent) => this.onDrop(event)}></div>
				<input
					readOnly={this.readonly}
					onClick={() => this.onClick()}
					ref={element => (this.input = element)}
					type="file"
					files={(this.transfer.items.clear(), this.value && this.transfer.items.add(this.value), this.transfer.files)}
					onInput={() => this.onInput()}
				/>
			</Host>
		)
	}
}
