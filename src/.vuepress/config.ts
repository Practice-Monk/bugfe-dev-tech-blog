import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import * as path from "path";

const __dirname = path.resolve();


export default defineUserConfig({
  dest: "./dev-ops/nginx/html",
  base: "/",

  lang: "zh-CN",
  title: "bugfe",
  description: "关于我自己的学习成长经历",

  theme,

  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
        __dirname,
        "./components/BlogHero.vue"
    ),
  },

});
