import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/md/resume",
  {
    text: "Java",
    // icon: "book",
    link: "/md/java/编码指南",

  },
  {
    text: "开发日志",
    // icon: "book",
    link: "/md/dev-log/day01",
  },
  {
    text: "Spring全家桶",
    // icon: "book",
    // link: "/md/dev-log/springboot01.md",
    items: [
      {text: "Spring手搓",link: "/md/spring/spring01"},
      {text: "SpringBoot",link: "/md/springboot/springboot01"},
      {text: "SpringCloud",link: "/md/springcloud/springcloud01"}
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
    // link: "/md/dev-log/springboot01.md",
    items: [
      {text: "MySQL基础",link: "xxx"},
      {text: "MySQL高级.md",link: "xxx"}
    ]
  },
  {
    text: "RabbitMq",
    // icon: "book",
    link: "/md/rabbitmq/简述RabbitMQ的架构设计.md",
  },
  // {
  //   text: "阿里云",
  //   // icon: "book",
  //   link: "xxx",
  // }
]);
