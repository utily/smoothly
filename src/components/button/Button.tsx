import { FunctionalComponent, h } from "@stencil/core"
import { Color, Fill } from "../../model"

export const Button: FunctionalComponent<Button.BaseProps> = ({ disabled, type, link, download, icon }, children) => {
	if (icon)
		return type == "link" || link ? (
			<a href={link}>
				<button disabled={disabled}>{...children}</button>
			</a>
		) : (
			<button disabled={disabled}>{...children}</button>
		)

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
	export interface BaseProps {
		disabled: boolean
		type: "link" | "button"
		link?: string
		download?: boolean
		icon?: boolean
	}

	export interface StyleProps {
		color?: Color
		expand?: "block" | "full"
		fill?: Fill
		size: "small" | "large" | "icon" | "flexible"
		shape?: "rounded"
	}
}
