[[toc]]

# 简介

弹窗组件统一入口，弹窗组件使用此 API 来创建。

## 主要思想

​ 封装一个包含蒙层的组件(DialogWrapper)作为弹窗内容组件(ContentWrapper)的包裹器，分别用 Vue.extend()创建两个组件的构造器，从而创建蒙层组件实例和弹窗内容组件实例，将弹窗内容实例作为蒙层组件实例的默认插槽内容，然后将弹窗组件实例挂载到 document.body。

## 弹窗的出现与关闭

<font color="red">**出现**</font>：调用 dialogAPI 中的`show()`,主要是将弹窗内容组件(ContentWrapper)作为蒙层组件(DialogWrapper)的默认插槽内容，然后将蒙层组件实例挂载到`document.body`中。 <br/>
<font color="red">**关闭**</font>：分两种情况 <br/>
1、点击蒙层关闭：直接调用蒙层组件实例的`$close()`,将实例销毁移除，其实原理同下；<br/>
2、点击弹窗内容组件中的内容关闭：<br />
方式一直接调用弹窗内容组件实例的`$close()`来实现，内部实现机制为：首先是会调用蒙层组件内部中的`onClose()`，执行离开动效，动效执行完毕后调用蒙层组件实例的`$close()`销毁实例。
方式二创建弹窗组件实例的方式使用，需要通过`$emit`回传给父组件一个事件来调用实例的`close()`或者直接在内容组件弹窗中调用`this.$close()`。

## 动画效果

使用`<transition>`组件来实现。<br/>
（1）对于蒙层：使用 name 为 fade 的`<transition>`来包裹实现动画进出效果； <br/>（2）对于弹窗内容：使用动态传入的`animateName`来为`<transition>`设置不同的 name 属性值，然后使用不同的类名(在 index.less 中已内置)，进而实现不同的动画效果；

## 使用说明

```js
//方式一  关闭直接在内容组件弹窗中调用this.$close()
dialogAPI.show(ContentWrapper, options);

//方式二  关闭需要回传一个事件给父组件调用实例的close()或直接在内容组件弹窗中调用this.$close()
const instance = new DialogApi(ContentWrapper, options);
instance.show(); //展示
instance.close(); //关闭
```

## 参数

### ContentWrapper

弹窗的内容组件

### options

