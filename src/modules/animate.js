/**
 * Module animate
 */
(function(root, factory){
    /* globals define, require, module, self */
    const
            name = 'animate',
            dependencies = ['require', 'utils'];
    if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory(...dependencies.map(dep => require(dep)));
    } else {
        root.require = root.require || function(dep){
            let result;
            Object.keys(Object.getOwnPropertyDescriptors(root)).some(key => {
                if (key.toLowerCase() === dep.toLowerCase()) result = root[key];
                return typeof result !== "undefined";
            });
            return result;
        };
        root[name] = factory(...dependencies.map(dep => require(dep)));/*jshint ignore:line */
    }
}(typeof self !== 'undefined' ? self : this, function(require){


    let undef;
    const
            {doc, loadcss} = require('utils'),
            def = 'fadeIn',
            cssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.compat.min.css',
            listener = doc.createElement('div'),
            ignoreRequire = ['fadeIn', 'fadeOut'],
            classList = [
                'bounce',
                'flash',
                'pulse',
                'rubberBand',
                'shake',
                'headShake',
                'swing',
                'tada',
                'wobble',
                'jello',
                'bounceIn',
                'bounceInDown',
                'bounceInLeft',
                'bounceInRight',
                'bounceInUp',
                'bounceOut',
                'bounceOutDown',
                'bounceOutLeft',
                'bounceOutRight',
                'bounceOutUp',
                'fadeIn',
                'fadeInDown',
                'fadeInDownBig',
                'fadeInLeft',
                'fadeInLeftBig',
                'fadeInRight',
                'fadeInRightBig',
                'fadeInUp',
                'fadeInUpBig',
                'fadeOut',
                'fadeOutDown',
                'fadeOutDownBig',
                'fadeOutLeft',
                'fadeOutLeftBig',
                'fadeOutRight',
                'fadeOutRightBig',
                'fadeOutUp',
                'fadeOutUpBig',
                'flipInX',
                'flipInY',
                'flipOutX',
                'flipOutY',
                'lightSpeedIn',
                'lightSpeedOut',
                'rotateIn',
                'rotateInDownLeft',
                'rotateInDownRight',
                'rotateInUpLeft',
                'rotateInUpRight',
                'rotateOut',
                'rotateOutDownLeft',
                'rotateOutDownRight',
                'rotateOutUpLeft',
                'rotateOutUpRight',
                'hinge',
                'jackInTheBox',
                'rollIn',
                'rollOut',
                'zoomIn',
                'zoomInDown',
                'zoomInLeft',
                'zoomInRight',
                'zoomInUp',
                'zoomOut',
                'zoomOutDown',
                'zoomOutLeft',
                'zoomOutRight',
                'zoomOutUp',
                'slideInDown',
                'slideInLeft',
                'slideInRight',
                'slideInUp',
                'slideOutDown',
                'slideOutLeft',
                'slideOutRight',
                'slideOutUp',
                'animated'
            ],
            type = (function(el){
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd'
                };
                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));
    let
            loaded = false,
            loading = false;

    function ready(load = false){
        return new Promise(resolve => {
            if (loaded === true || load === false) resolve();
            else if (loading === false) {
                console.debug('loading', cssUrl);
                loading = true;
                loadcss(cssUrl).then(() => {
                    loaded = true;
                    listener.dispatchEvent(new Event('ready'));
                    resolve();
                });

            } else {
                listener.addEventListener('ready', () => {
                    resolve();
                });
            }
        });
    }


    function load(elem, animation, callback){

        return new Promise(resolve => {
            if (!(elem instanceof  Element)) throw new Error('Invalid Argument element.');

            if (typeof animation === "function") {
                callback = animation;
                animation = undef;
            }
            animation = animation || def;

            if (typeof animation === 'string') {
                let needLoadingCSS = !animation.split(/\s+/).every(x => ignoreRequire.includes(x));
                ready(needLoadingCSS).then(() => {
                    elem.classList.remove(...classList);
                    if (typeof callback === "function") {
                        elem.addEventListener(type, callback, {
                            once: true,
                            capture: false
                        });
                    }
                    elem.addEventListener(type, e => {
                        elem.classList.remove(...classList);
                        resolve(e);
                    }, {once: true, capture: false});

                    if (elem.hidden === true) elem.hidden = null;
                    else if (elem.classList.contains('hidden')) {
                        elem.classList.remove('hidden');
                    }
                    elem.classList.add('animated', ...animation.split(/\s+/));
                });
            } else throw new Error('Invalid Argument animation.');
        });
    }



    return load;

}));