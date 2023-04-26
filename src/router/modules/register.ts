/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-15 09时
 * @Description: 注册
 */
export default {
  path: "/register",
  redirect: "/register/manual",
  meta: {
    icon: "Register",
    title: "账号注册",
    // showLink: false,
    rank: 1
  },
  children: [
    {
      path: "/register/manual",
      name: "register_manual",
      component: () => import("@/views/register/manual.vue"),
      meta: {
        title: "手动注册"
      }
    },
    {
      path: "/register/batch",
      name: "register_batch",
      component: () => import("@/views/register/batch.vue"),
      meta: {
        title: "批量注册"
      }
    },
  ]
} as RouteConfigsTable;

