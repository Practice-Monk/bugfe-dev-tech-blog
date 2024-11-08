import { defineClientConfig } from "@vuepress/client";
import VPCard from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/VPCard.js";
import CodeTabs from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeTabs.js";
import { hasGlobalComponent } from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-shared/lib/client/index.js";
import { CodeGroup, CodeGroupItem } from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/compact/index.js";
import { useContainer } from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/composables/container.js";
import "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/styles/container/index.scss";
import CodeDemo from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";
import "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/styles/figure.scss";
import "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/reveal.js/dist/reveal.css";
import RevealJs from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/RevealJs.js";
import { injectRevealJsConfig } from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/index.js";
import Playground from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/Playground.js";
import Tabs from "C:/Users/17759/Desktop/vuepress/bugfe-dev-tech-blog/node_modules/vuepress-plugin-md-enhance/lib/client/components/Tabs.js";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("VPCard", VPCard)
    app.component("CodeTabs", CodeTabs);
    if(!hasGlobalComponent("CodeGroup", app)) app.component("CodeGroup", CodeGroup);
    if(!hasGlobalComponent("CodeGroupItem", app)) app.component("CodeGroupItem", CodeGroupItem);
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
    injectRevealJsConfig(app);
    app.component("RevealJs", RevealJs);
    app.component("Playground", Playground);
    app.component("Tabs", Tabs);
  },
  setup: () => {
useContainer();
  }
});
