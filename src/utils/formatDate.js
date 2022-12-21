import format from "date-fns/format";
import isThisYear from "date-fns/isThisYear";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export function formatPostDate(date) {
  const formatShort = format(new Date(date), "MMMM d").toUpperCase();
  const formatLong = format(new Date(date), "MMMM d, yyy").toUpperCase();

  return isThisYear(new Date(date)) ? formatShort : formatLong;
}

export function formatDateToNowShort(date) {
  return formatDistanceStrict(new Date(date), new Date(Date.now()))
    .split(" ")
    .map((s, i) => (i === 1 ? s[0] : s))
    .join("");
}

export function formatDateToNow(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true }).toUpperCase();
}
