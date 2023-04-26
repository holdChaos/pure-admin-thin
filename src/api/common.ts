/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-16 01时
 * @Description: 接口请求地址
 */

const baseUrl_wa = "http://43.154.238.213:8899";
const baseUrl = "http://43.154.238.213:9999";

/** 接收一个url地址名称，返回带有统一前缀、后缀的地址 */
function baseUrlApi_wa(url: string): string{
    return `${ baseUrl_wa }${ url }`;
}


/** 接收一个url地址名称，返回带有统一前缀、后缀的地址 */
function baseUrlApi(url: string): string{
    return `${ baseUrl }${ url }`;
}

// 商业号注册 - 发送验证码
export const registerWhatsApp: string = baseUrlApi_wa("ws/SendBusinessRegisterSms")
// 商业号注册 - 校验验证码
export const verifyWhatsApp: string = baseUrlApi_wa("ws/SendBusinessRegisterVerify")

export {
    baseUrl,
    baseUrlApi,
    baseUrl_wa,
    baseUrlApi_wa
}