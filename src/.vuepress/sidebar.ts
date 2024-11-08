import {sidebar} from "vuepress-theme-hope";

export default sidebar(
    {

        "/md/dev-log": [
            // "",
            {
                text: "01",
                // prefix: "md/dev-log/",
                children: ["day01", "day02", "day03", "day04", "day05", "day06", "day07~day08", "day09~day10", "day11", "day12"],
            },

        ],

        "/md/java/": [
            {
                text: "Java入门1",
                children: ["编码指南", "java02", "java03", "java04"],
            },],


        "/md/spring/": [{
            text: "Spring入门",
            children: ["spring01", "spring02", "Spring事务"],
        }],

        "/md/rabbitmq/": [{
            text: "RabbitMq",
            children: ["简述RabbitMQ的架构设计"],
        }],

        "/md/mysql/": [{
            text: "MySQL",
            // 可选的。设置分组是否默认展开，默认值是 false
            // expanded: true,
            // sidebarDepth: 2,    // 可选的, 默认值是 1
            children: ["MySQL高级", "MySQL基础日志", "MySQL事务日志", "MySQL锁"],
        }],
        //
        // "/md/springboot/" : [{
        //   text : "SpringBoot入门",
        //   children: ["springboot01","springboot02"],
        // }],
        //
        // "/md/springcloud/" : [{
        //   text : "SpringBoot入门",
        //   children: ["springcloud01","springcloud02"],
        // }],
        //
        // "/md/data-structure/" : [{
        //   text : "MySQL进阶",
        //   children: ["MySQL高级.md"],
        // }],

    }
);
