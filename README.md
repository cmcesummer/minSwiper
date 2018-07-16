# minSwiper

拿来即用的迷你swiper，配置简单，拓展性好，可覆盖样式。

## 使用
支持多种引入方式。  
```javascript
var swiper =  new Swiper({
        // 页面容器
        container: document.getElementById("box"),
        // swiper 数组
        content: [
            {
                // 图片地址
                src: 'https://segmentfault.com/img/remote/1460000015482456', 
                // 如果写 href 则支持跳转
                href: 'https://github.com', 
                // 在有 href 的前提下 以何种方式跳转
                target: true
            }, 
            {src: 'http://ww1.sinaimg.cn/large/005Y4rCogy1ft1ikzcqzqj30ka0et77a.jpg'}, 
            {src: 'https://segmentfault.com/img/bVbc08a?w=740&h=416'},
            // 支持自定义 dom ， 当有dom时 不会读取其他属性
            {dom: '<a class="img_a_box" href="javascript:;" style="background-image:url(http://ww1.sinaimg.cn/large/005Y4rCogy1ft1ikzcqzqj30ka0et77a.jpg)"></a>'}
        ],
        // 是否有 左右按钮
        have_button: true,
        // 是否有底部控制 bar
        have_bar: true,
        // 支持的 swiper 样式， 目前只有 0,1 。计划添加2。其他的话是空，可以自定义样式。默认是1
        type: 1,
        // 是否 自动播放， 自动播放的毫秒数
        auto: 10000,
        // 按钮自定义事件
        button_event: function(e, type) {
            // this 指向实例对象
            // e 点击事件的 e
            // type : 'last' 'next' 上一个 下一个 按钮
        },
        // 自定义 touch 事件。 参数同 button_event
        touch_event: function (e, type) {},
        // 底部 bar 的点击事件
        bar_event: function(e, index) {
            // index 点击的第几个 bar
        }
    })
```
实例化的对象有四个方法： `changeActive`,`autoplay`,`pauseAutoPlay`,`stopAutoPlay`。   
```javascript
/**
 * 设置当前展示哪个 swiper, 当大于数组最大长度时展示最后一个， 小于0时展示0
 * 可以用于具体业务逻辑来控制当前swiper显示哪一个
 * @param {number} index 
 */
swiper.changeActive(index)

/**
 * 可以通过脚本设置来自动播放。如果初始化时设置了auto,后又通过脚本autoplay了，则以autoplay的时间为准
 * 可以节和另外两个autoplay的方法满足一些奇怪的业务需要，下面再说
 * @param {number} time 
 */
swiper.autoplay(time)

/**
 * 暂停轮播
 */
swiper.pauseAutoPlay(time)

/**
 * 停止轮播
 */
swiper.stopAutoPlay(time)
```
- 其中`暂停轮播`与`停止轮播`的区别： 如果设置了 `autoplay`，再 `pauseAutoPlay` 后，接下来通过按钮或底部bar触发了下个轮播图展示，则下个轮播图展示后会恢复 自动轮播 这个属性。但是如果是 `stopAutoPlay`, 则按钮或bar 不会恢复自动轮播。   

- `autoplay pauseAutoPlay stopAutoPlay` 这三个方法结合 `button_event touch_event` 自定义事件， 用可以满足一些奇怪的需求： 比如一开始不需要轮播， 然后当快速点击2次或多次下一个按钮时就开始轮播 这种奇怪需求。

## 提供的静态方法
该`minSwiper`提供了几个实用的方法：
```javascript
/**
 * 提供深浅拷贝方法 没有做参数判断，所以这三个参数都是必须的
 * @param {boolean} deep 是否深拷贝
 * @param {object} target 目标
 * @param {object} source 源
 */
Swiper.extends(deep, target, source);

/**
 * 提供通过 classname 查找 dom 的方法，兼容ie6. 
 * @param {string} classname 是否深拷贝
 * @param {object} parent 在哪个父元素下查找 默认 document
 */
Swiper.queryByClass(classname, parent)

/**
 * 提供 添加 移除 是否存在 classname 的方法， 兼容 ie6
 * @param {object} dom 操作的dom
 * @param {string} class_name 操作的类名
 */
Swiper.domClass.add(dom, class_name)
Swiper.domClass.remove(dom, class_name)
Swiper.domClass.contains(dom, class_name)

/**
 * 提供事件绑定的方法， 兼容ie6
 * @param {object} element 绑定的元素
 * @param {string} type 绑定的方法
 * @param {function} handle 绑定的事件回调
 */
Swiper.bind(element, type, handle)

/**
 * 提供事件代理的方法， 兼容ie6 
 * @param {object} element 绑定的元素
 * @param {string} type 绑定的方法
 * @param {string} selector 代理的元素 支持 '#id' '.classname' 'nodeName' 
 * @param {function} handle 绑定的事件回调
 */
Swiper.delegate(element, type, selector , handle)

```
以上提供的静态方法都是我代码内用到的，所以顺便就提供出来了，要不也是浪费，挺好用的。  
因为是内部使用，所以没有做过多的参数处理，所以要按照规定来，瞎传参数可是没有校验会报错的哦  
`瞎传参数并不可取`   

## todo
- [x] 修改 delegate 事件代理
- [x] 添加使用说明
- [ ] 添加其他样式
- [x] 添加可拓展的例子
目前的第三个样式纯粹在搞笑，我再想想

## CHANGELOG
添加了事件代理，写的有点绕，不过是为了精简代码

