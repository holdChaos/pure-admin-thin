/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-15 20时
 * @Description: 平台 - 用户相关接口
 */
import { http } from "@/utils/http";
import { baseUrlApi } from '@/api/common'

// type Result = {
//   success: boolean;
//   data?: {
//     /** 列表数据 */
//     list: Array<any>;
//   };
// };

/** 登录 */
export const login = (data?: object) => {
  return (http.request as any)("post", baseUrlApi("/api/user/login"), { data });
};
