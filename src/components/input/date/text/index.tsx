import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { getLocale } from "../../../../model"
import { InputEventWrapper, KeyEventWrapper } from "../../text-editable"
import { DateFormat } from "./DateFormat"

@Component({
	tag: "smoothly-date-text",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateRangeText {
	@Element() element: HTMLElement
	private partElements: { [partIndex in number]: HTMLSmoothlyTextEditableElement | undefined } = {
		0: undefined,
		1: undefined,
		2: undefined,
	}
	@Prop() locale?: isoly.Locale = getLocale()
	@Prop({ reflect: true }) readonly: boolean
	@Prop({ reflect: true }) disabled: boolean
	@Prop({ reflect: true }) invalid: boolean
	@Prop({ reflect: true }) showLabel = true
	@Prop() value?: isoly.Date // Only used for initial value
	@State() parts: DateFormat.Parts = {}
	private previousEmittedValue?: isoly.Date
	@State() order: DateFormat.Order
	@State() separator: DateFormat.Separator
	@State() focusedIndex?: number
	@Event() smoothlyDateTextHasText: EventEmitter<boolean>
	@Event() smoothlyDateTextChange: EventEmitter<isoly.Date | undefined>
	@Event() smoothlyDateTextFocusChange: EventEmitter<boolean>
	@Event() smoothlyDateHasPartialDate: EventEmitter<DateFormat.Parts>
	@Event() smoothlyDateTextDone: EventEmitter<void>
	@Event() smoothlyDateTextPrevious: EventEmitter<void>
	@Event() smoothlyDateTextNext: EventEmitter<void>

	componentWillLoad() {
		this.order = DateFormat.Order.fromLocale(this.locale)
		this.separator = DateFormat.Separator.fromLocale(this.locale)
		this.parts = DateFormat.Parts.fromDate(this.value) ?? {}
	}
	componentDidLoad() {
		this.updateInputs()
	}

	@Watch("parts")
	partsHandler() {
		const value = DateFormat.Parts.toDate(this.parts)
		if (value != this.previousEmittedValue) {
			this.smoothlyDateTextChange.emit(value)
			this.previousEmittedValue = value
		}
		this.smoothlyDateTextHasText.emit(Object.values(this.parts).some(part => !!part))
	}
	@Watch("focusedIndex")
	focusedIndexHandler() {
		this.smoothlyDateTextFocusChange.emit(typeof this.focusedIndex == "number")
	}

	@Method()
	async setValue(value: isoly.Date | undefined) {
		const parts = DateFormat.Parts.fromDate(value)
		this.setAllParts(parts)
	}

	setAllParts(parts?: DateFormat.Parts) {
		this.parts = parts ?? {}
		this.updateInputs()
	}
	updateInputs() {
		const yearIndex = this.order.indexOf("Y")
		const monthIndex = this.order.indexOf("M")
		const dayIndex = this.order.indexOf("D")
		this.partElements[yearIndex]?.setInputValue(this.parts.Y ?? "")
		this.partElements[monthIndex]?.setInputValue(this.parts.M ?? "")
		this.partElements[dayIndex]?.setInputValue(this.parts.D ?? "")
	}

	setPart(part: "Y" | "M" | "D", value: string | undefined) {
		this.parts = {
			...this.parts,
			[part]: value,
		}
		const index = this.order.indexOf(part)
		this.partElements[index]?.setInputValue(value ?? "")
	}

	@Method()
	async select(place: "start" | "end" = "start") {
		const index = place == "start" ? 0 : 2
		this.setFocus(index)
	}
	@Method()
	async deselect() {
		this.partElements[this.focusedIndex ?? 0]?.blur()
	}

	getInnerText(target: EventTarget | null) {
		return (target as HTMLSpanElement).innerText.replace(/\n/g, "").replace(/\D/g, "")
	}
	cleanValue(value: string) {
		return value.replace(/\n/g, "").replace(/\D/g, "")
	}

	beforeInputHandler(inputApi: InputEventWrapper) {
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const value = this.cleanValue(inputApi.value)
		const nonDigitData = inputApi.data && /\D/.test(inputApi.data)
		const isComplete = DateFormat.Part.isComplete(part, value)
		const noRangedSelection = inputApi.selection.isCollapsed
		if (
			(inputApi.inputType == "insertText" || inputApi.inputType == "insertFromPaste") &&
			(nonDigitData || (isComplete && noRangedSelection))
		) {
			inputApi.preventDefault()
		}
		if (inputApi.inputType == "insertParagraph" || inputApi.inputType == "insertLineBreak") {
			this.smoothlyDateTextDone.emit()
			inputApi.preventDefault()
		}
	}

	inputHandler(e: InputEventWrapper) {
		const part = DateFormat.Order.getPart(this.order, this.focusedIndex ?? 0)
		const index = this.focusedIndex ?? 0
		const value = this.cleanValue(e.value)
		this.parts = {
			...this.parts,
			[part]: value,
		}

		if (["D", "M"].includes(part)) {
			const isDay = part == "D"
			const max = isDay ? DateFormat.Parts.lastDay(this.parts) : 12
			const singleDigitThreshold = isDay ? 3 : 1
			const numberValue = parseInt(value)
			if (value.length >= 2) {
				this.commitPart(part, numberValue, index, max)
			} else if (value.length == 1 && numberValue > singleDigitThreshold) {
				this.autoAdvancePart(part, numberValue, index, max)
			}
		}
		if (DateFormat.Part.isComplete(part, value)) {
			this.setFocus(index + 1)
		}
		const roundedValue = DateFormat.Parts.toDate(this.parts)
		if (roundedValue) {
			const roundedParts = DateFormat.Parts.fromDate(roundedValue)
			if (this.parts.D !== roundedParts?.D) {
				this.setPart("D", roundedParts?.D)
			}
		}
		if (this.parts.Y || this.parts.M || this.parts.D)
			this.smoothlyDateHasPartialDate.emit(this.parts)
	}
	keyDownHandler(inputApi: KeyEventWrapper) {
		const { value, key, cursor } = inputApi
		const text = this.cleanValue(value)
		const index = this.focusedIndex ?? 0
		if (cursor.isCollapsed && cursor.atStart && key == "ArrowLeft") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index - 1)
			inputApi.preventDefault() // Keep selection
		} else if (cursor.isCollapsed && cursor.atEnd && key == "ArrowRight") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index + 1)
			inputApi.preventDefault() // Keep selection
		} else if (key == "Home" || key == "ArrowUp") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(0)
			inputApi.preventDefault() // Keep selection
		} else if (key == "End" || key == "ArrowDown") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(2)
			inputApi.preventDefault() // Keep selection
		} else if (cursor.isCollapsed && cursor.atStart && key == "Backspace" && text == "") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index - 1)
			inputApi.preventDefault() // Prevent delete previous part
		} else if (cursor.isCollapsed && cursor.atEnd && key == "Delete" && text == "") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index + 1)
			inputApi.preventDefault() // Prevent delete next part
		}
	}

	commitPart(part: DateFormat.Part, value: number, index: number, max: number) {
		const clamped = Math.max(1, Math.min(value, max))
		this.setPart(part, clamped.toString().padStart(2, "0"))
		this.partElements[index]?.setCursorPosition(2)
	}
	autoAdvancePart(part: DateFormat.Part, value: number, index: number, max: number) {
		const clamped = Math.max(1, Math.min(value, max))
		this.setPart(part, clamped.toString().padStart(2, "0"))
		this.setFocus(index + 1)
	}

	autoAdvanceIfPossible(index: number) {
		const part = DateFormat.Order.getPart(this.order, index)
		const value = this.parts[part] ?? ""
		if (part == "D" && value.length == 1) {
			this.autoAdvancePart(part, parseInt(value), index, DateFormat.Parts.lastDay(this.parts))
		} else if (part == "M" && value.length == 1) {
			this.autoAdvancePart(part, parseInt(value), index, 12)
		}
	}

	setFocus(index: number) {
		if (index < 0) {
			this.smoothlyDateTextPrevious.emit()
		} else if (index > 2) {
			this.smoothlyDateTextNext.emit()
		} else {
			this.partElements[index]?.selectAll()
		}
	}

	render() {
		return (
			<Host class={{ "has-text": Object.values(this.parts).some(part => !!part) }}>
				{DateFormat.Order.toArray(this.order).map((part, index) => (
					<span onClick={() => !this.readonly && !this.disabled && this.setFocus(index)}>
						<smoothly-text-editable
							class={{
								"smoothly-date-text-part": true,
								"is-complete": DateFormat.Part.isComplete(part, this.parts[part]),
							}}
							ref={el => (this.partElements[index] = el)}
							inputMode="numeric"
							focusHandler={() => (this.focusedIndex = index)}
							blurHandler={() => (this.focusedIndex = undefined)}
							beforeInputHandler={(e: InputEventWrapper) => this.beforeInputHandler(e)}
							inputHandler={(e: InputEventWrapper) => this.inputHandler(e)}
							keyDownHandler={(e: KeyEventWrapper) => this.keyDownHandler(e)}
							key={index}
							contenteditable={!(this.readonly || this.disabled)}
						/>
						<span class="guide">{DateFormat.Part.getGuide(part, this.parts[part]?.length)}</span>
						{index < 2 && <span class="smoothly-date-separator">{this.separator}</span>}
					</span>
				))}
			</Host>
		)
	}
}
