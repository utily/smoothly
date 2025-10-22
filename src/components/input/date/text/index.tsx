import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from "@stencil/core"
import { isoly } from "isoly"
import { DateFormat } from "./DateFormat"
import { InputSelection } from "./InputSelection"

@Component({
	tag: "smoothly-date-text",
	styleUrl: "style.css",
	scoped: true,
})
export class SmoothlyInputDateRangeText {
	@Element() element: HTMLElement
	private partElements: { [partIndex in number]: HTMLSpanElement | undefined } = {
		0: undefined,
		1: undefined,
		2: undefined,
	}
	@Prop() locale: isoly.Locale = navigator.language as isoly.Locale
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
	@Event() smoothlyDateTextDone: EventEmitter<void>
	@Event() smoothlyDateTextPrevious: EventEmitter<void>
	@Event() smoothlyDateTextNext: EventEmitter<void>

	componentWillLoad() {
		this.order = DateFormat.Order.fromLocale(this.locale)
		this.separator = DateFormat.Separator.fromLocale(this.locale)
	}
	async componentDidLoad() {
		await this.setValue(this.value)
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
		const yearIndex = this.order.indexOf("Y")
		const monthIndex = this.order.indexOf("M")
		const dayIndex = this.order.indexOf("D")
		this.partElements[yearIndex] && (this.partElements[yearIndex]!.innerText = this.parts.Y ?? "")
		this.partElements[monthIndex] && (this.partElements[monthIndex]!.innerText = this.parts.M ?? "")
		this.partElements[dayIndex] && (this.partElements[dayIndex]!.innerText = this.parts.D ?? "")
	}

	setPart(part: "Y" | "M" | "D", value: string | undefined) {
		this.parts = {
			...this.parts,
			[part]: value,
		}
		const index = this.order.indexOf(part)
		this.partElements[index] && (this.partElements[index]!.innerText = value ?? "")
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

	@Listen("beforeinput")
	beforeInputHandler(e: InputEvent) {
		const part = this.order[this.focusedIndex ?? 0] as "Y" | "M" | "D"
		const value = this.getInnerText(e.target)
		const nonDigitData = e.data && /\D/.test(e.data)
		const hasMaxLength = value.length >= DateFormat.Part.lengthOf(part)
		const noRangedSelection = InputSelection.isCollapsed(e.target as HTMLElement)
		if (
			(e.inputType == "insertText" || e.inputType == "insertFromPaste") &&
			(nonDigitData || (hasMaxLength && noRangedSelection))
		) {
			e.preventDefault()
		}
		if (e.inputType == "insertParagraph" || e.inputType == "insertLineBreak") {
			this.smoothlyDateTextDone.emit()
			e.preventDefault()
		}
	}

	@Listen("input", { capture: true })
	inputHandler(e: InputEvent) {
		const part = DateFormat.Order.getPart(this.order, this.focusedIndex ?? 0)
		const index = this.focusedIndex ?? 0
		const value = this.getInnerText(e.target)
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
		if (value.length >= DateFormat.Part.lengthOf(part)) {
			this.setFocus(index + 1)
		}
		const roundedValue = DateFormat.Parts.toDate(this.parts)
		if (roundedValue) {
			const roundedParts = DateFormat.Parts.fromDate(roundedValue)
			if (this.parts.D !== roundedParts?.D) {
				this.setPart("D", roundedParts?.D)
			}
		}
	}
	keyDownHandler(e: KeyboardEvent) {
		const text = this.getInnerText(e.target)
		const index = this.focusedIndex ?? 0
		if (InputSelection.isAtStart(e) && e.key == "ArrowLeft") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index - 1)
			e.preventDefault() // Keep selection
		} else if (InputSelection.isAtEnd(e) && e.key == "ArrowRight") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index + 1)
			e.preventDefault() // Keep selection
		} else if (e.key == "Home" || e.key == "ArrowUp") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(0)
			e.preventDefault() // Keep selection
		} else if (e.key == "End" || e.key == "ArrowDown") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(2)
			e.preventDefault() // Keep selection
		} else if (InputSelection.isAtStart(e) && e.key == "Backspace" && text == "") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index - 1)
			e.preventDefault() // Prevent delete previous part
		} else if (InputSelection.isAtEnd(e) && e.key == "Delete" && text == "") {
			this.autoAdvanceIfPossible(index)
			this.setFocus(index + 1)
			e.preventDefault() // Prevent delete next part
		}
	}

	commitPart(part: DateFormat.Part, value: number, index: number, max: number) {
		const clamped = Math.max(1, Math.min(value, max))
		this.setPart(part, clamped.toString().padStart(2, "0"))
		InputSelection.setPosition(this.partElements[index], 2)
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
			InputSelection.selectAll(this.partElements[index])
		}
	}

	render() {
		return (
			<Host class={{ "has-text": Object.values(this.parts).some(part => !!part) }}>
				{DateFormat.Order.toArray(this.order).map((part, index) => (
					<span
						onClick={() => {
							if (!this.readonly && !this.disabled)
								this.setFocus(index)
						}}>
						<span
							class={{
								"smoothly-date-text-part": true,
								"filled-part": (this.parts[part]?.length ?? 0) >= DateFormat.Part.lengthOf(part),
							}}
							onFocus={() => (this.focusedIndex = index)}
							onBlur={() => (this.focusedIndex = undefined)}
							onKeyDown={(e: KeyboardEvent) => this.keyDownHandler(e)}
							key={index}
							ref={el => (this.partElements[index] = el)}
							contenteditable={!(this.readonly || this.disabled)}>
							{/* year or month or day written here */}
						</span>
						<span class="guide">{DateFormat.Part.getGuide(part, this.parts[part]?.length)}</span>
						{index < 2 && <span class="smoothly-date-separator">{this.separator}</span>}
					</span>
				))}
			</Host>
		)
	}
}
