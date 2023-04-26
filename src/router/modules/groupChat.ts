/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-16 06时
 * @Description: 群聊模块
 */
export default {
  path: "/groupChat",
  redirect: "/groupChat/base",
  meta: {
    icon: "ChatGroup",
    title: "群聊模块",
    // showLink: false,
    rank: 10
  },
  children: [
    {
      path: "/groupChat/base",
      name: "groupChat_base",
      component: () => import("@/views/groupChat/base.vue"),
      meta: {
        title: "基础群聊"
      }
    },
    {
      path: "/groupChat/get",
      name: "groupChat_get",
      component: () => import("@/views/groupChat/get.vue"),
      meta: {
        title: "获取群员"
      }
    },
  ]
} as RouteConfigsTable;

