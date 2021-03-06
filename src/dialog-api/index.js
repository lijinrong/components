// 蒙层组件
import DialogWrapper from './dialog.vue';
import Vue from 'vue';

// 统一管理打开的所有弹窗
const Instances = [];

Vue.mixin({
  watch: {
    $route() {
      // 路由变化，关闭所有弹窗
      while (Instances.length) {
        const Instance = Instances.pop();
        Instance.$close();
      }
    },
  },
  beforeCreate() {
    if (!DialogApi.root && this.$root && this.$root.$el) {
      DialogApi.root = this.$root;
    }
  },
});

function createInstance(
  ContentWrapper,
  { lifecycle, props, on, setting } = {
    setting: { nomask: false, animateName: 'middle', position: 'middle' },
  }
) {
  const DialogC = Vue.extend(DialogWrapper);
  const DialogInstance = new DialogC({
    propsData: {
      ...setting,
    },
    parent: DialogApi.root,
  });

  const options = lifecycle
    ? Object.assign(ContentWrapper, { mixins: [lifecycle] })
    : Object.assign(ContentWrapper);
  const Constructor = Vue.extend(options);
  const Instance = new Constructor({
    propsData: props,
    parent: DialogInstance,
  });

  // 绑定关闭方法，组件内可以调用this.$close()方法关闭自己
  function close() {
    if (!this._DIALOG_API_INSTANCE) {
      Instance.$el.remove();
      this.$el.remove();

      Instance.$destroy();
      this.$destroy();
    } else {
      this.$el.remove();
    }
  }
  function contentClose() {
    this.onClose();
  }
  // 点击弹窗内容中的关闭调用蒙层组件中的onClose()，执行离开动效进而再销毁实例
  Instance.$close = contentClose.bind(DialogInstance);
  // 点击蒙层调用close方法销毁实例
  DialogInstance.$close = close.bind(DialogInstance);

  // 绑定自定义事件
  if (on) {
    Object.keys(on).forEach((key) => {
      if (typeof on[key] === 'function') {
        Instance.$on(key, on[key]);
      }
    });
  }

  return {
    Instance,
    DialogInstance,
  };
}

function mount(Instance, DialogInstance) {
  if (!DialogInstance._isMounted) {
    DialogInstance.$mount();

    Vue.nextTick(() => {
      // 先创建dom，再mounted，避免mounted时获取不到祖先dom
      const temp = document.createElement('div');
      DialogInstance.$refs.content.append(temp);
      Instance.$mount(temp);
    });
  }

  DialogInstance.show = true;
  document.body.append(DialogInstance.$el);
}
/**
 *
 * @param {弹窗内容组件} ContentWrapper
 * @param {
 * lifecycle 弹窗的生命周期
 * props 需要传递给ContentWrapper的属性
 * on 组件回传的事件监听
 * setting<Object> 控制弹窗动效的配置
 *     nomask 是否显示蒙层
 *     animateName 动效的名字（值可为 'middle'|| 'top' || 'right' || 'bottom' || 'right'）
 *     position 弹窗内容在蒙层的位置（值可以传包含'top' || 'right' || 'bottom' || 'right'的字符串）
 * } param1
 * @returns
 */
export default class DialogApi {
  Instance = null;

  _DialogInstance = null;

  context = null;

  static root = null;

  static install() {
    Vue.prototype.$dialog = this;
  }

  // 方式一：静态方法，直接调用DialogApi.show()方式使用
  static show(ContentWrapper, options = {}) {
    // 最好告诉我你的调用上下文 Dialog.show.bind(this)(Modal, param)
    const root = DialogApi.root;
    if (this !== DialogApi && this instanceof Vue) {
      DialogApi.root = this;
    }

    const { Instance, DialogInstance } = createInstance(
      ContentWrapper,
      options
    );

    DialogApi.root = root;

    Instances.push(Instance);
    mount(Instance, DialogInstance);

    return Instance;
  }

  // 方式二：创建实例方式
  constructor(ContentWrapper, options = {}) {
    const root = DialogApi.root;
    // 指定上下文
    if (options.context) {
      DialogApi.root = options.context;
    }
    const { Instance, DialogInstance } = createInstance(
      ContentWrapper,
      options
    );
    DialogInstance._DIALOG_API_INSTANCE = true;
    DialogApi.root = root;
    this.Instance = Instance;
    Instances.push(Instance);
    this._DialogInstance = DialogInstance;
  }

  show() {
    mount(this.Instance, this._DialogInstance);
  }

  close() {
    this._DialogInstance.onClose();
  }

  destroy() {
    this.Instance.$destroy();
    this._DialogInstance.$destroy();
    this.Instance.$el.remove();
    this._DialogInstance.$el.remove();
  }
}
