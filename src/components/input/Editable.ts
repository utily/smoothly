import { isly } from "isly"

export interface Editable {
	edit: Editable.Edit
	readonly: boolean
	changed: boolean
	listen: Editable.Listen
}
export namespace Editable {
	export type Listen = (property: "changed", listener: (parent: Editable) => Promise<void>) => void
	export type Edit = (editable: boolean) => Promise<void>
	export const type = isly.object<Editable>({
		edit: isly.function(),
		readonly: isly.boolean(),
		changed: isly.boolean(),
		listen: isly.function<Listen>(),
	})
}
