[TOC]

### 简介

通用头像组件，内置图片加载错误处理，懒加载功能，映客头像裁剪。

### 主要思想

具体内部的实现可以参考[Lazyload](https://youzan.github.io/vant/#/en-US/lazyload)的文档或源码。

#### 1. 图片加载错误原理

当头像显示异常的时候，会触发一个`error`事件，我们可以通过监听`error`事件的方式对图片进行降级处理，即在图片加载失败时显示一张我们预先设定好的默认图片，只对该错误事件触发一次，避免默认图片错误时死循环。

#### 2. 懒加载原理

- 懒加载主要应用是当图片出现在可视范围内才开始下载，即延迟图片载入

- 延迟图片载入的构思为，让所有的`img`标签没有 src 属性，图片自然就无法载入

- 取而代之，将原本`src`的图片网址，改放在`data-src`属性

- 找到第一个可滚动祖先元素，监听` scroll``touchmove `等事件，在其回调判断图片是否已在屏幕中出现，再将这些`img`的`data-src`属性写入`src

  > 可通过配置项开启[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)来检测是否出现在视窗内

#### 3.图片裁剪工具

使用已封装好的图片裁剪工具，对上传的头像进行裁剪。

⚠️ 注意：图片裁剪工具只能裁剪在映客服务器中上传的头像。

### 使用指南

#### usage

```js
<avatar src="xxx.png"></avatar>
```

```js
import {Avatar} from 'ik-components';
export default {
  ...
  components: {
    Avatar,
  }
  ...
}
```

#### Props

|   参数   |                    说明                    |  类型   |                                                  默认值                                                   | 是否必传 |
| :------: | :----------------------------------------: | :-----: | :-------------------------------------------------------------------------------------------------------: | :------: |
|   src    |                头像图片 src                | String  |                                                     -                                                     |    是    |
| errorImg |        头像异常时默认显示的错误头像        | String  | <img src="https://media.xiangshengclub.com/MTYzOTU1OTMyNzExMCM1NTcjcG5n.png" alt="w" style="zoom:25%;" /> |    否    |
|  unlazy  |            头像不进行懒加载处理            | Boolean |                                                   false                                                   |    否    |
|  width   | 头像上传到服务器进行裁剪的宽度（单位：px） | Number  |                                                    100                                                    |    否    |
|  height  | 头像上传到服务器进行裁剪的高度（单位：px） | Number  |                                                    100                                                    |    否    |

---

### 引申阅读

#### Intersection Observer API

- 引入之前前端侦测某个元素是否出现在视窗内？

  常规做法是监听 scroll 时间，并利用[`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)计算元素和可视区域的相对位置。

  这样的做法的潜在问题是，必须在 main thread 不断做计算。并且我们在实际使用过程中出现了以下几个问题：① 当出现双甚至多滚动条的时候，只能侦测其中一个滚动，而导致图片可能出现在可视区域无法进行渲染的问题。② 开始时进行懒加载的图片未出现在视窗内，通过改变其`top`值让其出现在视窗，但是没有触发`scroll`事件，因此也会导致图片在可视区域无法渲染。③ 当滚动速度较快的时候，会出现明显的卡顿，加载延迟。

- 引入之后前端侦测某个元素是否出现在视窗内？

  `Intersection Observer API`的核心思想是目标元素与视口产生一个交叉区，因此这个 API 又叫做交叉观察器。因此在 `Intersection Observer API`中有两个重要角色：`root`和`target`。`root`属性指定`target`所在的容器节点（即根元素）；`target`是要侦测的目标元素。root 必须是 target 的祖先元素。`target`的可见程度，可以用一个介于 0~1 的浮点数来表示。当`target`完全可见的时候，可见程度为 1；当`target`完全不可见的时候，可见程度为 0。
