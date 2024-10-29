---
title: MySQL进阶
index: false
#icon: laptop-code
category:
  - 开发笔记
  - 学习记录
---
<h1 id="e16832e9">1 MySQL环境搭建</h1>
<h2 id="efa975da">1.0 安装Docker环境</h2>
```shell
启动docker
systemctl start docker
#启动nginx
docker run --name myapp-nginx -d nginx
#停止容器
docker stop 容器名/容器id
#删除容器
docker rm -f 容器名/容器id
#删除镜像
docker rmi -f 镜像名/镜像id
# 查询所有正在运行的容器列表
docker ps
# # 查询所有容器列表
docker ps  -a

#启动nginx
docker run --name myapp-nginx -d nginx

#宿主机ip:80----浏览器
#端口的映射
docker run --name myapp-nginx1 -p 88:80 -d nginx
#宿主机ip:宿主机端口（88）----浏览器访问

#目录挂载：
# Redis/ES/MySQL----产生的数据都在容器中的某个目录下。
# 该容器如果删除之后，重新在启动，数据全部都丢失了。-----容器数据的持久化。

#-v:做目录映射。
# docker run --name myapp-nginx1 -p 88:80  -d nginx
#方式一：宿主机的目录以/开始----未来容器启动的时候以宿主机的挂载目录为准。---适合容器的数据挂载
#方式二：宿主机的目录不是以/开始，而是直接任意给定一个名字-----未来容器中会多一个资源叫做volume.----而这个卷所挂载的目录在：/var/lib/docker/volumes/卷的名字/_data。且用这种方式完成的目录挂载，是直接将容器对应目录的文件挂载出来。---适合配置文件的挂载。
```

[http://docker.p2hp.com/](http://docker.p2hp.com/)

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701172970900-492e7d31-3a3d-4f07-807d-4d69cd3ad224.png)

> 检查一下又没有安装docker，若没有安装，直接参考安装。
>

```shell
docker  ps
```

**1.找到linux安装环境、**

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701173092695-db520a09-a120-48f8-8b8e-47661e8a1b97.png)

**2.找到引擎版本的centos安装**

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701174661992-7fa1a0f6-47e8-4489-adea-27840ef69752.png)

**最终安装的操作文档**

[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

**3.卸载机器中之前的docker**

```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

**4.安装用到的插件以及添加一个docker仓库**

```shell
sudo yum install -y yum-utils
#安装yum的一些相关工具包
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
 #添加一个docer仓库
```

**5.使用yum进行安装**

```shell
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
#docker-ce:安装docker的引擎
#docker-ce-cli:安装docker的客户端：docker ps  docker --version
# containerd.io dokcer 镜像
#docker-compose:docker的编排插件：
#ngixn:
docker run --name=myngixn  -d nginx
#比如未来各个容器可能需要用到同一个网路，docker的自定义网络
#比如未来各个容器将数据挂载到容器外的宿主机中。【因为容器一旦删除，容器中的所有数据全部都丢了，为了将容器的数据持久化，所以不得不去做数据的挂载数据】
#比如说让各个容器在宿主机以外的人都能访问到，需要将容器的端口和宿主机的端口做映射。以后容器所在的宿主机以外的网络都可以访问到各个容器内部的服务。
#1数据挂载
#端口映射
#自定义网络。
docker run --name=myngixn  -p 80 88(宿主机的端口):80 -v /mydata/nginx:/usr/share/nignx/html -d nginx


docker run --name app-mysql -e MYSQL_ROOT_PASSWORD=root  -p 3306:3306 -d mysql:5.7.26

#es
# mysqsl
# mysql2
# mysql3
# redis
# nginx
# kibana
# mq
# nacos
#等各种中间件，都是去在启动的时候来执行各种容器的挂载操作。
# docker-compse:一件启动。
未来将各个中间件容器的命令全部都编排到一个.yaml文件中去，然后，想去启动各个容器。就可以直接使用
docker-compose -f mall.yaml up# 代表一件启动这个.yaml文件中的所有容器。
```

**6.指定一下docker的镜像来源-配置阿里云镜像**

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://ji7xxdpc.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
#开机自启动docker
systemctl enable docker --now
```

**7.测试docker安装**

```shell
docker ps
docker --version
```

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1700995895400-2aea094e-7e72-4566-a27a-aebff6ab0917.png)

代表docker安装成功。

**若虚拟机已有Docker则直接进行1.1步骤。**

---

<h2 id="4e11f7ae">1.1 Docker安装MySQL</h2>
使用Docker安装MySQL，具体操作命令如下所示：

```shell
docker pull mysql:8.0.29

docker run -d \
-p 3306:3306 \
-v mysql8_conf:/etc/mysql/conf.d \
-v mysql8_data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=root \
--name atguigu-mysql8 \
--restart=always \
mysql:8.0.29
#--restart=always 开机自启动
```

<h2 id="cba56c7a">1.2 测试远程链接</h2>
测试连接：MySQL8版本，图形连接时还会出现如下问题 MySQL8版本，图形连接时还会出现如下问题

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701174878767-3a364004-8180-4ed5-a2de-567e46776558.png)

配置新连接报错：错误号码 2058，出现这个原因是MySQL 8 之前的版本中加密规则是**mysql_native_password**，而在MySQL 8之后，加密规则是

**caching_sha2_password**。

解决方案:

方案一：升级SQLyog和Navicat（因此，新版SQLyog和Navicat不会出现此问题）

方案二：把MySQL用户登录密码加密规则还原成mysql_native_password。



解决方案： 登录你的 MySQL 数据库 登录你的 MySQL 数据库

```shell
#进入容器：env LANG=C.UTF-8 避免容器中显示中文乱码
docker exec -it atguigu-mysql8 env LANG=C.UTF-8 /bin/bash

#进入容器内的mysql命令行
mysql -uroot -p

#修改默认密码校验方式
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
```

然后再重新配置SQLyog的连接，重新填写密码，则可连接成功了。

<h2 id="7bcdfb20">1.3 字符集</h2>
<h3 id="da3c626e">1.3.1 默认字符集</h3>
MySQL 8版本之前，默认字符集为 **latin1**（ISO-8859-1） ，不支持中文，使用前必须设置字符集为utf8或utf8mb4。从MySQL 8开始，数据库的默认字符集为 utf8mb4 ，从而避免中文乱码的问题。

```shell
# 查看MySQL使用的字符集
SHOW VARIABLES LIKE '%char%';
```

<h3 id="17ccd37f">1.3.2 更改字符集</h3>
具体步骤：

1、编辑MySQL配置文件：打开MySQL的配置文件，通常是my.cnf（Linux）或my.ini（Windows）。

