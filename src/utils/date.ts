const getTime = () => {
	const hours = new Date().getHours()
	if (hours < 6) {
		return '凌晨'
	} else if (hours < 12) {
		return '早上'
	} else if (hours < 18) {
		return '下午'
	} else {
		return '晚上'
	}
}

export { getTime }
