import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/md/dev-log": [
    // "",
    {
      text: "01",
      // prefix: "md/dev-log/",
      children: ["day01","day02","day03","day04","day05","day06","day07~day08","day09~day10","day11","day12"],
    },

  ],

  "/md/java/" : [
    {
      text : "Java入门",
      children: ["java01","java02","java03","java04"],
    }
  ],

  "/md/spring/" : [{
    text : "Spring入门",
    children: ["spring01","spring02"],
  }],

  "/md/springboot/" : [{
    text : "SpringBoot入门",
    children: ["springboot01","springboot02"],
  }],

  "/md/springcloud/" : [{
    text : "SpringBoot入门",
    children: ["springcloud01","springcloud02"],
  }],

  "/md/data-structure/" : [{
    text : "MySQL进阶",
    children: ["MySQL高级"],
  }],

});
