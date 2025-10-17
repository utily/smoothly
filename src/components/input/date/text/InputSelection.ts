export namespace InputSelection {
	export function isAtStart(event: KeyboardEvent): boolean {
		const el = event.currentTarget as HTMLElement
		const sel = window.getSelection()
		if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode))
			return false

		// Only trigger if there is no selection (caret only)
		if (!sel.isCollapsed)
			return false

		const range = sel.getRangeAt(0)
		const preRange = range.cloneRange()
		preRange.selectNodeContents(el)
		preRange.setEnd(range.startContainer, range.startOffset)

		return preRange.toString().length === 0
	}

	export function isAtEnd(event: KeyboardEvent): boolean {
		const el = event.currentTarget as HTMLElement
		const sel = window.getSelection()
		if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode))
			return false

		// Only trigger if there is no selection (caret only)
		if (!sel.isCollapsed)
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

	export function setPosition(el: HTMLElement | undefined, index: number) {
		if (!el)
			return

		el.focus()

		const selection = window.getSelection()
		if (!selection)
			return

		const range = document.createRange()
		const textNode = el.firstChild || el

		const position = Math.max(0, Math.min(index, el.innerText.length))
		range.setStart(textNode, position)
		range.collapse(true)

		selection.removeAllRanges()
		selection.addRange(range)
	}

	export function isCollapsed(el: HTMLElement): boolean {
		const sel = window.getSelection()
		if (!sel || sel.rangeCount === 0)
			return true // nothing selected at all

		const range = sel.getRangeAt(0)

		// Make sure selection is inside our element
		if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) {
			return true
		}

		return range.collapsed
	}
}