2、定位到[mysqld]部分：在配置文件中找到 [mysqld] 部分，这是MySQL服务器的配置部分。

3、添加字符集设置：在 [mysqld] 部分添加以下两行配置，用于设置默认字符集为utf8：

```shell
[mysqld]
character-set-server=utf8
collation-server=utf8_general_ci# 排序规则
```

这将设置MySQL服务器的默认字符集为UTF-8，并使用utf8_general_ci作为默认的排序规则。

4、保存并关闭配置文件：

```shell
systemctl restart mysql容器名/id;
```

5、重启MySQL服务：重启MySQL服务，以使配置更改生效。

<h3 id="54450da2">1.3.3 utf8与utf8mb4</h3>
utf8 字符集表示一个字符需要使用1～4个字节，但是我们常用的一些字符使用1～3个字节就可以表示了。而字符集表示一个字符所用的最大字节长度，在某些方面会影响系统的存储和性能，所以设计MySQL的设计者偷偷的定义了两个概念：

**utf8_ _utf8 字符集，只使用1～3个字节表示字符（无法存储emoji表情）。

**utf8mb4**：utf8mb4正宗的 utf8 字符集，使用1～4个字节表示字符。

<h2 id="9fba3971">1.4 sql_mode</h2>
<h3 id="4798fe68">1.4.1 sql_mode简介</h3>
**<font style="color:#DF2A3F;">sql_mode</font>**是MySQL中的一个系统变量，用于控制MySQL服务器在执行SQL语句时的行为和规则。**它定义了MySQL对于SQL语句的语法、数据校验和处理方式的严格程度。**

```plain
select * from t1  where id=xxx and name=yyy group by deptId;
```



```sql
SHOW VARIABLES LIKE 'sql_mode';
```

常见的sql_mode值包括：

1、**<font style="color:#DF2A3F;">STRICT_TRANS_TABLES</font>**：在该模式下，如果一个值不能插入到一个事务表中，则中断当前的操作。

对于单个**<font style="color:#DF2A3F;">insert</font>**操作，无论插入单行或是多行，只要插入数据与字段类型不兼容，则本次insert操作失败并回滚；

对于多个**<font style="color:#DF2A3F;">insert</font>**操作，如果插入数据的第一行内容与字段类型兼容，但后续的数据存在不兼容的情况，则兼容的数据正常插入，不兼容的数据则会报错并终止insert操作

```sql
#建库语句
CREATE DATABASE atguigudb;
USE atguigudb;
#建表语句
CREATE TABLE temp(id INT, deptId int(10),`date` datetime);
# 设置sql_mode
set  session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE，ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


# 测试数据
insert into temp1(id,deptId,date)VALUES(2,1002,now());
insert into temp1(id,deptId,date)VALUES(3,'abc',now());
insert into temp1(id,deptId,date)VALUES(4,'bcd',now());

insert into temp1 values (6,1,now()),(7,'a',now());//整个insert的插入都会失败
```

2、**<font style="color:#DF2A3F;">NO_ZERO_IN_DATE</font>**：不允许日、月以及日月都为零，但允许年月日都为零

测试时注意：在该模式下测试要将**NO_ZERO_DATE**去掉

```sql
set  session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

INSERT into temp1 VALUES(1,1,'2020-10-10')#sucess
INSERT into temp1 VALUES(1,1,'0000-10-10')#sucess
INSERT into temp1 VALUES(2,1,'2020-00-10')#fail--月为0
INSERT into temp1 VALUES(2,2,'2020-10-00')#fail--日为0
INSERT into temp1 VALUES(2,1,'2022-00-00');#fail--日月为0
insert into temp1 values(2,1000,'0000-00-10') #fail--年月为0
insert into temp1 values(2,1000,'0000-11-00') #fail--年日为0
INSERT into temp1 VALUES(2,2,'0000-00-00')#success
```

3、**<font style="color:#DF2A3F;">NO_ZERO_DATE</font>**：在该模式下，禁止使用零值，例如'0000-00-00'或'0000-00-00 00:00:00'，否则会抛出错误。

测试时注意：在该模式下测试要将**NO_ZERO_IN_DATE**去掉

```sql
set  session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

insert into temp1 values(3,1,'0000-00-00');===fail
insert into temp1 values(3,1,'0000-00-00 00:00:00');===fail
insert into temp1 values(3,1,'0000-11-10');===sucess
insert into temp1 values(4,1,'2020-00-10');===sucess
insert into temp1 values(5,1,'2020-11-00');===sucess
```

4、**<font style="color:#DF2A3F;">ERROR_FOR_DIVISION_BY_ZERO</font>**：在该模式下，当除数为零时，执行除法运算会抛出错误,如果未给出该模式，那么数据被零除时MySQL返回NULL。

```sql
set session sql_mode='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO';

insert into temp values(1,10/0,'2020-10-02');
```

5、**<font style="color:#DF2A3F;">ONLY_FULL_GROUP_BY</font>**：在该模式下，要求GROUP BY子句中的列必须出现在SELECT列表中，或者是聚合函数的参数，否则会抛出错误。

6、**<font style="color:#DF2A3F;">NO_ENGINE_SUBSTITUTION</font>**：在该模式下，如果需要的存储引擎被禁用，那么抛出错误。不能执行，不设置此值时，用默认的存储引擎替代，**但是不会抛出错误。**

除了上述常见的sql_mode值，还有其他一些选项可以根据需要进行配置。

可以通过以下方式查看当前的sql_mode设置：

<h3 id="57179dbb">1.4.2 更改sql_mode</h3>
<h4 id="45ffc8ca">临时设置</h4>
```java
SET GLOBAL sql_mode = 'mode1,model2,...';  -- 全局针对所有的客户端连接有效，要重新启动客户端生效，重启MySQL服务后失效
SET SESSION sql_mode = 'mode1,model2,...'; -- 当前会话生效，关闭当前会话就不生效了。可以省略SESSION关键字
```

<h4 id="01d38cc9">永久设置</h4>
在mysql配置文件中配置，永久生效：在mysql配置文件中配置，永久生效：在宿主机上执行以下命令，创建配置文件：

```shell
vim /var/lib/docker/volumes/mysql8_conf/_data/base.cnf
```

编辑配置文件

```plain
[mysqld]
sql-mode = "mode1,model2,..."
```

重启mysql容器

```bash
docker restart atguigu-mysql8
```

<h3 id="8533f3a8">1.4.3 案例演示</h3>
建表并插入数据：

