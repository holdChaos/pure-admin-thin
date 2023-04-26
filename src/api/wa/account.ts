/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-16 01时
 * @Description: wa协议 - 账号相关
 */

import { http } from "@/utils/http";
import { agreement } from "@/utils/http/manual"
import { baseUrlApi, baseUrlApi_wa } from '@/api/common'

// type Result = {
//   success: boolean;
//   data?: {
//     /** 列表数据 */
//     list: Array<any>;
//   };
// };

/** 批量注册 */
export const register = (data?: object) => {
  return (http.request as any)("post", baseUrlApi("/api/wa/register"), { data });
};

/** 获取账号列表 */
export const list = (data?: object) => {
  return (http.request as any)("get", baseUrlApi("/api/wa/list"), { data });
};

/** 手动发码 - 协议接口，单独区分Axios封装，使用agreement */
export const register_manual = (data?: object) => {
  return (agreement.request as any)(
    "post",
    baseUrlApi_wa("/ws/SendBusinessRegisterSms"),
    { data },
    { headers: { 'Content-Type': 'application/json' } }
  );
};

/** 手动校验 - 协议接口，单独区分Axios封装，使用agreement */
export const verify_manual = (data?: object) => {
  return (agreement.request as any)(
    "post",
    baseUrlApi_wa("/ws/SendBusinessRegisterVerify"),
    { data },
    { headers: { 'Content-Type': 'application/json' } }
  );
};