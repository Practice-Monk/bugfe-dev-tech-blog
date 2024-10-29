import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    // "",
    {
      text: "Java入门",
      prefix: "md/java/",
      children: ["java01.md","java02.md","java03.md"],
      displayAllHeaders: false
    },
    {
      text: "01",
      prefix: "md/dev-log/",
      children: ["day01.md","day02.md","day03.md","day04.md","day05.md","day06.md","day07~day08.md","day09~day10.md","day11.md","day12.md"],
      displayAllHeaders: false
    },

  ],





});