```sql
CREATE DATABASE atguigudb;
USE atguigudb;
CREATE TABLE employee(id INT, `name` VARCHAR(16),age INT,dept INT);
INSERT INTO employee VALUES(1,'zhang3',33,101);
INSERT INTO employee VALUES(2,'li4',34,101);
INSERT INTO employee VALUES(3,'wang5',34,102);
INSERT INTO employee VALUES(4,'zhao6',34,102);
INSERT INTO employee VALUES(5,'tian7',36,102);
```

需求：查询每个部门年龄最大的人

```sql
-- 错误演示
SELECT `name`, dept, MAX(age) FROM employee GROUP BY dept;
```

以上查询语句在 **ONLY_FULL_GROUP_BY** 模式下查询出错，因为select子句中的name列并没有出现在group by子句中，也没有出现在函数中：

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701176850539-1b9dee55-f098-4352-85ba-d01eeeff494a.png)

在非 “ONLY_FULL_GROUP_BY” 模式下可以正常执行，但是得到的是错误的结果：

```plain
SET SESSION sql_mode = 
'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,NO_ENGINE_SUBSTITUTION,ERROR_FOR_DIVISION_BY_ZERO';
```

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701176909103-cc3f98ed-ecfa-4344-933d-b0518ef1c2e6.png)

正确的查询方式：查询应该分两个步骤：

1、查询每个部门最大的年龄

2、查询人

正确的语句：

```sql
SELECT e.* 
FROM employee e
INNER JOIN (SELECT dept, MAX(age) age FROM employee GROUP BY dept) AS maxage 
ON e.dept = maxage.dept AND e.age = maxage.age;
```

测试完成后再将sql_mode设置回来：

```plain
SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
```

---

<h1 id="0f004d32">2 MySQL逻辑架构</h1>
<h2 id="39452b90">2.1 MySQL逻辑架构总览</h2>
MySQL的逻辑架构如下所示：

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1699352902594-ba0f63e6-1120-43e7-9991-59bf9d5086f7.png)

<h2 id="b6241064">2.2 逻辑架构详解</h2>
<h3 id="5cf57cd5">2.2.1 Connectors(客户端)</h3>
MySQL服务器之外的客户端程序，与具体的语言相关，例如Java中的JDBC，图形用户界面Navicat等。本质上都是在TCP连接上通过MySQL协议和MySQL服务器进行通信。

<h3 id="fe330472">2.2.2 SQL层(服务层)</h3>
<h4 id="b29bc727">连接层</h4>
1、客户端访问 MySQL 服务器前，做的第一件事就是**建立TCP连接**。

2、经过三次握手建立连接成功后， MySQL 服务器对 TCP 传输过来的账号密码做**身份认证、权限获取**。

3、用户名或密码不对，会收到一个**Access denied for user**错误，客户端程序结束执行。

4、用户名密码认证通过，会从权限表查出账号拥有的权限。

5、TCP 连接收到请求后，必须要分配给一个线程专门与这个客户端的交互。所以还会有个**线程池**，去走后面的流程。

<h4 id="8f75cafc">系统管理和控制工具</h4>
**（了解即可）**

在MySQL服务层中，系统管理和控制工具是指用于管理和控制MySQL数据库服务器的软件工具。这些工具提供了对MySQL服务器的配置、监控、维护和故障排除等功能。



以下是一些常见的MySQL系统管理和控制工具：

1、MySQL命令行客户端：MySQL自带的命令行客户端是一个基本的系统管理工具，可以通过命令行界面与MySQL服务器进行交互。管理员可以使用命令行客户端执行SQL语句、管理用户权限、查看日志等操作。



2、MySQL Workbench：MySQL Workbench是官方提供的图形化管理工具，提供了丰富的功能来管理和控制MySQL服务器。它包括数据库设计、查询开发、备份恢复、性能优化等模块，使管理员可以通过可视化界面轻松地进行各种管理任务。



3、phpMyAdmin：phpMyAdmin是一个基于Web的MySQL管理工具，通过浏览器访问，提供了图形化界面来管理MySQL服务器。它支持数据库的创建、表的管理、数据的导入导出等操作，适合于简单的数据库管理需求。



4、MySQL Enterprise Monitor：MySQL Enterprise Monitor是MySQL官方提供的高级监控和管理工具。它可以实时监控MySQL服务器的性能指标、健康状态和资源利用情况，并提供警报和建议来优化和调整MySQL环境。



5、Percona Toolkit：Percona Toolkit是一个由Percona开发的一组命令行工具，用于MySQL数据库的管理和维护。它包括了各种实用工具，如备份恢复、查询分析、性能优化、数据同步等，可以帮助管理员更好地管理MySQL服务器。



这些系统管理和控制工具提供了不同级别的功能和灵活性，使管理员能够根据需要选择适合自己的工具来管理和控制MySQL服务器。无论是通过命令行还是图形界面，这些工具都可以帮助管理员更高效地管理MySQL数据库。



<h4 id="cae55cba">SQL接口</h4>
作用：

1、接收用户的SQL命令，并且返回用户需要查询的结果。

2、实现更加丰富的功能，MySQL支持DML（数据操作语言）、DDL（数据定义语言）、存储过程、视图、触发器、自定义函数等多种SQL语言接口。

<h4 id="8bb4ba85">分析器</h4>
在SQL命令传递到解析器的时候会被解析器**验证**和**解析**。解析器对SQL 语句进行**词法分析、语法分析、语义分析**，并为其**创建语法树**。

1、**词法分析**：检测SQL语句的关键字是否正确。

说白了就是把一个完整的 SQL 语句打碎成一个个的单词。比如一个简单的 SQL 语句：

```sql
select name from user where  age > 20;
```

它会打碎成 8 个符号，每个符号是什么类型，意思是又什么。

2**、语法分析**：检测SQL语句是否符合MySQL的语法要求，按照MySQl语法规则，生成解析树。

典型的解析树如下：

