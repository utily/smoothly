import { FunctionalComponent, h } from "@stencil/core"
import { Currency, Language, Locale } from "isoly"
import { Action, Converter, Formatter, get, Settings, State as TidilyState, StateEditor, Type } from "tidily"
// import { Changeable } from "./Changeable"
// import { Clearable } from "./Clearable"

export const InputField: FunctionalComponent<Input.Properties> = ({
	state,
	readonly,
	value,
	type,
	currency,
	disabled,
	required,
	name,
	placeholder,
	autocomplete,
	onBlur,
	onFocus,
	onClick,
	onInput,
	onKeyDown,
	onPaste,
}) => {
	const onInputHandler = (event: InputEvent) => {
		if (event.inputType == "insertReplacementText") {
			processKey({ key: "a", ctrlKey: true }, event.target as HTMLInputElement)
			;[...(event.data ?? "")].forEach(c => processKey({ key: c }, event.target as HTMLInputElement))
		} else {
			const backend = event.target as HTMLInputElement
			let data = backend.value
			if (data) {
				event.preventDefault()
				processKey({ key: "a", ctrlKey: true }, backend)
				data = expiresAutocompleteFix(backend, data)
				for (const letter of data)
					processKey({ key: letter }, backend)
			}
		}
		if (onInput)
			onInput(event)
	}

	const processKey = (event: Action, backend: HTMLInputElement) => {
		if (!readonly) {
			const after = Action.apply(Input.formatter(type, currency), state, event)
			Input.updateBackend(after, backend, state, value, type, currency)
		}
	}

	const expiresAutocompleteFix = (backend: HTMLInputElement, value: string) => {
		if (backend.attributes.getNamedItem("autocomplete")?.value == "cc-exp")
			value = value.match(/^20\d\d[.\D]*\d\d$/)
				? value.substring(value.length - 2, value.length) + value.substring(2, 4)
				: value.match(/^(1[3-9]|[2-9]\d)[.\D]*\d\d$/)
				? value.substring(value.length - 2, value.length) + value.substring(0, 2)
				: value.match(/^\d\d[.\D]*20\d\d$/)
				? value.substring(0, 2) + value.substring(value.length - 2, value.length)
				: value
		return value
	}

	const onInputFocus = (event: FocusEvent) => {
		const after = Input.formatter(type, currency).format(
			StateEditor.copy(Input.formatter(type, currency).unformat(StateEditor.copy({ ...state })))
		)
		if (event.target)
			Input.updateBackend(after, event.target as HTMLInputElement, state, value, type, currency)
		if (onFocus)
			onFocus(event)
	}

	const onClickInput = (event: MouseEvent) => {
		const backend = event.target as HTMLInputElement
		state = {
			...state,
			value: backend.value,
			selection: {
				start: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length,
				end: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length,
				direction: backend.selectionDirection ? backend.selectionDirection : "none",
			},
		}
		const after = Input.newState({ ...state }, type, currency)
		Input.updateBackend(after, backend, state, value, type, currency)
		if (onClick)
			onClick(event)
	}

	const onKeyDownHandler = (event: KeyboardEvent) => {
		if (event.key && !(event.key == "Unidentified")) {
			const backend = event.target as HTMLInputElement
			state = {
				...state,
				value: backend.value,
				selection: {
					start: backend.selectionStart != undefined ? backend.selectionStart : backend.value.length,
					end: backend.selectionEnd != undefined ? backend.selectionEnd : backend.value.length,
					direction: backend.selectionDirection ? backend.selectionDirection : "none",
				},
			}
			if (
				(!((event.ctrlKey || event.metaKey) && (event.key == "v" || event.key == "x" || event.key == "c")) &&
					event.key.length == 1) ||
				event.key == "ArrowLeft" ||
				event.key == "ArrowRight" ||
				event.key == "Delete" ||
				event.key == "Backspace" ||
				event.key == "Home" ||
				event.key == "End"
			) {
				event.preventDefault()
				processKey(event, backend)
			} else if (event.key == "ArrowUp" || event.key == "ArrowDown")
				event.preventDefault()
		}
		if (onKeyDown)
			onKeyDown(event)
	}

	const onPasteInput = (event: ClipboardEvent) => {
		event.preventDefault()
		let pasted = event.clipboardData ? event.clipboardData.getData("text") : ""
		const backend = event.target as HTMLInputElement
		pasted = expiresAutocompleteFix(backend, pasted)
		for (const letter of pasted)
			processKey({ key: letter }, backend)
		if (onPaste)
			onPaste(event)
	}

	return (
		<input
			name={name}
			type={state?.type}
			placeholder={placeholder}
			required={required}
			autocomplete={autocomplete ? state?.autocomplete : "off"}
			disabled={disabled}
			readOnly={readonly}
			pattern={state?.pattern && state?.pattern.source}
			value={state?.value}
			onInput={(e: InputEvent) => onInputHandler(e)}
			onFocus={e => onInputFocus(e)}
			onClick={e => onClickInput(e)}
			onBlur={e => {
				if (onBlur)
					onBlur(e)
			}}
			onKeyDown={e => onKeyDownHandler(e)}
			onPaste={e => onPasteInput(e)}
		/>
	)
}

export namespace Input {
	export interface Properties {
		// extends Clearable, Changeable
		state: Readonly<TidilyState> & Readonly<Settings>
		name: string
		placeholder?: string
		readonly?: boolean
		value: any
		type: string
		currency?: Currency
		disabled?: boolean
		required?: boolean
		autocomplete: boolean
		onBlur?: (event: FocusEvent) => void
		onFocus?: (event: FocusEvent) => void
		onClick?: (event: MouseEvent) => void
		onInput?: (event: InputEvent) => void
		onKeyDown?: (event: KeyboardEvent) => void
		onPaste?: (event: ClipboardEvent) => void
	}

	export function formatter(type: string, currency?: Currency): Formatter & Converter<any> {
		let result: (Formatter & Converter<any>) | undefined
		switch (type) {
			case "price":
				result = get("price", currency)
				break
			default:
				result = get(type as Type, getLocale())
				break
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return result || get("text")!
	}

	export function getLocale(): Locale | undefined {
		const result = navigator.language
		return Locale.is(result) ? result : Language.is(result) ? Locale.toLocale(result) : undefined
	}

	export function newState(state: TidilyState, type: string, currency?: Currency) {
		const formatter = Input.formatter(type, currency)
		return formatter.format(StateEditor.copy(formatter.unformat(StateEditor.copy(state))))
	}

	export function updateBackend(
		after: Readonly<TidilyState> & Readonly<Settings>,
		backend: HTMLInputElement,
		state: Readonly<TidilyState> & Readonly<Settings>,
		value: any,
		type: string,
		currency?: Currency
	) {
		if (after.value != backend.value)
			backend.value = after.value
		if (backend.selectionStart != undefined && after.selection.start != backend.selectionStart)
			backend.selectionStart = after.selection.start
		if (backend.selectionEnd != undefined && after.selection.end != backend.selectionEnd)
			backend.selectionEnd = after.selection.end
		backend.selectionDirection = after.selection.direction ? after.selection.direction : backend.selectionDirection
		state = after
		value = Input.formatter(type, currency).fromString(
			Input.formatter(type, currency).unformat(StateEditor.copy({ ...state })).value
		)
	}
}
