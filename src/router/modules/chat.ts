/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-16 06时
 * @Description: 消息模块
 */

export default {
  path: "/chat",
  redirect: "/chat/send",
  meta: {
    icon: "Chat",
    title: "消息模块",
    // showLink: false,
    rank: 9
  },
  children: [
    {
      path: "/chat/send",
      name: "chat_send",
      component: () => import("@/views/chat/send.vue"),
      meta: {
        title: "发送消息"
      }
    },
    {
      path: "/chat/sync",
      name: "chat_sync",
      component: () => import("@/views/chat/sync.vue"),
      meta: {
        title: "同步消息"
      }
    },
  ]
} as RouteConfigsTable;