![](https://cdn.nlark.com/yuque/0/2023/png/36071275/1701177924487-71dd1736-938f-45c8-a474-30bb7a95a8bb.png)

![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105114006719.png)



在这棵树中，每一个节点都代表一个语法结构，从整个SQL语句（**根节点**），到各个子句**（非叶节点）**，再到具体的词法单元**（叶节点）**。



3、**语义分析**：最后通过遍历这棵树，检查解析树是否合法，比如查看表是否存在，列是否存在，我们就能得到真正SQL语句的结构。



<h4 id="2dcc2a9e">优化器</h4>


       经过了分析器，MySQL 就知道你要做什么了。但是在开始执行之前，还要先经过优化器的处理。比如在表里面有多个索引的时候，决定使用哪个索引，在比如能在排序的时候，能不能利用索引的顺序等等。总之优化器的作用就是找到这其中**最好的执行计划从而最大程度地减少查询语句的执行时间**。



```sql
select * from t1 where id=1 and 1==1
select * from t1 where id=1；
```



      优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段



<h4 id="96a9b743">执行器</h4>


      进入执行器阶段，MYSQL就开始开表执行语句。执行器就会根据表的引擎定义，去使用这个引擎提供的接口。



<h2 id="c17b196d">2.3 引擎层</h2>


存储引擎层，存储引擎负责了MySQL中数据的存储和提取，MYSQL通过API与存储引擎进行通信。不同的存储引擎具有的功能不同，这样我们可以根据自己的实际需要进行选取。比如后面介绍MyISAM和InnoDB



<h2 id="711bc8ef">2.4 存储层</h2>


所有的数据、数据库、表的定义、表的每一行的内容、索引，都是存在文件系统 上，以文件的方式存在，并完成与存储引擎的交互。



<h4 id="435a97ac">查询缓存组件</h4>


**（了解即可**）



1、MySQL内部维持着一些Cache和Buffer，比如Query Cache用来缓存一条SELECT语句的执行结果，如果能够在其中找到对应的查询结果，那么就不必再进行查询解析、查询优化和执行的整个过程了，直接将结果反馈给客户端。



2、这个缓存机制是由一系列小缓存组成的。比如表缓存，记录缓存，key缓存，权限缓存等 。



问：**大多数情况查询缓存就是个鸡肋，为什么呢？**



1、只有相同的SQL语句才会命中查询缓存。两个查询请求在任何字符上的不同（例如：空格、注释、大小写），都会导致缓存不会命中。



```plain
select * from t1 where id=2;-----id=2这个记录
select * from t1 where id>1 and id <3;-----id=2这个记录
select * from t1 where id=2;-----id=2这个记录
```



2、在两条查询之间 有 INSERT 、 UPDATE 、 DELETE 、 TRUNCATE TABLE 、 ALTER TABLE 、 DROP TABLE 或 DROP DATABASE 语句也会导致缓存失效



3、因此 MySQL的查询缓存命中率不高。所以在MySQL 8之后就抛弃了这个功能。



<h2 id="f2a1ea5a">2.3 查询流程说明</h2>


一条查询的SQL语句的执行流程如下所示：



![](assets/image-20230617164347933.png)



**首先，**MySQL客户端通过协议与MySQL服务器建连接，通过SQL接口发送SQL语句，先检查查询缓存，如果命中，直接返回结果，否则进行语句解析。也就是说，在解析查询之前，服务器会先访问查询缓存，如果某个查询结果已经位于缓存中，服务器就不会再对查询进行解析、优化、以及执行。



它仅仅将缓存中的结果返回给用户即可，这将大大提高系统的性能。



**接下来是解析过程，**MySQL解析器通过关键字将SQL语句进行解析，并生成一棵对应的解析树，解析器使用MySQL语法规则验证和解析SQL语句。



例如，它将验证是否使用了错误的关键字，或者使用关键字的顺序是否正确，引号能否前后匹配等；预处理器则根据MySQL规则进一步检查解析树是否合法，例如，这里将检查数据表和数据列是否存在，还会解析名字和别名，看是否有歧义等，并生成一棵新解析树，新解析树可能和旧解析树结构一致。



**然后是优化过程，**MySQL优化程序会对我们的语句做一些优化，将查询的IO成本和CPU成本降到最低。优化的结果就是生成一个执行计划。这个执行计划表明了应该使用哪些索引执行查询，以及表之间的连接顺序是啥样，必要时将子查询转换为关联查询等等。我们可以使用**EXPLAIN**语句来查看某个语句的执行计划。



**最后，**进入执行阶段。完成查询优化后，查询执行引擎会按照生成的执行计划调用存储引擎提供的接口执行SQL查询并将结果返回给客户端。在MySQL8以下的版本，如果设置了查询缓存，这时会将查询结果进行缓存，再返回给客户端。



<h2 id="d965c4d4">2.4 SQL执行流程</h2>


利用**SHOW VARIABLES** 可以查看SQL的执行流程。使用前需要先开启该功能：



<h3 id="e7968f60">2.4.1 MySQL8</h3>


> 1、开启profiling
>



确认profiling是否开启



```sql
SHOW VARIABLES LIKE '%profiling%';
```



profiling=0 代表关闭，我们需要把 profiling 打开，即设置为 1：



```sql
SET profiling = 1;  -- profiling = ON
```



> 2、显示查询
>



执行二次SQL语句：



```sql
SELECT * FROM atguigudb.employee; 
# 执行一次
SELECT * FROM atguigudb.employee WHERE id = 5; 
# 执行二次
SELECT * FROM atguigudb.employee WHERE id = 5;
```



显示最近的几次查询：



```sql
SHOW PROFILES;
```



> 3、查看执行流程
>



查看最后一个SQL的执行流程：



```sql
SHOW PROFILE;
```



查看指定SQL的执行流程：查询指定的 Query ID



```sql
SHOW PROFILE FOR QUERY 3;
```



执行结果信息说明：



![](assets/image-20230625215627766.png)



详细输出列信息也可参考官网：



[https://dev.mysql.com/doc/refman/8.0/en/general-thread-states.html](https://dev.mysql.com/doc/refman/8.0/en/general-thread-states.html)



<h3 id="bb205c6f">2.4.2 MySQL5.7（了解）</h3>


**大家课下试验一下。**



> 1、查看查询缓存是否启用
>



```sql
SHOW VARIABLES LIKE '%query_cache_type%';
```



> 2、开启查询缓存
>



```sql
修改配置文件：vim /卷对应的位置目录下/base.cnf
新增两行：

[mysqld]
query_cache_type=1

重启MySQL：systemctl restart mysqld
```



> 3、执行SQL并查看执行流程
>



参考MySQl8中执行流程的启用和查看方式，在MySQL5.7中查看执行流程



1、第一次执行查询SQL：



![](assets/image-20220703162615147.png)



2、第二次执行相同的SQL：



![](assets/image-20220703162803963.png)

---

<h1 id="269c2d2f">3 MySQL存储引擎</h1>


在MySQL8中提供了很多的存储引擎，不同的存储引擎的特点是不一样的，常见的存储引擎有：**InnoDB**、**MyISAM**、Memory、Archive(高压缩比)、Blackhole（黑洞）、CSV引擎、Federated引擎等。



<h2 id="eb7826ca">3.1 查看存储引擎</h2>


查看MySQL提供什么存储引擎



```sql
SHOW ENGINES;
```



下面的结果表示MySQL中默认使用的存储引擎是InnoDB，支持事务，行锁，外键等。



![](assets/image-20220703164220030.png)



也可以通过以下语句查看默认的存储引擎：



```sql
SHOW VARIABLES LIKE '%default_storage_engine%';
```



![](assets/image-20220703170334348.png)



<h2 id="95e650aa">3.2 主要的存储引擎介绍</h2>


<h3 id="c73c41b4">3.2.1 InnoDB</h3>


<h4 id="bd93d426">特点介绍</h4>


1、默认存储引擎：在MySQL 5.5版本之后，InnoDB成为了MySQL的默认存储引擎。



2、支持事务：InnoDB是一个支持ACID事务的存储引擎，可以提供数据的一致性和可靠性。



3、行级锁定：InnoDB使用行级锁定来实现并发控制，允许多个事务同时读取和写入不同的行，提高了并发性能。



4、外键约束：InnoDB支持外键约束.



5、支持崩溃恢复：InnoDB具有崩溃恢复机制，可以在数据库异常关闭后进行恢复。



<h3 id="7d064a11">3.2.2 MyISAM</h3>


<h4 id="bd93d426-1">特点介绍</h4>


1、不支持事务：MyISAM是一个不支持事务的存储引擎，无法提供数据的一致性和可靠性。



2、表级锁定：MyISAM使用表级锁定来实现并发控制，只允许一个事务对整个表进行读写操作，限制了并发性能。



3、较低的存储空间占用：相比InnoDB，MyISAM在存储空间占用方面较低，适合存储大量非事务性的数据。



<h3 id="d7db16c5">3.2.3 MyISAM和InnoDB的对比(**重要**)</h3>


**提问：**

| **对比项** | **MyISAM** | **InnoDB** |
| --- | :---: | :---: |
| 外键 | 不支持 | 支持 |
| 事务 | 不支持 | 支持 |
| XA | 不支持 | 支持 |
| 行表锁 | 表锁，即使修改一条记录也会锁住整个表，不适合高并发的操作 | 行锁,修改时只锁某一行，不对其它行有影响，适合高并发的操作 |
| savePoint | 不支持 | 支持 |
| 文件类型 | **.myd**、**.myi**、**.frm** | **.ibd**、**.frm** |
| 缓存（5.7） | 只缓存索引，不缓存真实数据 | 不仅缓存索引还要缓存真实数据，对内存要求较高，而且内存大小对性能有决定性的影响 |
| 聚簇（主键）索引 | 不支持 | 支持 |
| 默认使用 | N | Y |
| count(*)/不带where条件 | 快 | 慢 |
| 使用场景 | 不需要事务支持、并发相对较低、数据相对修改较少、以读为主 | 需要事务支持、并发相对较高、数据更新较为频繁。 |




```sql
select count(*)  from user;---若查询记录数时没有带条件，那么MyIsam更快一些。
select count(*)  from  user where age=18;----若查询记录数时带了条件，那么一样快。
```



> sql语句如何优化：----加索引
>
> MySQL性能调优是指通过对MySQL数据库系统进行优化，以**提高其执行速度、响应时间和资源利用率**的过程。MySQL是一种常用的关系型数据库管理系统，因此针对MySQL的性能调优主要集中在以下几个方面：
>
> 
>
> 1、查询索引优化：通过分析和优化查询语句，包括使用合适的索引、避免全表扫描、创建复合索引、删除不必要的索引等优化JOIN操作等，以提高查询性能。
>
> 
>
> 2、配置优化：调整MySQL的配置参数，如缓冲区大小、并发连接数、线程池大小等，以适应不同的工作负载和硬件环境。
>
> 
>
> 3、内存管理：合理配置MySQL的内存使用，包括设置合适的缓冲池大小、排序缓冲区大小、临时表空间大小等，以提高内存利用率和减少磁盘IO。
>
> 
>
> 4、存储引擎选择：根据应用需求选择合适的存储引擎，如InnoDB、MyISAM等，并针对不同存储引擎进行相应的优化。
>
> 
>
> 5、数据库设计优化：合理设计数据库表结构、字段类型和关系，以减少数据冗余和提高查询效率。
>
> 
>
> 以上只是MySQL性能调优的一些常见方面，具体的调优策略和方法需要根据具体情况进行分析和优化。通过综合考虑硬件、操作系统、网络和应用程序等因素，可以全面提升MySQL数据库的性能和可伸缩性。
>

<h2 id="7db326a6">3.3 设置存储引擎（了解）</h2>


**方法1**



设置默认存储引擎：



```sql
SET DEFAULT_STORAGE_ENGINE=MyISAM;
```



**方法2**



或者修改 my.cnf 文件：vim  /卷对应的位置目录下/base.cnf



在[mysqld]节点下新增一行：default-storage-engine=MyISAM



重启MySQL：systemctl restart mysqld



**方法3**



我们可以为不同的**表设置不同的存储引擎**



```sql
CREATE TABLE 表名( 建表语句 ) ENGINE = 存储引擎名称;
ALTER TABLE 表名 ENGINE = 存储引擎名称;

-- 例如：
CREATE TABLE student(id INT, `name` VARCHAR(16),age INT,dept INT) ENGINE = MyISAM;
```

---

<h1 id="b2d4bce7">4 MySQL索引入门</h1>


<h2 id="c3c30bf2">4.1 索引概述</h2>


MySQL官方对索引的定义为：索引（index）是帮助MySQL高效获取数据的**数据结构**（有序）。在数据之外，数据库系统还维护者满足特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据， 这样就可以在这些数据结构上实现高级查找算法，这种数据结构就是索引。如下面的示意。



> 【5,10，2,1,6,8】------id=8
>
>  
>
> 排序
>
>  
>
> 【1,2,5,6,8,10】----算法（折半）
>
>  
>
> id     name      age;（普通索引、唯一索引）---age建立索引---在底层要给age的这些值排序
>
>  
>
> 1      ‘ls’    10
>
>  
>
> 2     ‘zs’    8
>
>  
>
> 3     ‘ww’    11
>
>  
>
> 4     ‘zl’    1
>
>  
>
> age(索引): 1 8 10 11
>



图所示 :



![](assets/1555902055367.png)



> 利用二叉查找树（排序）树，既能有顺序的将那些无序的元素，变为有序，而且还自带了一种折半的思想算法在里面。因此这用树作为索引结构而不去用数组+算法作为所以会更加的方便。
>



左边是数据表，一共有两列七条记录，最左边的是数据记录的物理地址（注意逻辑上相邻的记录在磁盘上也并不是一定物理相邻的）。为了加快Col2的查找，可以维护一个右边所示的二叉查找树，每个节点分别包含索引键值和一个指向对应数据记录物理地址的指针，这样就可以运用二叉查找快速获取到相应数据。一般来说索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式**存储在磁盘上**。索引是数据库中用来提高性能的最常用的优化手段。



<h2 id="37161a9b">4.2 优点和缺点</h2>


**优势**



1）**降低了Io次数：** 类似于书籍的目录索引，提高数据检索的效率，降低数据库的IO成本。



2） **降低了cpu的消耗**：通过索引列对数据进行排序，降低数据自己排序的成本，进一步能降低CPU的消耗。



**劣势**



1）**空间利用率**： 实际上索引也是一张表，该表中保存了主键与索引字段，并指向实体类的记录，所以**索引列也是要占用空间**的。



2） **时间利用率**：虽然索引大大提高了查询效率，同时却也**降低更新表的速度**，如对表进行INSERT、UPDATE、DELETE。因为更新表时，MySQL 不仅要更新数据，还要更行一下索引文件。



<h1 id="bae5576f">5 MySQL索引结构</h1>


<h2 id="781eef22">5.1 索引结构</h2>


索引结构是指在数据库中用于**组织和管理索引的数据结构**。索引结构的设计和实现对于数据库的性能和效率具有重要影响。



常见的索引结构包括：



1、**B树(B-tree):** B树是一种平衡的**多路搜索树**，被广泛应用于数据库系统中。B树的特点是每个节点可以存储多个键值，并且保持有序。B树的高度相对较低，可以快速定位到目标数据。



2、**B+树(B+tree):** B树是一种平衡的**多路搜索树**，被广泛应用于数据库系统中。B+树的特点是**每个节点可以比B树还存储更多的键值**，并且保持有序。初次之外B+树的**高度相对B树更低**，因此查询数据的Io次数就更少，查询效率就更高。



2、**Hash索引**（Hash Index）：Hash索引使用哈希函数将索引列的值映射为一个固定长度的哈希码，并将哈希码作为索引的键值。Hash索引适用于等值查询，可以快速定位到目标数据。**BUT**，Hash索引不支持**范围查询和排序**操作。



3、R树（R-tree）：R树是一种用于处理多维数据的索引结构，常用于地理信息系统（GIS）和空间数据库中。R树可以高效地支持范围查询和最近邻查询。



4、Full-text （全文索引） ：全文索引也是MyISAM的一个特殊索引类型，主要用于全文索引，InnoDB从Mysql5.6版本开始支持全文索引。



MyISAM、InnoDB、Memory三种存储引擎对各种索引类型的支持

| 索引 | InnoDB引擎 | MyISAM引擎 | Memory引擎 |
| --- | --- | --- | --- |
| BTREE索引 | 支持 | 支持 | 支持 |
| HASH 索引 | 不支持 | 不支持 | 支持 |
| R-tree 索引 | 不支持 | 支持 | 不支持 |
| Full-text | 5.6版本之后支持 | 支持 | 不支持 |




而我们平常所说的索引，如果没有特别指明，都是指**B+树**（多路搜索树，注意：并不一定是二叉的）结构组织的索引。

---

<h2 id="ebc84d6d">5.2 索引结构-树</h2>


<h3 id="0a13c36b">5.2.1 二叉树</h3>


<h4 id="8178ad6f">二叉树</h4>


树有很多种，**每个节点最多只能有两个子节点**的一种形式称为二叉树。二叉树的子节点分为左节点和右节点。



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105164834241.png)



<h4 id="67187ab4">二叉查找树</h4>


<h5 id="1f5b8d75">BST的简介</h5>


BST(Binary Sort(Search) Tree)：对于二叉排序树的任何一个非叶子节点，要求左子节点的值比当前节点的值小，右子节点的值比当前节点的值大。



特别说明：如果有相同的值，可以将该节点放在左子节点或右子节点。



![](assets/image-20230618094404240.png)



BST的生成演示：[https://www.cs.usfca.edu/~galles/visualization/BST.html](https://www.cs.usfca.edu/~galles/visualization/BST.html)



【5,22,23,34,77,89,91】



<h5 id="5b6a25fa">BST的问题</h5>


二叉搜索树存在一个常见的问题：**退化问题** ， 例如左子树全部为空，从形式上看，更像一个单链表，不能发挥BST的优势，影响了查询数据效率。



![](assets/image-20230618094844386.png)



<h4 id="918accc0">AVL树</h4>


<h5 id="4b8d57a2">AVL树简介</h5>


AVL树全称G.M. Adelson-Velsky和E.M. Landis，这是两个人的人名。



平衡二叉树也叫**平衡二叉搜索树**（Self-balancing binary search tree）又被称为AVL树， 因为平衡，所以可以保证较高的查询效率。



【5,22,23,34,77,89,91】



具有以下特点：



1、它是一棵空树或它的左右两个子树的高度差的绝对值不超过1



2、整棵树是平衡的。



![](assets/image-20230618095053363.png)



AVL的生成演示：[https://www.cs.usfca.edu/~galles/visualization/AVLtree.html](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)



<h5 id="b956a98f">AVL树问题</h5>


众所周知，IO操作的效率很低，在大量数据存储中，查询时我们不能一下子将所有数据加载到内存中，只能逐节点加载（一个节点一次IO）。如果我们利用上述的AVL树作为索引结构，那么**磁盘的IO次数和索引树的高度是相关**的。就会导致树深度过大而造成磁盘IO读写过于频繁，进而导致效率低下。



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105171940411.png)



那么为了提高查询效率，就需要减少磁盘IO数 。**为了减少磁盘IO的次数，就需要尽量降低树的高度**，需要把原来“瘦高”的树结构变的“矮胖”，而要把树变得矮胖，就要把树的每层的叉分的越多越好。



比如在针对同样的数据量时，如果我们把二叉树改成 三叉树：



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105174940245.png)



上面的例子中，我们将二叉树变成了三叉树，降低了树的高度。如果能够在一个节点中存放更多的数据，我们还可以进一步减少节点的数量，从而进一步降低树的高度。降低了Io次数，从而提高了查询效率的目的。这就是多叉树。



<h4 id="a93879c3">5.2.2 B-tree</h4>


<h4 id="080923d0">B-tree简介</h4>


B-tree又叫**多路（叉）平衡搜索树**，一颗m叉的B-tree特性如下：



1、树中每个节点最多包含m个子节点。



2、除根节点与叶子节点外，每个节点至少有[ceil(m/2)]个孩子。



3、若根节点不是叶子节点，则至少有两个孩子。



4、所有的叶子节点都在同一层。



5、每个非叶子节点由n个key与n+1个指针组成，其中[ceil(m/2)-1] <= n <= m-1



如下所示：



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231106160808689.png)



