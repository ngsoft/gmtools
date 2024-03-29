/**
 * Utilities for tampermonkey userscripts
 * @link https://cdn.jsdelivr.net/gh/ngsoft/userscripts@master/dist/tools.min.js
 * https://cdn.jsdelivr.net/gh/requirejs/requirejs@latest/require.js
 * https://github.com/requirejs/requirejs/blob/latest/require.js
 * @link https://github.com/ngsoft/userscripts/blob/master/dist/tools.js
 */

/** Small Sandbox to execute code without scripts vars */
(function(window, document){
    window.executeGMCode = function(codeToExecute){
        try {
            /*jslint evil: true */
            window.eval(codeToExecute);
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;
    };
}((typeof unsafeWindow !== 'undefined' ? unsafeWindow : window), (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).document));

// exports gmtools to the userscript
const gmtools = {};

(function(global){

    /* globals self, requirejs, unsafeWindow, GM_info, GM */

    if (!GM_info) throw new Error('Not loaded in userscript.');

    const
            // Scallar types
            s = "string",
            b = "boolean",
            f = "function",
            u = "undefined",
            n = "number",
            //time
            second = 1000,
            minute = 60 * second,
            //exports
            GMinfo = (typeof GM_info !== 'undefined' ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null)),
            scriptname = GMinfo ? `${GMinfo.script.name} @${GMinfo.script.version}` : "",
            UUID = GMinfo ? GMinfo.script.uuid : "",
            reqjs = {
                //Requirejs CDN
                src: 'https://cdn.jsdelivr.net/gh/requirejs/requirejs@latest/require.min.js',
                key: 'require.min.js'
            }, sourceUrlRegExp = /\/\/@\s+sourceURL=/,
            sourceMappingUrlRegExp = /(\/\/#\s+sourceMappingURL=[^\n\r]*)/g,
            defineRegExp = /(^|[^\.])define\s*\(/,
            doc = global.document;


    //add sourceURL and sourceMappingURL
    function transform(content, url){
        url = url instanceof URL ? url : new URL(url);
        let sourceMappingUrl = content.match(sourceMappingUrlRegExp), sourceUrl;
        if (sourceMappingUrl) {
            content = content.replace(sourceMappingUrlRegExp, '');
            let
                    smurl = '//# sourceMappingURL=',
                    newSource = sourceMappingUrl[0],
                    matches = newSource.match(/=(.*)$/);
            if (matches !== null) {
                let file = matches[1];
                if (file.indexOf('//') === 0) {
                    file = url.protocol + file;
                } else if (file.indexOf('/') === 0) {
                    file = url.origin + file;
                } else if (!(/^https?:\/\//.test(file))) {
                    file = url.origin + url.pathname.substr(0, url.pathname.lastIndexOf('/') + 1) + file;
                }
                smurl += file;
                content += '\n' + smurl;
            }

        }
        if (!sourceUrlRegExp.test(content)) {
            sourceUrl = url.href;
            content += "\r\n//# sourceURL=" + sourceUrl;
        }


        return content;
    }

    function isPlainObject(v){
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }


    // Get a nested value in an object
    function getDeep(object, path){
        return path.split('.').reduce((obj, key) => obj && obj[key], object);
    }

    // Deep extend destination object with N more objects
    function extend(target = {}, ...sources) {
        if (!sources.length) {
            return target;
        }

        const source = sources.shift();

        if (!isPlainObject(source)) {
            return target;
        }

        Object.keys(source).forEach(key => {

            if (isPlainObject(source[key])) {
                if (!Object.keys(target).includes(key)) {
                    Object.assign(target, {
                        [key]: {}
                    });
                }

                extend(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        });

        return extend(target, ...sources);
    }


    /**
     * Loads an external script (or multiple)
     * @param {string|URL} ...urls
     * @param {boolean} [defer]
     * @returns {Promise}
     */
    function loadjs(...urls){

        let
                defer = false,
                args = Array.from(arguments).filter(x => {
            if (typeof x === b) {
                defer = x;
                return false;
            }
            return true;
        });


        return new Promise((resolve, reject) => {

            let
                    count = 0,
                    resolver = function(e){
                        if (e.type === "error") {
                            loadRejectMessage(e, reject);
                            return;
                        }
                        count++;
                        if (count === args.length) resolve(e.target);
                    };
            args.forEach(src => {
                if (src instanceof URL) src = src.href;
                if (typeof src !== s) {
                    reject(new Error('Invalid argument src'));
                    return;
                }
                let script = doc.createElement('script');
                Object.assign(script, {
                    type: 'text/javascript',
                    onload: resolver,
                    onerror: resolver,
                    src: src
                });
                if (defer === true) script.defer = true;
                doc.head.appendChild(script);

            });

        });
    }

    /**
     * Loads an external CSS (or multiple)
     * @param {string|URL} ...urls
     * @returns {Promise}
     */
    function loadcss(url){

        let args = Array.from(arguments);

        return new Promise((resolve, reject) => {

            let
                    count = 0,
                    resolver = function(e){
                        if (e.type === "error") {
                            loadRejectMessage(e, reject);
                            return;
                        }

                        count++;
                        if (count === args.length) resolve(e.target);
                    };
            args.forEach(src => {
                if (src instanceof URL) src = src.href;
                if (typeof src !== s) {
                    reject(new Error('Invalid argument src'));
                    return;
                }
                let style = doc.createElement('link');
                Object.assign(style, {
                    rel: "stylesheet",
                    type: "text/css",
                    onload: resolver,
                    onerror: resolver,
                    href: src
                });
                doc.head.appendChild(style);

            });

        });
    }





    class Configuration {

        constructor(){
            Object.defineProperties(this, {
                config: {value: {}, enmerable: false, configurable: true, writable: false}
            });
        }

        /**
         * Add a module to RequireJS
         * @param {string} name
         * @param {string} path
         * @param {Object|undefined} [config]
         * @param {string|Object} [shim]
         * @returns {Configuration}
         */
        addModule(name, path, config, shim){
            if (typeof name !== s) throw new Error('Invalid Argument name.');
            else if (typeof path !== s || !(/^http/.test(path))) throw new Error('Invalid Argument path.');
            if (typeof config === s) {
                shim = config;
                config = {};
            }
            config = isPlainObject(config) ? config : {};
            shim = isPlainObject(shim) ? shim : (typeof shim === s ? {exports: shim} : null);

            const reqCfg = {
                config: {
                    [name]: config
                },
                paths: {
                    [name]: path
                }
            };
            if (isPlainObject(shim)) {
                extend(reqCfg, {
                    shim: {
                        [name]: shim
                    }
                });
            }
            this.set(name, config);
            require.config(reqCfg);
            return this;
        }

        get(key){
            if (typeof key === u) return Object.assign({}, this.config);
            else if (typeof key === s) {
                if (key.indexOf('.') !== -1) return getDeep(this.config, key);
                return this.config[key];
            }
        }

        set(key, value){
            if (isPlainObject(key)) {
                extend(this.config, key);
            } else if (typeof key === s) {
                if (isPlainObject(this.config[key]) && isPlainObject(value)) {
                    extend(this.config[key], value);
                } else this.config[key] = value;
            }
            return this;
        }

        has(key){
            return typeof key === s && typeof this.config[key] !== u;
        }
    }


    class Cache {

        expiresAt(time){
            if (typeof time === n) time += this.ttl;
            else time = 0;
            return time;
        }

        get entries(){
            let entries;
            if (this.supported) entries = localStorage.getItem(this.prefix + 'CacheEntries');
            if (typeof entries === s) entries = JSON.parse(entries);
            else entries = {};
            return entries;
        }
        set entries(entries){
            if (this.supported) {
                if (this.enabled) localStorage.setItem(this.prefix + 'CacheEntries', JSON.stringify(entries));
                else localStorage.removeItem(this.prefix + 'CacheEntries');
            }

        }

        get now(){
            return  +new Date();
        }
        get enabled(){
            return (config.get('cache').enabled === true) && this.supported;
        }
        get supported(){
            return ("localStorage" in global) && ("getItem" in global.localStorage);
        }

        get prefix(){
            return config.get('cache').prefix;
        }
        get ttl(){
            return config.get('cache').ttl;
        }


        saveItem(module, code){
            if (!this.enabled) return false;
            let
                    key = this.prefix + module,
                    entries = this.entries;
            entries[key] = this.now;

            try {
                localStorage.setItem(key, code);
                this.entries = entries;
                return true;
            } catch (e) {
                console.warn('Cannot save cache item', module);
            }
            return false;
        }

        loadItem(module){
            if (!this.enabled) return null;
            let
                    key = this.prefix + module,
                    created = this.entries[key] || 0,
                    expire = created > 0 ? this.expiresAt(created) : 0;
            if (this.now > expire) {
                localStorage.removeItem(key);
                return null;
            }
            return localStorage.getItem(key);
        }



        clear(){

            if (this.supported && this.prefix.length > 0) {
                let keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    if (key.indexOf(this.prefix) === 0) keys.push(key);
                }
                keys.forEach(k => localStorage.removeItem(k));
            }

        }

        exec(code){
            return global.executeGMCode(code);
        }

        constructor(){
            if (this.supported) {

                //clear cache on new session
                if (sessionStorage.getItem(GM_info.script.uuid) === null) {
                    this.clear();
                    sessionStorage.setItem(GM_info.script.uuid, this.now);
                    sessionStorage.setItem('newsession', true);
                    return;
                }

                let entries = this.entries;
                //detects expired entries
                Object.keys(entries).forEach(key => {
                    let
                            created = entries[key],
                            expire = this.expiresAt(created);
                    if (this.now > expire) {
                        localStorage.removeItem(key);
                        delete entries[key];
                    }
                });
                this.entries = entries;
            }
        }
    }


    class Request {

        /**
         * Executes callback when complete
         * @param {function} callback
         * @returns {Request}
         */
        complete(callback){
            Array.from(arguments).forEach(arg => {
                if (typeof arg === f) {
                    if (this.status !== null) arg(this.response);
                    else this.config.complete.push(arg);
                }
            });
            return this._send();
        }

        /**
         * Executes callback on success
         * @param {function} callback
         * @returns {Request}
         */
        success(callback){
            Array.from(arguments).forEach(arg => {
                if (typeof arg === f) {
                    if (this.status === 'success') {
                        arg(this.response);
                    } else this.config.success.push(arg);
                }
            });
            return this._send();
        }

        /**
         * Executes callback on error
         * @param {function} callback
         * @returns {Request}
         */
        error(callback){
            Array.from(arguments).forEach(arg => {
                if (typeof arg === f) {
                    if (this.status === 'error') arg(this.response);
                    else this.config.error.push(arg);
                }
            });
            return this._send();
        }

        _send(){

            if (!this.sent) {
                this.sent = true;
                if (this.config.timeout > 0) {
                    setTimeout(() => {
                        if (this.xhr.readyState !== 4) this.xhr.abort();
                    }, this.config.timeout * second);
                }

                try {
                    this.xhr.send();
                } catch (e) {
                    this.response = {
                        status: 0,
                        text: "",
                        statusText: e.message,
                        url: this.url,
                        error: e
                    };
                    let ev = new Event('error');
                    ev.response = this.response;
                    this.status = 'error';
                    this.listener.dispatchEvent(ev);
                }
            }
            return this;
        }

        /**
         * Executes the request
         * @returns {Promise}
         */
        fetch(){
            return new Promise((resolve, reject) => {
                this
                        .success(e => resolve(e))
                        .error(e => reject(e));
            });
        }

        /**
         * Creates a new Request
         * @param {string} url
         * @param {Object} [headers] Headers to send
         * @param {number} [timeout] Timeout in seconds
         * @param {boolean} [cookies] Send Credentials
         * @param {boolean} [async] Asynchronous Request
         */
        constructor(url, headers, timeout, cookies, async){

            if (url instanceof URL) url = url.href;
            if (typeof url !== s) throw new Error('Invalid Argument url');

            if (typeof headers === n) {
                async = cookies;
                cookies = timeout;
                timeout = headers;
                headers = null;
            } else if (typeof headers === b) {
                async = timeout;
                cookies = headers;
                timeout = null;
                headers = null;
            }

            headers = (isPlainObject(headers)) ? headers : {};
            timeout = typeof timeout === n ? timeout : 0;
            cookies = typeof cookies === b ? cookies : false;
            async = typeof async === b ? async : true;


            Object.defineProperties(this, {
                config: {
                    enmerable: false, configurable: true, writable: false,
                    value: {
                        success: [],
                        error: [],
                        complete: [],
                        cookies: cookies,
                        async: async,
                        headers: headers,
                        timeout: timeout
                    }
                },
                url: {
                    enmerable: false, configurable: true, writable: true,
                    value: url
                },
                listener: {
                    enmerable: false, configurable: true, writable: false,
                    value: global.document.createElement('div')
                },
                xhr: {
                    enmerable: false, configurable: true, writable: true,
                    value: new XMLHttpRequest()
                },
                response: {
                    enmerable: false, configurable: true, writable: true,
                    value: null
                },
                status: {
                    enmerable: false, configurable: true, writable: true,
                    value: null
                },
                sent: {
                    enmerable: false, configurable: true, writable: true,
                    value: false
                }
            });

            let
                    xhr = this.xhr,
                    listener = this.listener;

            ['success', 'error', 'complete'].forEach(type => {
                listener.addEventListener(type, e => {
                    this.config[e.type].forEach(fn => fn(this.response));
                    if (e.type !== 'complete') {
                        let evt = new Event('complete');
                        evt.response = this.response;
                        listener.dispatchEvent(evt);
                    }
                });
            });

            xhr.open('GET', url, async === true);
            xhr.withCredentials = cookies === true;
            Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status !== 0) {

                    let
                            type = 'success',
                            response = this.response = {
                                status: xhr.status,
                                text: xhr.responseText,
                                statusText: xhr.statusText,
                                url: xhr.responseURL
                            };
                    if (response.status > 399 && response.status < 600) {
                        response.error = new Error('Invalid Status Code');
                        type = 'error';
                    }
                    this.status = type;
                    listener.dispatchEvent(new Event(type));
                }
            };
            xhr.onerror = xhr.onabort = e => {
                let
                        response = this.response = {
                            status: xhr.status,
                            text: xhr.responseText,
                            statusText: xhr.statusText,
                            url: xhr.responseURL
                        };
                if (e.type === 'abort') response.error = new Error('Operation timeout.');
                else response.error = new Error('Network Error.');
                this.status = 'error';
                listener.dispatchEvent(new Event('error'));
            };

        }
    }


    let
            matches,
            root = 'https://cdn.jsdelivr.net/gh/ngsoft/gmtools@master/dist', //default script location
            gmexports = {GMinfo, scriptname, UUID},
            headers = gmexports.headers = {},
            inline = [
                'name', 'namespace', 'version', 'author', 'description',
                'homepage', 'homepageURL', 'website', 'source',
                'icon', 'iconURL', 'defaulticon',
                'icon64', 'icon64URL',
                'updateURL', 'downloadURL', 'supportURL',
                'run-at', 'noframes',
                //custom
                'dev', 'usecache'
            ];


    // Pass sandboxed functions into the module GM
    [
        'GM_setValue',
        'GM_getValue',
        'GM_deleteValue',
        'GM_listValues',
        'GM_addValueChangeListener',
        'GM_removeValueChangeListener',
        'GM_registerMenuCommand',
        'GM_unregisterMenuCommand',
        'GM_getResourceText',
        'GM_getResourceURL',
        'GM_xmlhttpRequest',
        'GM_download',
        'GM_log',
        'GM_openInTab',
        'GM_getTab',
        'GM_saveTab',
        'GM_getTabs',
        'GM_addStyle',
        'GM_notification',
        'GM_setClipboard'
    ].forEach(v => gmexports[v] = self[v]);



    // Parses Userscript headers
    GMinfo.script.header.split(/\n+/).forEach(line => {
        if ((matches = /@([\w\-]+)(.*)?/.exec(line)) !== null) {
            let key = matches[1],
                    value = matches[2] || "", real;
            value = value.trim();
            if (!headers[key]) headers[key] = [];

            value = value.length > 0 ? value : "true";
            try {
                real = JSON.parse(value);
            } catch (e) {
                real = value;
            }
            if (inline.includes(key)) headers[key] = real;
            else headers[key].push(real);
        }
    });

    // finds script root(tag version) to load the right modules (with the same version as gmtools.js)
    headers.require.forEach(src => {
        if (/^http.+\/gmtools(\.min)?\.js$/.test(src)) root = src.substr(0, src.lastIndexOf('/'));
    });


    let
            dev = headers.dev === true,
            usecache = headers.usecache === true,
            paths = {
                root: root + '/',
                modules: root + '/modules/',
                images: root + '/img/',
                styles: root + '/css/'
            };

    root = paths.modules;

    const config = new Configuration();
    config.set({
        root, dev, paths,
        cache: {
            enabled: usecache,
            ttl: 30 * minute,
            prefix: 'GMCache:'
        }

    });

    const cache = new Cache();
    if(cache.supported){
        if (sessionStorage.getItem('newsession') !== null) {
            config.set('newsession', true);
            sessionStorage.removeItem('newsession');
        }
    }



    /**
     * requirejs Loader
     */
    let hit = false;

    if (cache.enabled) {
        let script = cache.loadItem(reqjs.key);
        if (typeof script === s && script.length > 0) {
            cache.exec(script);
            hit = true;
        }

    }
    if (hit === false) {

        (new Request(reqjs.src, false, false)) // async=false to get the variable available inside the script
                .success(response => {
                    let script = response.text;
                    if (typeof script === s && script.length > 0) {
                        script = transform(script, reqjs.src);
                        if (cache.enabled) cache.saveItem(reqjs.key, script);
                        cache.exec(script);
                    }

                })
                .error(response => {
                    throw new Error('Cannot fetch ' + reqjs.key + ' ' + response.error.message);
                });
    }

    if (typeof requirejs !== f) throw new Error('Cannot execute ' + reqjs.key);



    requirejs.config({
        baseUrl: root,
        waitSeconds: 30
    });


    // adding some deps
    config
            .addModule('Plyr', 'https://cdn.jsdelivr.net/npm/plyr@3.6.2/dist/plyr.min', {
                init(cfg){
                    loadcss(cfg.path + '.css');
                }
            })
            .addModule('Subtitle', 'https://cdn.jsdelivr.net/npm/subtitle@2.0.5/dist/subtitle.bundle.min')
            .addModule('Hls', 'https://cdn.jsdelivr.net/npm/hls.js@0.14.16/dist/hls.min', {
                options:{
                    enableWebVTT: false,
                    enableCEA708Captions: false
                }

            })
            .addModule('dashjs', 'https://cdn.dashjs.org/v3.1.3/dash.all.min', 'dashjs')
            .addModule('alertify', 'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min', {
                init(cfg){
                    let
                            path = cfg.path.substr(0, cfg.path.lastIndexOf('/')),
                            nodes = [],
                            l = doc.createElement('div'), isReady = false;

                    if (isPlainObject(cfg.config.options)) extend(cfg.module.defaults, cfg.config.options);

                    Object.defineProperty(cfg.module, 'ready', {
                        configurable: true, enumerable: false,
                        get(){
                            return new Promise(resolve => {
                                if (isReady === false) {
                                    l.addEventListener('ready', () => {
                                        resolve(cfg.module);
                                    }, {once: true});
                                } else resolve(cfg.module);

                            });
                        }, set(){}

                    });
                            
                    loadcss(path + '/css/alertify.min.css', path + '/css/themes/default.min.css', config.get('paths.styles') + 'alertify.css')
                            .then(() => {
                                isReady = true;
                                l.dispatchEvent(new Event('ready'));
                            });
                },
                options: {
                    theme: {
                        ok: 'ajs-ok gm-btn blue light',
                        cancel: 'ajs-cancel gm-btn red light',
                        input: ''
                    },
                    hooks: {
                        postinit(i){
                            let root = i.elements.root;
                            if(root.matches('.alertify:not(.pure)')){
                                root.setAttribute('class', 'pure ' + root.getAttribute('class'));
                                //set the confirm button last
                                root.querySelectorAll('.ajs-footer .ajs-primary .ajs-ok').forEach(btn => btn.parentElement.appendChild(btn));
                            }
                        }
                    }
                }
            })
            .addModule('iziToast', 'https://cdn.jsdelivr.net/npm/izitoast@1.4.0/dist/js/iziToast.min', {
                init(cfg){

                    let l = doc.createElement('div'), isReady = false;
                    Object.defineProperty(cfg.module, 'ready', {
                        configurable: true, enumerable: false,
                        get(){
                            return new Promise(resolve => {
                                if (isReady === false) {
                                    l.addEventListener('ready', () => {
                                        resolve(cfg.module);
                                    }, {once: true});
                                } else resolve(cfg.module);

                            });
                        }, set(){}
                    });

                    loadcss(cfg.path.replace('/js/', '/css/') + '.css')
                            .then(() => {
                                isReady = true;
                                l.dispatchEvent(new Event('ready'));
                            });
                }
            });


    //exporting this script contents
    const define = global.define;

    define('GM', gmexports);
    define('config', config);
    define('Request', function(){
        return Request;
    });
    define('cache', cache);

    Object.assign(gmtools, {
        requirejs,
        GM: gmexports,
        config,
        Request,
        cache
    });

    // adds config.init() callback globally
    Object.keys(requirejs.s.contexts).forEach(c => {
        let
                context = requirejs.s.contexts[c],
                orig = context.completeLoad;
        context.completeLoad = function(moduleName){
            let retval = orig(moduleName);
            if (context.config.config.hasOwnProperty(moduleName) && typeof context.config.config[moduleName].init === f) {
                context.config.config[moduleName].init( {
                    config: context.config.config[moduleName],
                    path: context.config.paths[moduleName] ? context.config.paths[moduleName] : (context.config.baseUrl + moduleName),
                    shim: context.config.shim[moduleName],
                    module: context.defined[moduleName]
                });
            }
            return retval;
        };
    });


    // overriding RequireJS default loader to enable cache and XHR
    if (cache.supported) {

        const load = requirejs.load;
        
        //Code fast load using localStorage Cache set @usecache in userscript header
        requirejs.load = function(context, moduleName, url){

            let  hit = false;
            url = new URL(url);
            if (cache.enabled) {
                url.searchParams.set('tt', +new Date()); // get a fresh version
                let contents = cache.loadItem(moduleName);
                if (typeof contents === s && contents.length > 0) {
                    cache.exec(contents);
                    context.completeLoad(moduleName);
                    hit = true;
                }
            }
            if (hit === false) {

                (new Request(url.href, false, false)) // also async=false to get the scripts loaded in the right order (loaded only once by session if cache is enabled)
                        .fetch()
                        .then(response => {
                            let script = response.text;
                            if (typeof script === s && script.length > 0) {
                                //shim export integrated into the script
                                if (isPlainObject(context.config.shim) && context.config.shim.hasOwnProperty(moduleName) && !defineRegExp.test(script)) {
                                    let shimConfig = context.config.shim[moduleName];
                                    if (shimConfig && shimConfig.exports) {
                                        script += "\ndefine('" + moduleName + "', function() { return " + shimConfig.exports + "; });\n";
                                        if (shimConfig.exports.indexOf('.') == -1) {
                                            script += '\nwindow.' + shimConfig.exports + ' = ' + shimConfig.exports + ';\n';
                                        }
                                    }
                                }

                                script = transform(script, url);
                                if (cache.enabled) cache.saveItem(moduleName, script);
                                cache.exec(script);
                                context.completeLoad(moduleName);
                                return;
                            }
                            throw new Error('Fetch Failed');

                        })
                        .catch(response => {
                            let message = ['Cannot fetch', moduleName, 'module using xhr, fallback to regular method.'];
                            if (response instanceof Error) message.push(response.message);
                            console.warn(...message);
                            // console.warn(response);
                            load(context, moduleName, url.href);
                        });
            }
        };
    }



}(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window));

