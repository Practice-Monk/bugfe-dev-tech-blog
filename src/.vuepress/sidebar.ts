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
      children: ["java01","java02","java03"],
    }
  ],

});
