import { FunctionalComponent, h } from "@stencil/core"
import { redirect } from "../../model"

export const Button: FunctionalComponent<Button.Properties> = ({ disabled, type, link }, children) => {
	return disabled && (link || type == "link") ? (
		<slot></slot>
	) : type == "link" ? (
		<a href={link} onClick={!link || !local(link) ? undefined : e => (e.preventDefault(), redirect(convert(link)))}>
			<slot name="start"></slot>
			<slot></slot>
			{children}
			<slot name="end"></slot>
		</a>
	) : type == "download" ? (
		<a href={link} target="_blank" download>
			<slot name="start"></slot>
			<slot></slot>
			{children}
			<slot name="end"></slot>
		</a>
	) : (
		<button type="button" disabled={disabled}>
			<slot name="start"></slot>
			<slot></slot>
			{children}
			<slot name="end"></slot>
		</button>
	)
}
function convert(path: string): string {
	let result: ReturnType<typeof convert>
	if (path.startsWith(window.location.origin))
		result = new URL(path).pathname
	else if (path.match(/^\//))
		result = new URL(path, window.location.origin).pathname
	else
		result = new URL(`${window.location.pathname.replace(/\/+$/, "")}/${path}`, window.location.origin).pathname

	return result
}

function local(path: string): boolean {
	return new URL(path, window.location.origin).origin == window.location.origin
}
export namespace Button {
	export interface Properties {
		disabled: boolean
		type: "link" | "button" | "download"
		link?: string
	}
}
