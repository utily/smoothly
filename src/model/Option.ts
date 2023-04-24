export interface Option {
	value: any
	slotted: Node[]
	element: HTMLSmoothlyPickerOptionElement
}
export namespace Option {
	export interface New {
		value: string
		selected: boolean
	}
}
