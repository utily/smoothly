export function redirect(path: string) {
	window.history.pushState({ smoothlyPath: path }, "", new URL(window.location.href).origin + path)
	window.history.back()
	window.history.forward()
}
