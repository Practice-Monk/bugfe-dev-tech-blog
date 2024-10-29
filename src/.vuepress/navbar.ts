import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/md/resume",
  {
    text: "Java",
    // icon: "book",
    link: "/md/java/java01.md",
  },
  {
    text: "Spring全家桶",
    // icon: "book",
    // link: "/md/dev-log/java01.md",
    items: [
      {text: "Spring手搓",link: "xxx"},
      {text: "SpringBoot",link: "xxx"},
      {text: "SpringCloud",link: "xxx"}
    ]
  },
  // {
  //   text: "数据结构与算法",
  //   // icon: "book",
  //   link: "xxx",
  // },
  {
    text: "Redis",
    // icon: "book",
    link: "/md/dev-log/day01.md",
  },
  {
    text: "MySQL",
    // icon: "book",
    // link: "/md/dev-log/java01.md",
    items: [
      {text: "MySQL基础",link: "xxx"},
      {text: "MySQL高级",link: "xxx"}
    ]
  },
  // {
  //   text: "Netty4.x",
  //   // icon: "book",
  //   link: "xxx",
  // },
  // {
  //   text: "阿里云",
  //   // icon: "book",
  //   link: "xxx",
  // }
]);
