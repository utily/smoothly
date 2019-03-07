export type Type =
	"button" |
	"checkbox" |
	"color" |
	"date" |
	"datetime-local" |
	"email" |
	"file" |
	"hidden" |
	"image" |
	"month" |
	"number" |
	"password" |
	"radio" |
	"range" |
	"reset" |
	"search" |
	"submit" |
	"tel" |
	"text" |
	"time" |
	"url" |
	"week"

// tslint:disable-next-line: no-namespace
export namespace Type {
	export function is(value: any | Type): value is Type {
		return typeof(value) == "string" && (
			value == "button" ||
			value == "checkbox" ||
			value == "color" ||
			value == "date" ||
			value == "datetime-local" ||
			value == "email" ||
			value == "file" ||
			value == "hidden" ||
			value == "image" ||
			value == "month" ||
			value == "number" ||
			value == "password" ||
			value == "radio" ||
			value == "range" ||
			value == "reset" ||
			value == "search" ||
			value == "submit" ||
			value == "tel" ||
			value == "text" ||
			value == "time" ||
			value == "url" ||
			value == "week")
	}
	export function as(value: any | Type, fallback: Type = "text"): Type {
		return Type.is(value) ? value : fallback
	}
}
