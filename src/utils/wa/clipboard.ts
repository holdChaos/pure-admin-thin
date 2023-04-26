/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-04 01时
 * @Description: 复制到粘贴板
 */

import { ElNotification } from 'element-plus';
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard();

export const copy = async (text: string) => {
    try{
        await toClipboard(text)
        ElNotification({
            title: '提示',
            message: '已复制到粘贴板',
            type: 'success'
        })
    } catch(e){
        ElNotification({
            title: '提示',
            message: '复制到粘贴板失败,请尝试升级或更换浏览器',
            type: 'error'
        })
        console.error('复制到粘贴板失败：', e);
        
    }
}