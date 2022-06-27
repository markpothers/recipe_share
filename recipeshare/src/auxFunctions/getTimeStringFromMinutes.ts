

export const getTimeStringFromMinutes = (totalMinutes: number): string => {
	if (totalMinutes) {
		let hr = (Math.floor(totalMinutes / 60)).toString().padStart(2, "0")
		let min = (totalMinutes - (parseInt(hr) * 60)).toString().padStart(2, "0")
		if (hr == "NaN" || min == "NaN") {
			return "00:00"
		} else {
			return `${hr}:${min}`
		}
	} else {
		return "00:00"
	}
}

export const getMinutesFromTimeString = (timeString: string): number => {
	if (timeString) {
		let split = timeString.split(":")
		let totalMinutes = (parseInt(split[0]) * 60) + (parseInt(split[1]))
		if (isNaN(totalMinutes)) {
			return 0
		} else {
			return totalMinutes
		}
	} else {
		return 0
	}
}
