export class Controller {
	constructor(private component: any) {}
	onInput(e: CustomEvent<Record<string, any>>) {
		const value = e.detail[Object.keys(e.detail)[0]]
		if (Array.isArray(value))
			this.component.hasValue = value.length > 0
		else if (typeof value === "object")
			this.component.hasValue = Object.values(value).filter(value => Boolean(value)).length > 0
		else if (typeof value === "string")
			this.component.hasValue = Boolean(value)
		else if (typeof value === "boolean")
			this.component.hasValue = value
		else
			this.component.hasValue = value !== (null || undefined)
	}
}
