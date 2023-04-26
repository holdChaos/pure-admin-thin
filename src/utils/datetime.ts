/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-19 22时
 * @Description: 日期处理相关函数
 */


/**给定一个日期数据，获取当天00:00和23:59的数据 */
export function changeDateTime(date: Date, format: "start" | "end"): Date {
  if (format === "start") {
    date.setHours(0, 0, 0, 0);
  } else if (format === "end") {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}
