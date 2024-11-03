export const data = JSON.parse("{\"key\":\"v-7c27fd02\",\"path\":\"/md/dev-log/\",\"title\":\"开发日志\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"开发日志\",\"index\":false,\"icon\":\"laptop-code\",\"category\":[\"自我介绍\",\"专业技能\",\"项目经验\"]},\"headers\":[],\"readingTime\":{\"minutes\":0.08,\"words\":25},\"filePathRelative\":\"md/dev-log/README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