上图所表示的 B 树就是一棵 3 阶(叉)的 B 树。假设一个磁盘块可以存储一个节点的数据。我们可以看下磁盘块2，里面的关键字为（8，12），它有 3 个孩子 (3，5)，(9，10) 和 (13，15)，你能看到 (3，5) 小于 8，(9，10) 在 8 和 12 之间，而 (13，15)大于 12，三节点的子树的值大小仍然遵守 BST 二叉排序树的规则。



<h4 id="45bd81a3">数据搜索</h4>


假设我们想要查找的数据项是 9 ，那么步骤可以分为以下几步：



1、第一次磁盘IO：找到根节点磁盘块1，读入内存，执行二分查找，9 小于 17 ，得到指针 P1



2、第二次磁盘IO：按照指针P1找到磁盘块 2，读入内存，执行二分查找，9 在 8 和12 之间，得到指针 P2



3、第三次磁盘IO：按照指针P2找到磁盘块 6，读入内存，执行二分查找， 找到了数据项 9。



因此我们发现，B树相比于平衡二叉树来说磁盘 I/O 操作要少 ，那么B树在数据查询中就比平衡二叉查找树效率要高。所以只要树的高度足够低，也即IO次数足够少，就可以提高查询性能 。



但是在这个B树的搜素过程中，我们发现比较的次数也并不少，但其实并不然，因为我们**把数据读取出来然后在内存中进行比较，这个时间就是可以忽略不计的**。



