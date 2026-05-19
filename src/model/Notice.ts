export class Notice {
	private timer?: number
	get state(): Notice.State {
		return this.stateValue
	}
	set state(value: Notice.State) {
		if (this.stateValue != value) {
			this.stateValue = value
			this.emit()
		}
	}

	private listeners: Notice.Listener[] = []
	get message(): string {
		return this.messageValue
	}
	set message(value: string) {
		if (this.messageValue != value) {
			this.messageValue = value
			this.emit()
		}
	}
	private constructor(private stateValue: Notice.State, private messageValue: string, private task?: Notice.Task, private lifetime = 15000) {
		switch (stateValue) {
			case "delayed":
				this.timer = window.setTimeout(() => this.execute(), 5000)
				break
			case "executing":
				this.execute()
				break
			case "success":
			case "warning":
			case "failed":
				this.startCloseTimer()
				break
			default:
				break
		}
	}
	listen(listener: Notice.Listener) {
		this.listeners.push(listener)
	}
	unlisten(listener: Notice.Listener) {
		this.listeners.filter(l => l != listener)
	}
	private emit() {
		this.listeners.forEach(l => l(this))
	}
	private execute() {
		this.clearTimer()
		if (this.task) {
			this.state = "executing"
			this.task(this).then(r => {
				this.messageValue = r[1] // emit is triggered by the state change below
				this.state = r[0] ? "success" : "failed"
				this.startCloseTimer()
			})
		} else
			this.state = "failed"
	}
	private startCloseTimer() {
		this.timer = window.setTimeout(() => this.close(), this.lifetime)
	}

	close() {
		this.clearTimer()
		this.state = "closed"
	}
	private clearTimer() {
		if (this.timer) {
			window.clearTimeout(this.timer)
			this.timer = undefined
		}
	}

	static delay(message: string, task: Notice.Task, lifetime?: number): Notice {
		return new Notice("delayed", message, task, lifetime)
	}
	static execute(message: string, task: Notice.Task, lifetime?: number): Notice {
		return new Notice("executing", message, task, lifetime)
	}
	static succeeded(message: string, lifetime?: number): Notice {
		return new Notice("success", message, undefined, lifetime)
	}
	static failed(message: string, lifetime?: number): Notice {
		return new Notice("failed", message, undefined, lifetime)
	}
	static warn(message: string, lifetime?: number): Notice {
		return new Notice("warning", message, undefined, lifetime)
	}
}
export namespace Notice {
	export type State = "delayed" | "executing" | "success" | "warning" | "failed" | "closed"
	export type Listener = (notice: Notice) => void
	export type Task = (notice: Notice) => Promise<[boolean, string]>
}
