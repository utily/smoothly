export interface Option {
	element: HTMLSmoothlyPickerOptionElement
	selected: boolean
	readonly: boolean
	visible: boolean
	search: string[]
	value: any
	slotted: Node[]
	position: number
	set: {
		selected: (selected: boolean) => void
		visible: (visible: boolean) => void
		readonly: (readonly: boolean) => void
		search: (search: string[]) => void
		value: (value: any) => void
	}
}
export namespace Option {
	export type Load = Omit<Option, "slotted">
	export interface Created {
		value: string
		selected: boolean
	}
}
