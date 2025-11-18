import { Component, h, Host, Listen, Method, Prop } from "@stencil/core"

export type InputEventWrapper = {
	preventDefault: () => void
	setValue: (value: string) => void
	value: string
	selection: {
		start: number | null
		end: number | null
		isCollapsed: boolean | null
	}
	inputType: string
	data: string | null
}

export type KeyEventWrapper = {
	preventDefault: () => void
	value: string
	key: string
	code: string
	altKey: boolean
	ctrlKey: boolean
	shiftKey: boolean
	metaKey: boolean
	cursor: {
		atStart: boolean
		atEnd: boolean
		isCollapsed: boolean
	}
}

/*
	This component is a text input that resizes smoothly based on its content.
	It uses a hidden mirror span to measure the width of the content and adjust
	the input width accordingly.
*/

@Component({
	tag: "smoothly-text-editable",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyTextEditable {
	private mirrorElement: HTMLSpanElement | undefined
	private inputElement: HTMLInputElement | undefined
	@Prop() readonly: boolean = false
	@Prop() inputMode: "text" | "numeric" = "text"
	@Prop() beforeInputHandler: (event: InputEventWrapper) => void
	@Prop() inputHandler: (event: InputEventWrapper) => void
	@Prop() focusHandler: () => void
	@Prop() blurHandler: () => void
	@Prop() keyDownHandler: (event: KeyEventWrapper) => void

	@Method()
	async setInputValue(value: string) {
		this.set(value)
	}
	@Method()
	async setCursorPosition(position: number) {
		this.inputElement?.focus()
		this.inputElement?.setSelectionRange(position, position)
	}

	@Method()
	async selectAll() {
		this.inputElement?.focus()
		// Use requestAnimationFrame to ensure input is focused before setting selection range.
		requestAnimationFrame(() => {
			const valueLength = this.inputElement?.value.length || 0
			this.inputElement?.setSelectionRange(0, valueLength, "forward")
		})
	}

	set(value: string) {
		this.inputElement!.value = value
		this.updateInputWidth()
	}
	updateInputWidth() {
		this.mirrorElement!.textContent = this.inputElement?.value || "\u200b"
		this.inputElement!.style.width = this.mirrorElement!.offsetWidth + 2 + "px"
	}

	inputEventToWrapper(e: InputEvent): InputEventWrapper {
		return {
			preventDefault: () => e.preventDefault(),
			setValue: (value: string) => this.set(value),
			value: this.inputElement!.value,
			selection: {
				start: this.inputElement!.selectionStart,
				end: this.inputElement!.selectionEnd,
				isCollapsed:
					this.inputElement!.selectionStart !== null &&
					this.inputElement!.selectionEnd !== null &&
					this.inputElement!.selectionStart === this.inputElement!.selectionEnd,
			},
			inputType: e.inputType,
			data: e.data,
		}
	}

	@Listen("beforeinput")
	onBeforeInput(e: InputEvent) {
		e.stopPropagation()
		if (this.beforeInputHandler) {
			this.beforeInputHandler(this.inputEventToWrapper(e))
			this.updateInputWidth()
		}
	}

	@Listen("input")
	onInput(e: InputEvent) {
		e.stopPropagation()
		if (this.inputHandler) {
			this.inputHandler(this.inputEventToWrapper(e))
			this.updateInputWidth()
		}
	}

	@Listen("keydown")
	onKeyDown(e: KeyboardEvent) {
		if (this.keyDownHandler) {
			const wrapper: KeyEventWrapper = {
				preventDefault: () => e.preventDefault(),
				value: this.inputElement?.value || "",
				key: e.key,
				code: e.code,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				shiftKey: e.shiftKey,
				metaKey: e.metaKey,
				cursor: {
					atStart: this.inputElement?.selectionStart == 0,
					atEnd: this.inputElement?.selectionEnd == this.inputElement?.value.length,
					isCollapsed:
						this.inputElement!.selectionStart !== null &&
						this.inputElement!.selectionEnd !== null &&
						this.inputElement!.selectionStart === this.inputElement!.selectionEnd,
				},
			}
			this.keyDownHandler(wrapper)
			this.updateInputWidth()
		}
	}

	render() {
		return (
			<Host>
				<span class="mirror" ref={el => (this.mirrorElement = el)}>
					{/* Mirror span for measuring input width dynamically */}
				</span>
				<input
					ref={el => (this.inputElement = el)}
					type="text"
					inputMode={this.inputMode}
					onFocus={() => this.focusHandler?.()}
					onBlur={() => this.blurHandler?.()}
					readonly={this.readonly}
				/>
			</Host>
		)
	}
}
