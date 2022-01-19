export type GoogleFont = string

export namespace GoogleFont {
	export function is(value: string | any): boolean {
		return (
			typeof value == "string" &&
			!/[</>"'`]/g.test(value) &&
			/^([a-zA-ZäöüåßÄÖÜÅ+ ])+(:(ital(,)?)?((wght@([01],\d{3})(;[01],\d{3})+))?)?$/g.test(value)
		)
	}
	export function getFont(value: string): string | undefined {
		return is(value) ? value.split(":")[0].replace(/\+/g, " ") : undefined
	}
	export function styleImportString(value: string): string | undefined {
		return is(value)
			? `@import url('https://fonts.googleapis.com/css2?family=${value.replace(/ /g, "+")}&display=swap`
			: undefined
	}
}
