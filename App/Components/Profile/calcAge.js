import { toDate } from './ProfileFirst';
export function calcAge(dobStr) {
	let dob = toDate(dobStr);
	var diff_ms = Date.now() - dob.getTime();
	var age_dt = new Date(diff_ms);
	return Math.abs(age_dt.getUTCFullYear() - 1970);
}
