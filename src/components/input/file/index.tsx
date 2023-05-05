import { Component, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core"

@Component({
	tag: "smoothly-input-file",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputFile {
	private transfer: DataTransfer = new DataTransfer()
	private input?: HTMLInputElement
	@State() dragging = false
	@Prop({ reflect: true }) name: string
	@Prop({ reflect: true }) showLabel = true
	@Prop({ mutable: true }) value?: File
	@Prop({ mutable: true, reflect: true }) placeholder: string | undefined
	@Event() smoothlyInput: EventEmitter<{ name: string; value: File }>
	@Event() smoothlyChange: EventEmitter<{ name: string; value: File }>
	render() {
		return (
			<Host
				class={{ dragging: this.dragging }}
				onDragOver={(event: Event) => (event.preventDefault(), event.stopPropagation())}
				onDragEnter={() => (this.dragging = true)}>
				<label>
					<slot name={"label"} />
				</label>
				<smoothly-button size="flexible" onClick={event => (event.stopPropagation(), this.input?.click())}>
					<slot name={"button"} />
				</smoothly-button>
				<span onClick={event => (event.stopPropagation(), this.input?.click())}>
					{this.value?.name ?? this.placeholder}
				</span>
				<div
					class={"mask"}
					onDrop={event => (
						event.preventDefault(),
						event.stopPropagation(),
						(this.dragging = false),
						event.dataTransfer?.files.length &&
							(this.smoothlyInput.emit({ name: this.name, value: (this.value = event.dataTransfer.files[0]) }),
							this.smoothlyChange.emit({ name: this.name, value: (this.value = event.dataTransfer.files[0]) }))
					)}
					onDragLeave={event => (event.stopPropagation(), (this.dragging = false))}
				/>
				<input
					ref={element => (this.input = element)}
					type={"file"}
					files={(this.transfer.items.clear(), this.value && this.transfer.items.add(this.value), this.transfer.files)}
					onInput={event => (
						event.stopPropagation(),
						this.input?.files?.length &&
							this.smoothlyInput.emit({ name: this.name, value: (this.value = this.input?.files[0]) })
					)}
					onChange={event => (
						event.stopPropagation(),
						this.input?.files?.length &&
							this.smoothlyChange.emit({ name: this.name, value: (this.value = this.input?.files[0]) })
					)}
				/>
				<slot />
			</Host>
		)
	}
}