而相反读取磁盘块是进行 I/O的 操作，消耗的时间比在内存中进行比较所需要的时间要多，这才是是数据查找耗时的重要因素。



小技巧：



> 1、先在树中定位到元素所在的磁盘块（在树中查找磁盘块）---IO查找。
>
>  
>
> 2、在磁盘块内依次查找关键字===（在磁盘块中查找关键字）---内存查找。
>

---

<h2 id="7abce70d">5.3 索引结构-B+tree</h2>


<h3 id="ceadc909">5.3.1 B+树的由来</h3>


思考如果MySQL中的数据用B树来存储，那每个节点存放的数据可不是我们的17、35、8、12这些了。而应该是一行行的所有数据。例如，我用图形具体出来，如下：



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105193301585.png)



从B树结构图中可以看到每个节点中不仅包含数据的（key）主键值，还有data值，因此一个磁盘块中存不下太多的key(主键值)和data，因为磁盘块的存储空间是有限的（默认是16kb），那么当MySQL存储的数据量很大时势必会导致B树的深度很深即高度很高，而B树的高度很高，就会增大磁盘的IO次数，进而影响查询数据的效率。



**那么我们该如何优化呢？**



**思路**：其实我们只要能够降低树的高度即可。



**问题**：那么在数据量不变的情况下如何降低树的高度呢?



