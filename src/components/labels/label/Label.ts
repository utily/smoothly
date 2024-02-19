export interface Label {
	name: string
	color: string
	description: string
}

export namespace Label {
	export type Interactive = Label & {
		status: "disabled" | "enabled" | "added" | "removed"
		submit: boolean
	}
	export function switchStatus(label: Interactive): Interactive {
		let result: Interactive
		switch (label.status) {
			case "added":
				result = { ...label, status: "removed", submit: false }
				break
			case "disabled":
				result = { ...label, status: "enabled", submit: !label.submit }
				break
			case "enabled":
				result = { ...label, status: "disabled", submit: !label.submit }
				break
			default:
				result = label
				break
		}
		return result
	}
	export function onSubmit(label: Interactive): Interactive {
		let result: Interactive
		switch (label.status) {
			case "added":
				result = { ...label, status: "enabled", submit: false }
				break
			case "disabled":
			case "enabled":
				label.submit = false
				result = label
				break
			default:
				result = label
				break
		}
		return result
	}
}
