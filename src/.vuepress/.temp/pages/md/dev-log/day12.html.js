export const data = JSON.parse("{\"key\":\"v-12027ebe\",\"path\":\"/md/dev-log/day12.html\",\"title\":\"Day012\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Day012\",\"index\":false,\"icon\":\"laptop-code\",\"category\":[\"开发笔记\",\"学习记录\"],\"description\":\"缓存第一个经典问题是缓存失效。 服务系统查热点数据，首先会查缓存，如果缓存数据不存在，就进一步查数据库，最后查到数据后回种到缓存并返回。缓存的性能比DB高50~100倍以上，所以我们希望数据查询尽可能命中缓存，这样系统负荷最小，性能最佳。 缓存里的数据基本上都是以key为索引进行存储和获取的。业务访问时，如果大量的key同时过期，很多缓存数据访问都会失...\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/md/dev-log/day12.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"bugfe\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Day012\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"缓存第一个经典问题是缓存失效。 服务系统查热点数据，首先会查缓存，如果缓存数据不存在，就进一步查数据库，最后查到数据后回种到缓存并返回。缓存的性能比DB高50~100倍以上，所以我们希望数据查询尽可能命中缓存，这样系统负荷最小，性能最佳。 缓存里的数据基本上都是以key为索引进行存储和获取的。业务访问时，如果大量的key同时过期，很多缓存数据访问都会失...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"bugfe\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Day012\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"bugfe\\\",\\\"url\\\":\\\"https://mister-hope.com\\\"}]}\"]]},\"headers\":[],\"readingTime\":{\"minutes\":4.06,\"words\":1218},\"filePathRelative\":\"md/dev-log/day12.md\",\"autoDesc\":true}")

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
