import { isly } from "isly"

export interface Key {
	name: string
	key: string
	shift: boolean
	ctrl: boolean
	alt: boolean
	meta: boolean
}

export namespace Key {
	export const type = isly.object<Key>({
		name: isly.string(),
		key: isly.string(),
		shift: isly.boolean(),
		ctrl: isly.boolean(),
		alt: isly.boolean(),
		meta: isly.boolean(),
	})
	export const is = type.is

	export function create(name: string, event: KeyboardEvent): Key {
		return {
			name,
			key: event.key,
			shift: event.shiftKey,
			ctrl: event.ctrlKey,
			alt: event.altKey,
			meta: event.metaKey,
		}
	}
}
