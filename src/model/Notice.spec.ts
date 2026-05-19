import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Notice } from "./Notice"

describe("Notice", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})
	afterEach(() => {
		vi.useRealTimers()
	})

	describe("default lifetime (15s)", () => {
		it("succeeded closes after 15s", () => {
			const notice = Notice.succeeded("done")
			expect(notice.state).toEqual("success")
			vi.advanceTimersByTime(14999)
			expect(notice.state).toEqual("success")
			vi.advanceTimersByTime(1)
			expect(notice.state).toEqual("closed")
		})
		it("failed closes after 15s", () => {
			const notice = Notice.failed("error")
			expect(notice.state).toEqual("failed")
			vi.advanceTimersByTime(15000)
			expect(notice.state).toEqual("closed")
		})
		it("warn closes after 15s", () => {
			const notice = Notice.warn("watch out")
			expect(notice.state).toEqual("warning")
			vi.advanceTimersByTime(15000)
			expect(notice.state).toEqual("closed")
		})
	})

	describe("custom lifetime", () => {
		it("succeeded closes after custom lifetime", () => {
			const notice = Notice.succeeded("done", 5000)
			vi.advanceTimersByTime(4999)
			expect(notice.state).toEqual("success")
			vi.advanceTimersByTime(1)
			expect(notice.state).toEqual("closed")
		})
		it("failed closes after custom lifetime", () => {
			const notice = Notice.failed("error", 3000)
			vi.advanceTimersByTime(2999)
			expect(notice.state).toEqual("failed")
			vi.advanceTimersByTime(1)
			expect(notice.state).toEqual("closed")
		})
		it("warn closes after custom lifetime", () => {
			const notice = Notice.warn("watch out", 1000)
			vi.advanceTimersByTime(999)
			expect(notice.state).toEqual("warning")
			vi.advanceTimersByTime(1)
			expect(notice.state).toEqual("closed")
		})
		it("execute closes after custom lifetime once task resolves", async () => {
			const task: Notice.Task = () => Promise.resolve([true, "finished"])
			const notice = Notice.execute("running", task, 2000)
			expect(notice.state).toEqual("executing")
			await Promise.resolve() // flush microtasks so task .then runs
			expect(notice.state).toEqual("success")
			vi.advanceTimersByTime(1999)
			expect(notice.state).toEqual("success")
			vi.advanceTimersByTime(1)
			expect(notice.state).toEqual("closed")
		})
	})

	describe("manual close", () => {
		it("closes immediately and notifies listener", () => {
			const notice = Notice.succeeded("done")
			const states: Notice.State[] = []
			notice.listen(n => states.push(n.state))
			notice.close()
			expect(notice.state).toEqual("closed")
			expect(states).toEqual(["closed"])
		})
		it("does not fire again after manual close", () => {
			const notice = Notice.succeeded("done", 5000)
			const states: Notice.State[] = []
			notice.listen(n => states.push(n.state))
			notice.close()
			vi.advanceTimersByTime(5000)
			expect(states).toEqual(["closed"])
		})
	})
})
