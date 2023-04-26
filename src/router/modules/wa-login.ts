/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-16 06时
 * @Description: wa账号登录
 */
export default {
  path: "/wa-login",
  redirect: "/wa-login/login",
  meta: {
    icon: "Login",
    title: "账号注册",
    // showLink: false,
    rank: 6
  },
  children: [
    {
      path: "/wa-login/login",
      name: "wa_login",
      component: () => import("@/views/chat/index.vue"),
      meta: {
        title: "登录"
      }
    }
  ]
} as RouteConfigsTable;

