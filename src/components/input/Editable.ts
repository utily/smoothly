import { isly } from "isly"

export interface Editable {
	edit: Editable.Edit
	readonly: boolean
	listenReadonly?: Editable.ListenReadonly
}
export namespace Editable {
	export type ListenReadonly = (property: "readonly", listener: (parent: Editable) => Promise<void>) => void
	export type Edit = (editable: boolean) => Promise<void>
	export const type = isly.object<Editable>({
		edit: isly.function(),
		readonly: isly.boolean(),
		listenReadonly: isly.function<ListenReadonly>().optional(),
	})
}
