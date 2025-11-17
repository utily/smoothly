import { FunctionalComponent, h } from "@stencil/core"

interface TextEditableApi {}

interface TextEditableProps {
	ref?: (api: TextEditableApi) => void
	onBeforeInput?: (e: InputEvent) => void
	onInput?: (e: InputEvent) => void
}

export const SmoothlyTextEditable: FunctionalComponent<TextEditableProps> = ({ ref, onBeforeInput, onInput }) => {
	let inputElement: HTMLInputElement | undefined

	if (ref) {
		const api: TextEditableApi = {}
		ref?.(api)
	}

	return (
		<span>
			<span>{/* Used to know how wide the input should be */}</span>
			<input
				ref={el => {
					if (el && onBeforeInput) {
						inputElement?.removeEventListener("beforeinput", onBeforeInput)
						el.addEventListener("beforeinput", onBeforeInput)
					}
					inputElement = el
				}}
				onInput={() => {}}
				onFocus={() => {}}
				onBlur={() => {}}
				onKeyDown={(e: KeyboardEvent) => {}}
			/>
		</span>
	)
}
