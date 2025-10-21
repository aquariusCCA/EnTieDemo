import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

export function formatToYmdHms(iso: string, zone = 'Asia/Taipei') {
  return dayjs.tz(iso, zone).format('YYYY-MM-DD HH:mm:ss');
}

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
