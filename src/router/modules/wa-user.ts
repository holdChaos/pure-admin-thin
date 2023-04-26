/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-15 22时
 * @Description: wa用户相关
 */
export default {
  path: "/wa-user",
  redirect: "/wa-user/info",
  meta: {
    icon: "User",
    title: "用户相关",
    // showLink: false,
    rank: 10
  },
  children: [
    {
      path: "/wa-user/info",
      name: "wa-user_info",
      component: () => import("@/views/wa-user/info.vue"),
      meta: {
        title: "用户资料"
      }
    },
    {
      path: "/wa-user/contacts",
      name: "wa-user_contacts",
      component: () => import("@/views/wa-user/contacts.vue"),
      meta: {
        title: "通讯录"
      }
    },
  ]
} as RouteConfigsTable;

