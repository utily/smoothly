import { FunctionalComponent, h } from "@stencil/core"

export const Button: FunctionalComponent<Button.Properties> = ({ disabled, type, link, download }) => {
	return disabled && (link || type == "link") ? (
		<slot></slot>
	) : link ? (
		<a href={link} target="_blank" download={download}>
			<slot name="start"></slot>
			<slot></slot>
			<slot name="end"></slot>
		</a>
	) : type == "link" ? (
		<a href={link}>
			<slot name="start"></slot>
			<slot></slot>
			<slot name="end"></slot>
		</a>
	) : (
		<button disabled={disabled}>
			<slot name="start"></slot>
			<slot></slot>
			<slot name="end"></slot>
		</button>
	)
}
export namespace Button {
	export interface Properties {
		disabled: boolean
		type: "link" | "button"
		link?: string
		download?: boolean
	}
}