|             Name              |    Type    |                            Default                             | Description                                                    | Required  |
| :---------------------------: | :--------: | :------------------------------------------------------------: | :------------------------------------------------------------- | :-------- |
| **[`lifecycle`](#lifecycle)** | `{Object}` |                              `{}`                              | 弹窗内容组件的生命周期函数对象集，比如`{created()、mounted()}` | `{false}` |
|     **[`props`](#props)**     | `{Object}` |                              `{}`                              | 传给弹窗内容组件的属性,如`props:{isShow:true}`                 | `{false}` |
|        **[`on`](#on)**        | `{Object}` |                              `{}`                              | 接收弹窗组件传给父组件的事件监听,如`on:{refreshPage(){},}`     | `{false}` |
|   **[`setting`](#setting)**   | `{Object}` | `{ nomask: false, animateName: 'middle', position: 'middle' }` | 设置是否显示弹窗蒙层、弹窗内容组件的位置和动画效果             | `{false}` |

#### `lifecycle`

主要用来给组件设置生命周期钩子函数。因为是使用 mixin 混入的方式来将 lifecycle 混入到弹窗组件内部，所以生命周期函数的选项合并规则遵循 mixin，[具体可看:https://cn.vuejs.org/v2/guide/mixins.html](https://cn.vuejs.org/v2/guide/mixins.html)。

#### `props`

在父组件中传递给弹窗内容组件的属性，需要在弹窗内容组件通过 props 进行接收，否则会获取不到传的值。如：

```js
//在父组件中传入name属性：
dialogAPI.show(ContentWrapper,{
  props:{
    name:'zzm',
    age:18
  }
});

//需要在ContentWrapper组件中通过props属性接收
//获取name为'zzm',age为undefined
props:{
 name:{
   type:String,
   default:'zs'
 }
}
```

#### `on`

在弹窗内容组件中，通过`$emit()`回传给父组件的事件监听。如：

```js
   //在ContentWrapper中
   <template>
    <div>
      <div @click="tellHome">点击</div>
    </div>
   </template>

   <script>
    export default {
      methods:{
        tellHome(){
          this.$emit('tellHome',{age:18})
        }
      }
    }
   </script>

  //在home组件中:
  dialogAPI.show(ContentWrapper,{
  on:{
    tellHome(object){
      console.log(object.age);
    }
  }
});
```

#### `setting`

|               Name                |    Type     | Default  | Description        |
| :-------------------------------: | :---------: | :------: | :----------------- |
|            **nomask**             | `{Boolean}` | `false`  | 弹窗是否显示蒙层   |
| **[`animateName`](#animateName)** | `{String}`  | `middle` | 动效的名字         |
|    **[`position`](#position)**    | `{String}`  | `middle` | 弹窗内容组件的位置 |

##### `animateName`

目前可以传的值为:

- middle：弹窗内容从中间弹出
- top：弹窗内容从顶部弹出
- right：弹窗内容从右边弹出
- bottom：弹窗内容从底部弹出
- left：弹窗内容从左边弹出

##### `position`

可以传包含方位名词的字符串，比如传'left zzz'弹窗内容会在页面的左边垂直居中。目前可以定位包含了(括号中是传的字符串包含的方位名词)：左上角(top left)、顶部水平居中(top)、右上角(top right)、右边垂直居中(right)、右下角(bottom right)、底部水平居中(bottom)、左下角(left bottom)、左边垂直居中(left)。

​

# Demo

## 调用函数方式

**在父组件 home.vue 中：** <br/>
需要使用弹窗的文件中引入 dialogAPI.js 文件，调用其`show()`。

```javascript
<template>
  <div>
    <button @click="test">弹窗</button>
  </div>
</template>

<script>
import DialogApi from 'components/common-dialog/dialogAPI';
import ContentWrapper from '../../components/ContentWrapper';
export default {
  methods:{
    test() {
      DialogApi.show(ContentWrapper, {
        lifecycle:{
          // 将生命周期钩子函数混入到ContentWrapper组件中
          mounted(){
            console.log('home'); //会先执行这个mounted钩子再执行弹窗内的mounted钩子
          }
        },
         props:{
          //  将isShow属性传递给ContentWrapper，ContentWrapper中通过props来进行接收
           isShow:true,
           name:'zzm',
         },
        on:{
          // ContentWrapper组件传递过来的值或者事件调用
          initPage:this.initData(data),
          refresh:this.refresh,
        },
        setting: {
          // 配置实现动画效果
          animateName: 'middle', //弹窗内容从中间弹出
          position: 'middle',  //弹窗内容水平垂直居中页面
          nomask: false, //显示蒙层
        },
      });
    },
  }
}
<script>
```

**在 ContentWrapper 中：**

```js
<template>
  <div class="test">
    <button @click="close">关闭</button>
  </div>
</template>

<script>
export default {
  props:{
    isShow:{
      type:Boolean,
      default:false, //由于传进来的为true，所以获取isShow为true，但是name属性没有通过props接收，所以值为undefined
    }
  },
  mounted(){
    console.log('ContentWrapper'); //执行结果 home   ContentWrapper(会先执行混入的mounted再执行组件自身的mounted)
  },
  methods: {
    close() {
      this.$close(); //关闭弹窗
    },
  },
};
</script>
```

## 创建实例方式

**在父组件 home.vue 中：** <br/>
需要使用弹窗的文件中引入 dialogAPI.js 文件，创建一个 DialogApi 的实例，然后调用实例的 show 方法。

```javascript
<template>
  <div>
    <button @click="test">弹窗</button>
  </div>
</template>

<script>
import DialogApi from 'components/common-dialog/dialogAPI';
import ContentWrapper from '../../components/ContentWrapper';
export default {
  methods:{
    test() {
      const instance = new DialogApi(ContentWrapper, {
        lifecycle:{
          // 将生命周期钩子函数混入到ContentWrapper组件中
          mounted(){
            console.log('home'); //会先执行这个mounted钩子再执行弹窗内的mounted钩子
          }
        },
         props:{
          //  将isShow属性传递给ContentWrapper，ContentWrapper中通过props来进行接收
           isShow:true,
           name:'zzm',
         },
        on:{
          // ContentWrapper组件传递过来的值或者事件调用
          initPage:this.initData(data),
          refresh:this.refresh,
          close(){
            instance.close()//关闭弹窗
          }
        },
        setting: {
          // 配置实现动画效果
          animateName: 'middle', //弹窗内容从中间弹出
          position: 'middle',  //弹窗内容水平垂直居中页面
          nomask: false, //显示蒙层
        },
      });
    },
  }
}
<script>
```

**在 ContentWrapper 中：**

```js
<template>
  <div class="test">
    <button @click="close">关闭</button>
  </div>
</template>

<script>
export default {
  props:{
    isShow:{
      type:Boolean,
      default:false, //由于传进来的为true，所以获取isShow为true，但是name属性没有通过props接收，所以值为undefined
    }
  },
  mounted(){
    console.log('ContentWrapper'); //执行结果 home   ContentWrapper(会先执行混入的mounted再执行组件自身的mounted)
  },
  methods: {
    close() {
      this.$emit('close'); //关闭弹窗。需要回传给父组件，使用on属性来进行监听
      this.$close();//或者直接调用实例上的关闭方法
    },
  },
};
</script>
```