**解决**：我们如果能每个节点多存储（key）主键值的数量，那么不就可以降低B+树的高度。此时B+树就孕育而生。



那么问题又来了，之前在B树中的每一行行的数据存放到哪里呢，不能不要了吧？别着急，我们用另外一种数据结构B+树就能解决。



<h3 id="60a6812e">5.3.2 B+树的定义</h3>


1、树中每个节点最多包含m个子节点。



2、除根节点与叶子节点外，每个节点至少有[ceil(m/2)]个孩子。



3、若根节点不是叶子节点，则至少有两个孩子。



4、所有的叶子节点都在同一层。



5、每个非叶子节点由n个key与n+1个指针组成，其中[ceil(m/2)-1] <= n <= m-1



**6、m 叉树非叶子节点只存储索引值和磁盘块（页）的地址，并不真正存储数据，**



**7、叶子节点存放真正的数据。**



<h3 id="89c724eb">5.3.3 检索原理图</h3>


检索原理同B树



由于B+树的非叶子节点只存储key(主键值)和指针（下一个磁盘块的地址）信息，我这里假设每个非叶子节点的磁盘块能存储6个键值及指针信息，叶子节点存放4个键值和数据，那么用B+树存储后其结构如下图所示：



![](day01-MySQL%E8%AF%BE%E4%BB%B6.assets/image-20231105202441251.png)



**显然，B+树的比B树更加的矮胖，因此基于B+树查询Io次数比B树的更少，查询效率也就比B树更高。**



<h3 id="b2aafd03">5.3.4 B+tree常识</h3>


一个B+树的节点其实可以分成好多层，规定最下边的那层，也就是存放我们用户记录的那层为第 **0** 层， 之后依次往上加。之前我们做了一个非常极端的假设：存放用户记录的页 **最多存放3条记录** ，存放目录项记录的页 **最多存放4条记录** 。



其实真实环境中一个页存放的记录数量是非常大的，假设所有存放用户记录的叶子节点代表的数据页可以存放100条用户记录 ，所有存放目录项记录的节点代表的数据页可以存放 1000条目录项记录 ，那么：



1、如果B+树只有1层，也就是只有1个用于存放用户记录的节点，最多能存放 100 条记录。



2、如果B+树有2层，最多能存放 1000×100=10,0000 条记录。



3、如果B+树有3层，最多能存放 1000×1000×100=1,0000,0000 条记录。



4、如果B+树有4层，最多能存放 1000×1000×1000×100=1000,0000,0000 条记录。相当多的记录！！！



你的表里能存放 100000000000 条记录吗？所以一般情况下，我们用到的**B+树都不会超过4层** ，那我们通过主键值去查找某条记录最多只需要做4个页面内的查找（查找3个目录项页和一个用户记录页），又因为在每个页面内有所谓的 **Page Directory （页目录）**，所以在页面内也可以通过**二分法**实现快速定位记录。



<h3 id="7132d667"><font style="color:#DF2A3F;">5.3.5 B树和B+树对比(</font>**<font style="color:#DF2A3F;">面试必问</font>**<font style="color:#DF2A3F;">)</font></h3>


**B+** **树和** **B** **树的差异：**



**1**、**data数据存储不同**：B+树中非叶子节点仅用于索引，不保存数据记录，跟记录有关的信息都放在叶子节点中。而B树中， 非叶子节点既保存索引，也保存数据记录 。



**2、时间复杂度不同：**由于B+树的数据都存在叶子节点，因此B+树的时间复杂度固定为o(log n)，而B树的数据分布在每个节点中，因此时间复杂度不固定，最好为o(1)，最不好为o(log n)。



**3**、**节点连接顺序不同**：B+树中所有关键字[**主键**]都在叶子节点出现，叶子节点构成一个有序链表，而B树没有。



**4**、**区间查询效率不同**，因为B树查询范围需要进行树的中序遍历，而B+树的范围查询只需从当前页或者沿着链表的当前页查询下一个页，因此范围查询效率更快，而B树范围查询比较慢。





