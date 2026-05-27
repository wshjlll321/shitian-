# 旧官网数据迁移报告

生成日期：2026-05-11

## 已迁移资产

- 旧站原始 HTML：46 个页面，存放于 `data/old-site/raw/`
- 旧站结构化清单：`data/old-site/old-site-manifest.json`
- 旧站内容结构化档案：`data/old-site/old-site-content.json`
- 可读索引：`data/old-site/old-site-pages.md`、`data/old-site/old-site-content-index.md`
- 图片素材引用：236 条
- 已下载图片：122 张，存放于 `public/media/old-site/images/`
- 已命名迁移二维码：`public/media/contact/qr-wechat.jpg`、`public/media/contact/qr-douyin.jpg`

## 已接入新站内容数据

- 产品数据：`src/content/products.ts`
- 案例数据：`src/content/cases.ts`
- 公司介绍：`src/content/about.ts`
- 联系方式：`src/content/contact.ts`
- 应用场景：`src/content/scenarios.ts`
- 解决方案：`src/content/solutions.ts`
- 新闻/动态：`src/content/news.ts`
- 媒体索引：`src/content/media.ts`

## 旧站页面覆盖

- 首页：1 个
- 关于我们：1 个
- 联系我们：1 个
- 在线留言：1 个
- 产品中心：1 个索引页、5 个产品详情页
- 案例中心：1 个索引页、9 个案例详情页
- 新闻中心：5 个列表/分类页、20 个新闻详情页

## 内容迁移原则

- 只迁移事实、参数、案例、联系方式和素材来源。
- 不迁移旧官网视觉、布局、配色、组件、交互和 CMS 页面结构。
- 参数进入结构化产品数据，避免前台参数堆砌。
- 新闻按“作业案例 / 企业动态 / 低空政策观察”重新分类。
- 图片保留原始来源地址与本地迁移地址，未下载素材标记为 `pending-download`。

## 待补抓/待确认

- `/news/450.html` 在旧站链接中出现，但本次外网授权受限，尚未补抓。
- 部分新闻正文图片尚未下载，已在 `src/content/news.ts` 中保留原始地址与 `pending-download` 状态。
- 视频原文件仍需甲方提供或确认可用外链；当前保留旧站 iframe/video 来源。
- 证书图片与专利证明正式上线前需确认脱敏范围。
- 地址版本、产品命名、发展历程、海外联系方式仍需建站前确认。
