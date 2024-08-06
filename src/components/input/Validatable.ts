import { isly } from "isly"

export interface Validatable {
	validate: () => Promise<boolean>
}

export namespace Validatable {
	export const type = isly.object<Validatable>({
		validate: isly.function(),
	})
	export const is = type.is
}