| 对比项 | B树 | B+树 |
| --- | --- | --- |
| 非叶子节点数据不同 | B树种非叶子节点中元素不会冗余；B树所有节点叶子结点都存放数据 | 叶子节点中的数据都会在非叶子节点冗余一份；B+树中非叶子节点中元素不会冗余 |
| 叶子节点数据不同 | B树所有节点（非叶子节）点存放数据、数据遍布整个树结构 | B+树叶子节点存放数据 |
| 时间复杂度不同 | B树的数据分布在每个节点中，因此时间复杂度不固定，最好是O(1) | 由于B+树的数据都存在叶子节点，因此B+树的时间负载度固定位O(logN) |
| 叶子节点连接不同 | B树叶子节点不相连 | B+树的叶子节点通过有序的双向链表相连 |
| 区间查询效率不同 | 因为第4点原因，B树范围查询比较慢；对大量单个key查询的场景，可以考虑B树 | B+树范围查询效率更快；存在大量范围查询的场景，适合使用B+树 |




<h2 id="2686e399">5.4 InnoDB中的索引底层</h2>


<h4 id="9eb04f54">5.4.1 设计索引</h4>


假设有一个表index_demo，表中有2个INT类型的列，1个CHAR(1)类型的列，c1列为主键：



```sql
CREATE TABLE index_demo(c1 INT,c2 INT,c3 CHAR(1),PRIMARY KEY(c1)) ;
```



这里我们简化了index_demo表的行格式示意图：



![](assets/image-20230619113702712.png)



我们只在示意图里展示记录的这几个部分：



1、record_type ：记录头信息的一项属性，**表示记录的类型**， **0 表示普通记录、 2 表示最小记录、 3 表示最大记录、 1 暂时还没用过**，下面讲。



2、next_record ：记录头信息的一项属性，表示下一条地址相对于本条记录的地址偏移量，我们用箭头来表明下一条记录是谁。



3、各个列的值 ：这里只记录在 index_demo 表中的三个列，分别是 c1 、 c2 和 c3 。



4、其他信息 ：除了上述3种信息以外的所有信息，包括其他隐藏列的值以及记录的额外信息。



将记录格式示意图的其他信息项暂时去掉并把它竖起来的效果就是这样：



![](assets/image-20230619113911410.png)



把一些记录放到**页**里的示意图就是【**数据都是存储到数据页中，一个数据页占用一个磁盘块**】：



![](assets/image-20230619114041208.png)



MySQL InnoDB的默认的页大小是16KB：



```sql
-- 查看默认页的大小
SHOW GLOBAL STATUS LIKE 'Innodb_page_size';
```



数据存储在磁盘中，可能会占用多个数据页。如果各个页中的记录没有规律，我们就不得不依次遍历所有的数据页。如果我们想快速的定位到需要查找的记录在哪些数据页中，我们可以这样做 ：我们可以为快速定位记录所在的数据页而建立一个**目录** ，建这个目录必须完成下边这些事：



1、下一个数据页中用户记录的主键值必须大于上一个页中用户记录的主键值。



2、给所有的页建立一个目录项。



所以我们为上边几个页做好的目录就像这样子：



![](assets/image-20230619114900237.png)



以 页28 为例，它对应目录项2 ，这个目录项中包含着该页的页号 28 以及该页中用户记录的**最小主键值 5** 。我们只需要把几个目录项在物理存储器上连续存储（比如：数组），就可以实现根据主键 值快速查找某条记录的功能了。



比如：查找主键值为 20 的记录，具体查找过程分两步：



1、先从目录项中根据 二分法快速确定出主键值为 20 的记录在目录项3中（因为 12 < 20 < 209 ），接着发现该目录项中它记录的页是页9 。



2、再根据前边说的在页中查找记录的方式去页9中定位具体的记录。



至此，针对数据页做的简易目录就搞定了。这个目录有一个别名，称为**索引** 。



思考：**那么问题来了，目录项应该放在哪里呢。**



<h4 id="8e53e786">5.4.2 InnoDB中的索引方案</h4>


<h5 id="757ea5bf">1） 目录项纪录的页</h5>


我们继续把前边使用到的目录项也要放到数据页中，那么对于该页中存放的是目录项，因此我们把该页叫做目录页，如下图所示：



![](assets/image-20230619124557527.png)



**这里要注意的是：**目录项记录和普通的用户记录的不同点：



1、**目录项记录 的 record_type 值是1**，而普通用户记录 的 record_type值是0。



2、目录项记录只有主键值和页的编号两个列，而普通的用户记录的列是用户自己定义的，可能包含很多列，另外还有InnoDB自己添加的隐藏列。



> 思考：有了目录页之后，那么该如何找呢。
>



<h5 id="abee91d5">**2）查找：**</h5>


有了目录页之后现在查找主键值为 20 的记录，那么查找过程就分两步：



1、先到目录页30中通过二分法快速定位到对应目录项，因为 12 ≤ 20 < 209 ，定位到页9。



2、接着再到页9中根据二分法快速定位到主键值为 20 的用户记录。



<h5 id="596dba65">3） 多个目录项记录的页</h5>


但是随着数据持续增加，存放数据的数据页也就会增多，而当数据页越来越多的时候，目录页也会变多，比如：



![](assets/image-20230619124531531.png)



从图中可以看出，我们插入了一条主键值为320的用户记录之后需要两个新的数据页：



1、为存储该用户记录而新生成了页31 。



2、因为原先存储目录项记录的页30的容量已满 （我们前边假设只能存储4条目录项记录），所以不得不需要一个新的页32来存放页31对应的目录项。



> 思考：现在因为存储目录项记录的页不止一个，那么又该如何找呢。
>



<h5 id="eb1c6a08">4）查找：</h5>


此时如果我们想根据主键值查找一条用户记录大致需要3个步骤。



以查找主键值为 20 的记录为例：



1、确定目录项记录页。我们现在的存储目录项记录的页有两个，即 页30 和页32 ，又因为页30表示的目录项的主键值的 范围是 [1, 320) ，页32表示的目录项的主键值不小于 320 ，所以主键值为 20 的记录对应的目录项记录在页30 中。



2、通过目录项记录页后，在确定用户记录真实所在的页 。 在一个存储目录项记录的页中通过主键值定位一条目录项记录的方式说过了。



3、在真实存储用户记录的页中定位到具体的记录。



<h5 id="1a2d8fa5">5）目录项记录页的目录页</h5>


![](assets/image-20230619124928306.png)



如图，我们生成了一个存储更高级目录项的页33 ，这个页中的两条记录分别代表页30和页32，如果用户记录的主键值在 [1, 320) 之间，则到页30中查找更详细的目录项记录，如果主键值 不小于320 的话，就到页32中查找更详细的目录项记录。这个数据结构它的名称是 B+树 。

