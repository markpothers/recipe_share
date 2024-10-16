import { getTimeStringFromMinutes, getMinutesFromTimeString } from "./getTimeStringFromMinutes"

describe("time string conversion functions", () => {

	test("getTimeStringFromMinutes converts an integer of minutes to a string like 01:00", () => {
		const testValues = [30, 45, 60, 150, 255, 345, 600]
		const testResults = ["00:30", "00:45", "01:00", "02:30", "04:15", "05:45", "10:00"]
		testValues.forEach((min, index) => {
			expect(getTimeStringFromMinutes(min)).toEqual(testResults[index])
		})
	})

	test("getTimeStringFromMinutes returns 00:00 if it receives a falsey value", () => {
		expect(getTimeStringFromMinutes(null)).toEqual("00:00")
	})

	test("getTimeStringFromMinutes returns 00:00 if it receives not an integer", () => {
		// @ts-ignore
		expect(getTimeStringFromMinutes("test")).toEqual("00:00")
	})

	test("getMinutesFromTimeString converts a string of hours and minutes to total minutes", () => {
		const testValues = ["00:30", "00:45", "01:00", "02:30", "04:15", "05:45", "10:00"]
		const testResults = [30, 45, 60, 150, 255, 345, 600]
		testValues.forEach((timeString, index) => {
			expect(getMinutesFromTimeString(timeString)).toEqual(testResults[index])
		})
	})

	test("getMinutesFromTimeString returns 0 if it receives a falsey value", () => {
		expect(getMinutesFromTimeString(null)).toEqual(0)
	})

	test("getMinutesFromTimeString returns 0 if it receives not an integer", () => {
		expect(getMinutesFromTimeString("test")).toEqual(0)
	})

})
