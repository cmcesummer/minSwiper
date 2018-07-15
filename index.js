(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document
            ? factory(global, true)
            : function(w) {
                  if (!w.document) {
                      throw new Error("requires a window with a document");
                  }
                  return factory(w);
              };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    "use strict";
    var Swiper = null;

    function _pureObject(tar) {
        return {}.toString.call(tar) === "[object Object]";
    }

    function _pureArray(tar) {
        return {}.toString.call(tar) === "[object Array]";
    }

    // 格式化数组下标
    function parseListIndex(num, length) {
        if (num >= length) {
            return 0;
        } else if (num < 0) {
            return length - 1;
        } else {
            return num;
        }
    }

    // 添加css
    function _appenStyle(str, id) {
        var styleDom = document.getElementById(id);
        if (styleDom) {
            return;
        }
        var x = document.createElement("div");
        x.innerHTML = id
            ? "x<style id='" + id + "'>" + str + "</style>"
            : "x<style>" + str + "</style>";
        var head = document.getElementsByTagName("head")[0],
            first_link = document.getElementsByTagName("link")[0];
        head.insertBefore(x.lastChild, first_link);
    }

    // 创建样式
    var BaseStyle = (function _createStyle(dict) { ///cmcesummer/minSwiper/blob/master/image/circul_icon.png?raw=true
        var swiper_button =
            ".swiper_button_prev, .swiper_button_next{width:77px; height:41px;background: url(https://github.com/cmcesummer/minSwiper/blob/master/image/swiper_button.png?raw=true); position: absolute; top: 50%; margin-top: -10px;z-index: 5;cursor: pointer;}" +
            ".swiper_button_prev{left: 10px;background-position: 0 -45px;}" +
            ".swiper_button_next {right: 10px;background-position: -78px -45px;}";
        var bar =
            ".u_slider_box .control_item {position: absolute; bottom: 10px; text-align: center; z-index: 10; width: 100%;}" +
            ".u_slider_box .control_item span {display: inline-block; width:15px; height: 15px;  border-radius: 15px; cursor: pointer;margin: 0 5px; background-image: url(https://github.com/cmcesummer/minSwiper/blob/master/image/circul_icon.png?raw=true); background-repeat:no-repeat; background-position: 0 -65px;}" +
            ".u_slider_box .control_item span.active{background-position: 0 0;}";
        var style1 =
            ".u_swiper_box {width: 1010px; margin:0 auto ; padding-top: 250px; box-sizing: border-box;}" +
            ".swiper_container {position: relative;width: 1010px; height:440px;}" +
            ".swiper_wrapper{position: absolute; width: 1010px; height:440px; }" +
            ".swiper_wrapper .img{opacity: 0; width: 649px; height:334px; z-index:1; position: absolute; left: 50%; margin-left:-320px;top:50%; margin-top: -160px;/* transform: scale(.8);  */-o-transition: all .3s linear; -moz-transition: all .3s linear; -webkit-transition: all .3s linear; transition: all .3s linear; text-align: center; -webkit-user-select: none;-webkit-touch-callout: none;-moz-user-select: none;-ms-user-select: none; user-select: none;}" +
            ".swiper_wrapper .top{ z-index:2;margin-top:-200px;width: 820px; height: 420px;opacity: 1;margin-left:-410px; box-sizing: border-box}" +
            ".swiper_wrapper .next, .swiper_wrapper .last{opacity: .8; }" +
            ".swiper_wrapper .next{margin-left:-120px;}" +
            ".swiper_wrapper .last{margin-left:-520px;}" +
            ".swiper_wrapper a{width: 100%; height: 100%; display:inline-block; background-repeat:no-repeat;background-size:100%; background-position:center; cursor:default}" +
            ".swiper_wrapper .top img{width: 99%; border: 2px solid #000;box-shadow: 0px 0 20px red;}" +
            swiper_button +
            bar;
        var style2 =
            ".u_slider_box, .swiper_wrapper {position: absolute; width: 100%; height:100%;}" +
            ".swiper_wrapper .img{opacity: 0; width: 100%; height:100%; z-index:1; position: absolute;-o-transition: all .3s linear; -moz-transition: all .3s linear; -webkit-transition: all .3s linear; transition: all .3s linear; -webkit-user-select: none;-webkit-touch-callout: none;-moz-user-select: none;-ms-user-select: none; user-select: none;}" +
            ".swiper_wrapper .top{ z-index:2; opacity: 1; box-sizing: border-box}" +
            ".swiper_wrapper .next, .swiper_wrapper .last{opacity: 0; }" +
            ".swiper_wrapper a{width: 100%; height: 100%; display:inline-block; background-repeat:no-repeat;background-size:100%; background-position:center; cursor:default}" +
            swiper_button +
            bar;

        return [style1, style2];
    })();

    // 初始化 dom 结构
    function _init_(dict) {
        var content = dict.content,
            html = '<div class="swiper_wrapper">',
            html_span = '<div class="control_item">',
            have_button = dict.have_button,
            have_bar = dict.have_bar,
            i = 0,
            item = null,
            length = content.length;
        if (length <= 1) {
            have_button = false;
            have_bar = false;
        }
        for(; i < length; i++) {
            item = content[i];
            if(!item.dom && !item.src) {
                console.warn('必须存在 src 或 dom 属性');
                return
            }
            html += '<div class="img">'+ (item.dom ? item.dom : 
                        (
                            '<a class="img_a_box" href="' +  
                            (item.href ? item.href : "javascript:;") + '" ' + 
                            (item.target ? "target='_blank'" : "") +' style="background-image:url('+ item.src +')" ></a>'
                        ) )
                    +'</div>';
            html_span += "<span></span>";        
        }
        html_span += "</div>";
        html += "</div>";
        if (have_button) {
            html +=
                '<div class="swiper_button_prev"></div><div class="swiper_button_next"></div>';
        }
        if (have_bar) {
            html += html_span;
        }
        dict.container.innerHTML = '<div class="u_slider_box">' + html + "</div>";

        this.changeActive();
    }

    function _bindEvent(dict) {
        var context = this,
            control_item = Swiper.queryByClass(
                "control_item",
                this.container
            )[0],
            swiper_button_prev = Swiper.queryByClass(
                "swiper_button_prev",
                this.container
            )[0],
            swiper_button_next = Swiper.queryByClass(
                "swiper_button_next",
                this.container
            )[0],
            barDomArr = [].slice.call(
                Swiper.queryByClass("control_item", this.container)[0]
                    .childNodes
            ),
            swiper_wrapper = Swiper.queryByClass(
                "swiper_wrapper",
                this.container
            )[0];
        var btnThrottle = false;
        function change(index) {
            if (btnThrottle) {
                return;
            }
            btnThrottle = true;
            context.pauseAutoPlay();
            context.changeActive(index);
            if (context.auto) {
                context.autoplay(dict.auto);
            }
            setTimeout(function() {
                btnThrottle = false;
            }, 300);
        }
        function btnChange(type, e, fn) {
            var index = context.starkMap.activePage,
                indexs = type === "next" ? index + 1 : index - 1,
                length = context.starkMap.content.length,
                next_index = parseListIndex(indexs, length);
            change(next_index);
            fn && fn.call(context, e, type);
        }
        // 底部 bar 点击事件
        if (control_item) {
            Swiper.delegate(control_item, "click", "span", function(e) {
                var target = e.target || e.srcElement,
                    index = barDomArr.indexOf(target);
                change(index);
                dict.bar_event && dict.bar_event.call(context, e, index);
            });
        }
        // 按钮 点击事件
        if (swiper_button_prev) {
            // 上一个
            Swiper.bind(swiper_button_prev, "click", function(e) {
                btnChange("last", e, dict.button_event);
            });
            // 下一个
            Swiper.bind(swiper_button_next, "click", function(e) {
                btnChange("next", e, dict.button_event);
            });
        }
        // 滑动事件
        if (!swiper_wrapper) return;
        (function() {
            var startX = 0;
            Swiper.bind(swiper_wrapper, "touchstart", function(e) {
                startX = e.changedTouches[0].clientX;
            });
            Swiper.bind(swiper_wrapper, "touchend", function(e) {
                var endX = e.changedTouches[0].clientX,
                    pathX = endX - startX,
                    type = pathX > 0 ? "last" : "next";
                // - 右 + 左
                if (Math.abs(pathX) > 50) {
                    btnChange(type, e, dict.touch_event);
                }
            });
        })();
    }

    /**
     * @param {} container
     * @param {} content 内容数组 包含{ src , href, target, ||  dom } 
     * @param {} have_button  左右控制按钮
     * @param {} have_bar 底部分页 bar
     * @param {} auto 自动播放
     * @param {} type 轮播样式
     * @param {} button_event button 事件
     * @param {} bar_event bar 事件
     * @param {} touch_event touch 事件
     */
    Swiper = function(dict) {
        var starkMap = Swiper.extends(true, {}, dict);
        this.container = starkMap.container;
        this.starkMap = starkMap;
        this.starkMap.activePage = 0;
        var type = starkMap.type || 1;
        _appenStyle(BaseStyle[type], "swiperstyle" + type);
        // _init.call(this, starkMap);
        _init_.call(this, starkMap);
        _bindEvent.call(this, starkMap);
        if (dict.auto) {
            if (typeof dict.auto !== "number") {
                console.warn("auto 应该是 number 类型");
                return;
            }
            this.autoplay(dict.auto);
        }
    };

    Swiper.prototype = {
        constructor: Swiper,
        changeActive: function(index) {
            // todo  添加判断 activePage 合法性
            var activePage = this.starkMap.activePage,
                length = this.starkMap.content.length,
                next_activePage,
                next_precPage,
                next_lastPage;

            if (typeof index === "number") {
                this.starkMap.activePage = next_activePage = parseListIndex(
                    index,
                    length
                );
                next_precPage = parseListIndex(next_activePage + 1, length);
                next_lastPage = parseListIndex(next_activePage - 1, length);
            } else {
                this.starkMap.activePage = next_activePage = 0;
                next_precPage = parseListIndex(next_activePage + 1, length);
                next_lastPage = parseListIndex(next_activePage - 1, length);
            }
            var imgDomArr = Swiper.queryByClass("img", this.container),
                barDomArr = Swiper.queryByClass(
                    "control_item",
                    this.container
                )[0].childNodes;
            if (this.starkMap.have_bar) {
                Swiper.domClass.remove(barDomArr[activePage], "active");
                Swiper.domClass.add(barDomArr[next_activePage], "active");
            }
            Swiper.domClass.remove(imgDomArr[activePage], "top");
            Swiper.domClass.remove(
                imgDomArr[parseListIndex(activePage + 1, length)],
                "next"
            );
            Swiper.domClass.remove(
                imgDomArr[parseListIndex(activePage - 1, length)],
                "last"
            );
            Swiper.domClass.add(imgDomArr[next_activePage], "top");
            Swiper.domClass.add(imgDomArr[next_precPage], "next");
            Swiper.domClass.add(imgDomArr[next_lastPage], "last");
        },
        autoplay: function(time) {
            var context = this,
                index = this.starkMap.activePage,
                next_index = parseListIndex(
                    index + 1,
                    context.starkMap.content.length
                );
            time = time || this.starkMap.auto || 3000;
            clearTimeout(this.timer);
            this.auto = true;
            this.timer = setTimeout(function() {
                context.changeActive(next_index);
                context.autoplay(time);
            }, time);
        },
        pauseAutoPlay: function() {
            clearTimeout(this.timer);
        },
        stopAutoPlay: function() {
            this.pauseAutoPlay();
            this.auto = false;
        }
    };

    Swiper.extends = function extend(deep, target, source) {
        var key = null;
        if (!deep) {
            for (key in source) {
                target[key] = source[key];
            }
        }
        var sour = null,
            targ = null;
        for (key in source) {
            sour = source[key];
            targ = target[key];
            if (_pureObject(sour)) {
                targ = _pureObject(targ) ? targ : {};
                target[key] = extend(deep, targ, sour);
            } else if (_pureArray(sour)) {
                targ = _pureArray(targ) ? targ : [];
                target[key] = extend(deep, targ, sour);
            } else {
                target[key] = sour;
            }
        }
        return target;
    };

    // 挂载 通过classname 查询 dom 的方法 为 Swiper 的静态方法
    Swiper.extends(true, Swiper, {
        queryByClass: function(classname, parent) {
            if (!parent) {
                parent = document;
            }
            if (parent.getElementsByClassName) {
                return parent.getElementsByClassName(classname);
            }
            var eleArr = parent.getElementsByTagName("*");
            var classArr = [];
            for (var i = 0; i < eleArr.length; i++) {
                if (dom_class.contains(eleArr[i], classname)) {
                    classArr.push(eleArr[i]);
                }
            }
            return classArr;
        }
    });

    // 挂载 className 操作方法 为 Swiper 的静态方法
    Swiper.extends(true, Swiper, {
        domClass: {
            add: function(dom, class_name) {
                var h5_class = dom.classList;
                if (h5_class) {
                    return h5_class.add(class_name);
                }
                var class_str = "";
                if (!dom_class.contains(dom, class_name)) {
                    class_str = " " + class_name;
                }
                dom.className += class_str;
            },
            remove: function(dom, class_name) {
                var h5_class = dom.classList;
                if (h5_class) {
                    return h5_class.remove(class_name);
                }
                var reg = new RegExp("(^|\\s)" + class_name + "(\\s|$)", "g"),
                    className = dom.className.replace(reg, " ");

                dom.className = className;
            },
            contains: function(dom, class_name) {
                var h5_class = dom.classList;
                if (h5_class) {
                    return h5_class.contains(class_name);
                }
                var reg = new RegExp("(^|\\s)" + class_name + "(\\s|$)"),
                    dom_class = dom.className;
                return reg.test(dom_class);
            }
        }
    });

    // 
 
    Swiper.extends(true, Swiper, {
        bind: function(element, type, handle) {
            function __eventHandler(e) {
                var event = e || window.event
                handle.call(this,event)
            }
            if(window.addEventListener) {
                element.addEventListener(type, __eventHandler, false);
            } else if(window.attachEvent) {
                element.attachEvent('on' + type, __eventHandler);
            } else {
                target['on' + type] = __eventHandler;
            }
        },
        delegate : function(element, type, selector , handle) {
            // selector 为 string
            this.bind(element, type, function(e) {
                var target = e.target || e.srcElement,
                    _selector = '',
                    judge = function(target, the_if) {
                        if(the_if(target)) {
                            handle.call(this, e)
                        } else {
                            if(_event_utils.bind_parent(target, function(parent) {
                                return the_if(parent)
                            }, element)) {
                                handle.call(this, e)
                            }
                        }
                    };

                if(selector.indexOf('#') === 0) {
                    _selector = selector.substring(1);
                    judge(target, function(target) {
                        return target.id.toLowerCase() === _selector;
                    })
                } else if(/^\.([\w-]+)$/.test(selector)) {
                    _selector = selector.substring(1);
                    judge(target, function(target) {
                        return new RegExp('(^|\\s+)'+ _selector +'(\\s+|$)').test(target.className.toLowerCase())
                    })
                } else {
                    _selector = selector;
                    judge(target, function(target) {
                        return _selector === target.nodeName.toLowerCase();
                    })
                }
            })
        }
    })

    var _event_utils = {
        bind_parent: function (target, fn, top) {
            if(top === target) {
                return false
            }
            var parent = target.parentElement || target.parentNode ;
            if(parent) {
                if(fn(parent)) {
                    return parent
                } else {
                    return _event_utils.bind_parent(parent, fn)
                }
            } else {
                return null
            }
        }
    }

    if (!noGlobal) {
        window.Swiper = Swiper;
    }
    return Swiper;
});
