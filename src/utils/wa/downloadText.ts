/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-04 02时
 * @Description: 生成txt并下载
 */

import { ElNotification } from "element-plus"

/**
 * 生成txt并下载
 * @param fileName 文件名
 * @param context txt内容
 */
export function downloadText(fileName: string, context: string) {
    try{
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(context))
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        element.click()
        ElNotification({
            title: '提示',
            message: '文件已下载',
            type: 'success'
        })
    } catch(e){
        ElNotification({
            title: '提示',
            message: '下载文件失败,请尝试升级或更换浏览器',
            type: 'error'
        })
        console.error('下载文件失败：', e);
    }
}
