<template><div><h1 id="_1-1问题描述" tabindex="-1"><a class="header-anchor" href="#_1-1问题描述" aria-hidden="true">#</a> 1.1问题描述</h1>
<p>缓存第一个经典问题是缓存失效。</p>
<p>服务系统查热点数据，首先会查缓存，如果缓存数据不存在，就进一步查数据库，最后查到数据后回种到缓存并返回。缓存的性能比DB高50~100倍以上，所以我们希望数据查询尽可能命中缓存，这样系统负荷最小，性能最佳。</p>
<p>缓存里的数据基本上都是以key为索引进行存储和获取的。业务访问时，如果大量的key同时过期，很多缓存数据访问都会失效，进而穿透到DB，DB的压力就会明显上升，由于DB的性能较差，这样请求的慢查询率会明显上升。</p>
<p>这就是缓存失效的问题。</p>
<blockquote>
<p>Redis 6.0 开始支持多线程，&quot;多线程&quot;特性让很多标题党高潮连连，核心的线程（Execute Command）还是单线程，多线程是指网络IO（socket）读写的多线程化。</p>
<p>Redis 6.0 性能测试，来源：美团技术团队。</p>
<p>服务器信息：Centos7，16C + 32G 内存</p>
<figure><img src="https://cdn.nlark.com/yuque/0/2024/png/36071275/1722928067893-d0bbf391-af50-4fd8-976d-998bd4d3a0d0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<figure><img src="https://cdn.nlark.com/yuque/0/2024/png/36071275/1722928103659-18eaa779-b3db-4aa4-a197-84b5df7d3050.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>从中可以看到：</p>
<p>1、1个线程，也就是传统的单线程模式，get操作的QPS可以达到9万左右</p>
<p>2、2个线程，get操作的QPS可以达到18万左右，相比单线程有100%+的提升</p>
<p>3、4个线程，与2线程相比，会有20%左右的提高，但是已经没有从1个线程到2个线程翻一倍的提升了</p>
<p>4、6个线程，与4个线程相比，没有明显的提升</p>
<p>5、8个线程，与4个线程和6个线程相比，8个线程下大概有10%的提升</p>
<p>6、10个线程，相比效率最高的8线程，此时性能反倒是开始下降了，与4线程或者6线程的效率相当</p>
<p>因此在本机环境下，io-threads 4设置成2或者4个都ok，最多不超过8个，超过后性能反而会下降，同时也不能超过cpu的个数，正如配置文件中注释中说的，至少要留出一个CPU。</p>
<p>如下是不同线程下10测试结果中GET和SET的requests per second 平均值对比：</p>
<figure><img src="https://cdn.nlark.com/yuque/0/2024/png/36071275/1722928779672-ebcb7732-9b01-4556-8017-db542123e639.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</blockquote>
<h1 id="_1-2原因分析" tabindex="-1"><a class="header-anchor" href="#_1-2原因分析" aria-hidden="true">#</a> 1.2原因分析</h1>
<p>导致缓存失效，特别是批量key一起失效的原因，跟我们日常写缓存的过期时间息息相关。</p>
<p>在写缓存时，我们一般会根据业务的访问特点，给每种业务数据预置一个过期时间，在写缓存时，把这个过期时间带上，让缓存数据在这个固定的过期时间后被淘汰。一般情况下，因为缓存数据是逐步写入的，所以也是逐步过期淘汰的。</p>
<p>特定场景：</p>
<p>一大批数据从DB批量加载，由于设置了固定的过期时间，过期时间一到，这批数据就会一起到期，针对这批数据的所有请求都不会命中缓存，穿透到DB，DB效率远远低于缓存系统，压力大增。</p>
<h1 id="_1-3业务场景" tabindex="-1"><a class="header-anchor" href="#_1-3业务场景" aria-hidden="true">#</a> 1.3业务场景</h1>
<p>很多业务场景，稍不注意，就会出现大量的缓存失效，进而导致系统 DB 压力大、请求变慢的情况。</p>
<p>比如同一批的火车票、飞机票，当可以售卖的时候，系统就会一次性加载到缓存中，微博业务，新部署IDC或者新业务上线的时候，缓存预热，一次性加载大量热数据。</p>
<h1 id="_1-4解决方案" tabindex="-1"><a class="header-anchor" href="#_1-4解决方案" aria-hidden="true">#</a> 1.4解决方案</h1>
<p>对于批量key缓存失效的问题，原因既然是预置的固定过期时间，那解决方案也从这里入手。</p>
<p>设计缓存的过期时间时，使用公式：<strong>过期时间=base 时间 + 随机时间</strong>。</p>
<p>即相同业务数据写缓存时，在基础过期时间之上，再加一个随机的过期时间，让数据在未来一段时间内慢慢过期，避免瞬间全部过期，对DB造成过大压力。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Random</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">TimeUnit</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>redisson<span class="token punctuation">.</span></span><span class="token class-name">Redisson</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>redisson<span class="token punctuation">.</span>api<span class="token punctuation">.</span></span><span class="token class-name">RBucket</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>redisson<span class="token punctuation">.</span>api<span class="token punctuation">.</span></span><span class="token class-name">Redissonclient</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Autowired</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Value</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Component</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Rediscacheservice</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">Redissonclient</span> redissonClient<span class="token punctuation">;</span>
    
    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${cache.base-expire-time}"</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token keyword">long</span> baseExpireTime<span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RBucket</span><span class="token generics"><span class="token punctuation">&lt;</span>object<span class="token punctuation">></span></span> bucket <span class="token operator">=</span> redissonClient<span class="token punctuation">.</span><span class="token function">getBucket</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> expireTime <span class="token operator">=</span> <span class="token function">calculateExpireTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        bucket<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> expireTime<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">private</span> <span class="token keyword">long</span> <span class="token function">calculateExpireTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> randomTime <span class="token operator">=</span> random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">1</span>o<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> baseExpireTime <span class="token operator">*</span> <span class="token number">1000</span> <span class="token operator">+</span> randomTime <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如何确定基准的过期时间：</p>
<ul>
<li>应用程序的性质，性能的不同，需求的不同。</li>
<li>缓存数据的更新频率</li>
<li>缓存数据的大小和内存容量</li>
<li>经验值</li>
</ul>
<p>借助于工具确定最佳的基准的过期时间：</p>
<ol>
<li>缓存分析工具</li>
<li>A/B测试工具</li>
<li>监控工具</li>
</ol>
</div></template>


