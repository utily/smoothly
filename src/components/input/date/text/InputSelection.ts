export namespace InputSelection {
	export function isAtStart(e: KeyboardEvent): boolean {
		const el = e.currentTarget as HTMLElement
		const sel = window.getSelection()
		if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode))
			return false

		const range = sel.getRangeAt(0)
		const preRange = range.cloneRange()
		preRange.selectNodeContents(el)
		preRange.setEnd(range.startContainer, range.startOffset)

		return preRange.toString().length === 0
	}

	export function isAtEnd(e: KeyboardEvent): boolean {
		const el = e.currentTarget as HTMLElement
		const sel = window.getSelection()
		if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode))
			return false

		const range = sel.getRangeAt(0)
		const postRange = range.cloneRange()
		postRange.selectNodeContents(el)
		postRange.setStart(range.endContainer, range.endOffset)

		return postRange.toString().length === 0
	}

	export function selectAll(el?: HTMLElement) {
		if (!el)
			return
		el.focus()
		const range = document.createRange()
		range.selectNodeContents(el) // Select all content inside

		const sel = window.getSelection()
		if (!sel)
			return

		sel.removeAllRanges()
		sel.addRange(range) // Apply the selection
	}
}
