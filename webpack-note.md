## 安装
- 安装本地的 webpack
- webpack webpack-cli -save-dev

## webpack 可以进行 0 配置
- 打包工具 -> 输出后的结果(js 模块)
- 打包 -> 支持我们的 js 模块化

## 手动配置
- 默认配置文件名字 webpack.config.js
- 两种模式(mode 配置项)： production/development
- 开发服务器 webpack-dev-server 基于 express，配置项:

```javascript
    devServer:{//开发服务器配置
        port: 3000,
        progress: true, //进度条
        contentBase: "./build", // 指定目录启动静态服务
        open: true,  //自动打开浏览器
        compress: true, // 压缩

        // 处理跨域问题方式一
        proxy:{//配置代理
            '/api': {
                target: "http://localhost:3000",
                pathRewrite: {
                    // 访问 localhost:8080/api -> 代理到 localhost:3000
                    // 8080 是 webpack dev 的端口，3000 是服务端端口
                    "/api": "" 
                }
            }
        },

        // 处理跨域问题方式二
        // 前端只想mock数据，不做代理转发，访问接口时先走 before 钩子里找，找到了即返回，不到服务端
        before(app){//app 是 webpack 的 express devServer
            app.get("user", (req, res)=>{
                res.json("hello");
            })
        },

        // 处理跨域问题方式三：
        // 在 node 起的服务器端中引入 webpack-dev-middleware 插件作为中间件
        // 读取 webpack 配置后交给 webpack 生成 compiler 对象，然后交给 webpack-dev-middleware
        // 这样 webpack dev 模式下和 node 服务器可以在一个端口下启动

    },


    watch: true,//实时监控，有文件变化后自动触发 build
    watchOptions:{//watch 相关的参数
        poll: 1000, //每秒检测 1000 次
        aggregateTimeout: 500, // 防抖，500 毫秒内输入的内容仅 build 一次
        ignored: /node_modules/ //不需要监控的文件/文件夹
    },

    // 不同的模式可以使用不同的配置文件
    // 比如，相同的信息可以放在 webpack.base.js
    // 开发环境可以配置在 webpack.dev.js，生产环境配置在 webpack.prod.js
    // 通过 webpack-merge 插件来与基本信息合并
    mode:'development', //模式

    //1,source-map，源码映射 选项值会单独生成一个 sourcemap 文件（.map)，映射源码，找到行列，大而全
    //2,eval-source-map，不会产生单独的文件，映射源码，找到行列
    //3,cheap-module-source-map，产生单独的映射文件，但是不会产生列
    //4,cheap-module-eval-source-map，不会产生单独的文件，且不会产生列
    devtool:'source-map',

    // entry: './src/index.js', //单入口
    entry:{//多入口
        home: './src/index.js',
        other:'./src/other.js'
    },

    output:{
        //filename: 'bundle.js', //打包后的文件名
        filename: '[name].js', //多输出
        path: path.resolve(__dirname, 'build'), //输出的路径，绝对路径
        // publicPath: "xxxxx" //公共资源路径
    },

    //resolve 配置项
    resolve:{//解析 第三方包 common
        modules: [path.resolve('node_modules')],
        alias:{//配置别名
            bootstrap: 'bootstrap/dist/css/bootstrap.css'
        },

        //配置加载模块时的主入口字段，一般模块默认主入口是 package.json 中的 main 字段
        //这里可以修改
        mainFields: ['style', "main"],

        //配置加载模块时的主入口文件名称，一般模块默认主入口文件是 index.js
        //这里可以修改
        mainFiles:[],

        // import 的时候，不写后缀时，默认解析后缀的顺序
        extensions: ['js', 'css', 'vue']
    },
```

- 插件(plugins 配置项):

```javascript
//如果是多入口，需要生成多个 html，则 new 多个 HtmlWebpackPlugin 插件
new HtmlWebpackPlugin({//配置 html 模板以及生成的 html 名称，引入 html 
        template: "./src/index.html", //模板
        filename: "index.html", //打包后的名称
        minify:{//html 压缩优化
            removeAttributeQuotes:true,  //去除引号
            collapseWhitespace:true //空行折叠
        },
        hash: true,
        chunks: ['other']//只引入 other.js
    })
```
```javascript
new MinCssExtractPlugin({//将样式抽离成一个文件的插件
    filename: '/css/main.css', //抽离后的文件的路径/名称
})

//样式被抽离到同一的文件中，那么就不需要用 style-loader 把样式添加到 style 标签中
//而是使用 MinCssExtractPlugin.loader 代替 style-loader, 在 html 中创建 link 标签，引入生成的 css 文件
```

```javascript
new webpack.ProvidePlugin({// 在每个模块中都注入 $, 即 jQuery，代码中就可以不用 import 了，但并没有挂在 window上
    $: 'jquery'
})
```

- 模块(modules 配置项):

```javascript
module:{//模块，对指定的 test 匹配到的文件，使用对应的 loader 来处理，将其转化成模块的概念，打包进去
        //loader 希望功能单一，
        //单个loader用字符串，多个loader用数组，从右向左，从下到上
        //loader 可以写成对象形式，这样可以给loader多传一个参数 options
        //loader 的几种类型： pre: 前置loader; normal: 普通loader; post: 后置loader; 内联 loader
        rules:[//规则
            {
                //在 webpack 配置文件中使用 expose-loader，将 jQuery 暴露在全局
                test: require.resolve('jquery'),
                // // 排除和包含
                // exclude:/node_modules/,
                // include: path.resolve(src),
                use: 'expose-loader?$'
            },
            {
                test:/\.js$/,
                use:[
                    {
                        loader: "babel-loader",
                        options:{//用 babel-loader 把 es6 转换成 es5
                            presets:[// 众多 babel 插件的集合
                                '@babel/preset-env'
                            ],
                            plugins:[//可以配置其他 babel 插件，在 babel 官网中查找
                                '@babel/plugin-transform-runtime',//注入转换成es5后某些新语法依赖的运行时，如 generator，promise，所以生成环境依赖 @babel/runtime
                                '@babel/plugin-syntax-dynamic-import' //动态导入语法插件，使得 js 中支持 import('xxx.js') 这种语法，这种语法其实使用的就是 jsonp 来加载文件，实现懒加载功能
                            ]
                        }
                    },
                    {// eslint 的 loader, 配合 .eslintrc.json 使用，需安装 eslint
                        loader: "eslint-loader"
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                //style-loader，把 css 插入到 head 标签
                //css-loader，解析 css，主要解析 @import 语法
                //less-loader，把 less 转换成 css
                //其他的还有，sass, stylus 等，都一样的

                test:/\.less$/,  
                use:[
                    {
                        loader: 'style-loader',
                        options:{
                            insert:'top' //生成的css插入到html顶部
                        }
                    },
                    //MinCssExtractPlugin.loader MinCssExtractPlugin抽离样式文件后使用它创建link标签，而不是使用 style-loader
                    'css-loader',
                    'postcss-loader', //加上浏览器厂商标示前缀，需要添加 postcss.config.js，指定需要用到 autoprefixer 插件，还需要再 package.json 中指定 "browserslist": ["> 1%", "last 2 versions"]字段，或使用  .browserslistrc 文件指定
                    'less-loader'
                ]
            }
            
        ]
    }

    //内联loader的使用，在代码里
    import $ from 'expose-loader?$!jquery'; // 把 jquery 以 $ 名字暴露给全局，挂载 window 上
```

- webpack4.x 优化(optimization 配置项)

```javascript
optimization:{//配置webpack的优化项，覆盖默认配置；
        //这里的优化项可以是webpack自带的，也可以是使用插件，如果是插件，也可以放在 plugin 中
        minimize: true,//开启压缩
        minimizer:[
            new TerserJSPlugin({}), //terser-webpack-plugin, 用于压缩 js,类似于 uglifyjs-webpack-plugin，但支持 es6 语法，不需要为他配置 babel 了,配置项参考官方文档
            new OptimizeCssAsset({})//optimize-css-assets-webpack-plugin, 用于压缩 css，配置项参考官方文档
        ]
    
        splitChunks:{//分割代码块
            cacheGroups:{//缓存组
                common:{//公共模块，抽离多入口中公共的部分
                    chunks:'initial', //从入口
                    minSize:0,  // 大于 0 个字节
                    minChunks:2 // 引用两次或两次以上
                },

                vendor: {//抽离第三方模块
                    priority: 1, //权重，优先抽离第三方模块，第三方模块不抽离在 common 中
                    test: /node_modules/,
                    chunks:'initial', //从入口
                    minSize:0,  // 大于 0 个字节
                    minChunks: 2 // 引用两次或两次以上
                }
            }
        }
    }
```

- externals 配置项

```javascript
    externals:{
        jquery: "jQuery"
    }

// 模块通过外部引入了，比如，在html里使用cdn引入了，所以在 js 中 import 的时候，打包可以忽略掉，不打包进去
```

- webpack 中打包图片

1. 在 js 中创建图片来引入   //file-loader
2. 在 css 引入，如 background  //css-loader 可以自己动转换图片地址
3. 在 html 中写，如 src   //html-withimg-loader

```javascript
{
    //file-loader 针对 js 中引入的图片，默认会在内部生成一张图片到 build 的目录下，
    //把生成图片的名字返回回来，类似 25fa84a32da9f192e22c7498a39185a6.jpg
    test:/\.(png|jpg|gif)$/,  
    // use:'file-loader'
    use:{
        //常使用 url-loader 替代 file-loader
        loader: 'url-loader',
        options: {
            limit: 200*1024, //图片小于 200k 则转成 base64，否则功能和file-loader一致
            outputPath: "/img/", //产生的图片保存到 build/img/ 目录下
            p// publicPath: "xxxx" //图片资源路径，在生成的 html 和 css 中引入图片的地方加上路径
        }
    }
}

{
    //html-withimg-loader 针对 html 中引入的图片，默认会在内部生成一张图片到 build 的目录下，
    //把生成图片的名字返回回来，类似 25fa84a32da9f192e22c7498a39185a6.jpg
    test:/\.html$/,  
    use:'html-withimg-loader'
}
```

- 常用小插件

1. cleanWebpackPlugin
2. copyWebpackPlugin
3. bannerPlugin  内置
4. DefinePlugin 内置

```javascript
// build 之前清除上次 build 的结果
new CleanWebpackPlugin(),

// 手动将一些不在打包范围内的文件从 from 处拷贝到 build 下的 to 路径下
new CopyWebpackPlugin([
    {
        from: "./doc",
        to: "./doc"
    }
]),

// 版权声明插件，在生成的 js 最顶部插入自定的版权声明说明
new webpack.BannerPlugin("@copy right by zhaojian")

// 定义一些全局变量/环境变量，可以在代码中引用
new webpack.DefinePlugin({
    DEV: JSON.stringify("development"), //development
    FLAG: 'true',  // true
    expression: '1+1'  //2
})
```

- 常用优化

1. noParse

```javascript
module:{
    noParse: /jquery/, //不去解析 jquery 中的依赖关系，一般知道该模块没有其他依赖，则可以不用去解析
}
```

2. IgnorePlugin

```javascript
// 一个使用场景： 在 js 中使用 moment 模块的时候，源码中会默认会引入全部的语言包，
// 但很多语言包没有用，这样就会导致打包的结果很大，因此，可以使用 IgnorePlugin 来忽略语言包的引用
// 以此来减小打包后代码的体积
// 然后在 js 代码中指定需要的语言包
// import moment from 'moment';
// import 'moment/locale/zh-cn';
new webpack.IgnorePlugin(/\.\/locale/,/moment/)
```

3. happypack 实现多线程打包

```javascript
//使用 Happypack 做多线程打包 js，配合 happypack/loader 使用
new Happypack({
    id:"js", 
    use:[{
            loader: "babel-loader",
            options:{//用 babel-loader 把 es6 转换成 es5
                presets:[// 众多 babel 插件的集合
                    '@babel/preset-env'
                ],
                plugins:[//可以配置其他插件
                    '@babel/plugin-transform-runtime'//注入转换成es5后某些新语法依赖的运行时，如 generator，promise，所以生成环境依赖 @babel/runtime
                ]
            }
    }],
}),
//使用 Happypack 做多线程打包 css，配合 happypack/loader 使用
new Happypack({
    id:"css", 
    use:[
        MinCssExtractPlugin.loader, //css 样式不在放在 style 标签里，而是创建 link 标签，引入抽离的外部样式文件
        'css-loader',
        'postcss-loader'//加上浏览器厂商标示前缀，需要添加 postcss.config.js，需要再 package.json 中指定 "browserslist": ["> 1%", "last 2 versions"]字段，或使用  .browserslistrc 文件指定
    ]
})


// 配合 happypack 使用多线程打包，这里不需要使用 babel-loader, 可以使用 happypack/loader
// 同样 其他的格式的文件可以做类似的优化，如下面的 css
{
    test:/\.js$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    use: 'Happypack/loader?id=js'

},
{
    test:/\.css$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    use: 'Happypack/loader?id=css'

}
```

- webapck 自带的一些优化

1. tree-shaking

在打生产环境包的时候，import 方式会自动去除没有用到的代码，require 语法不支持

2. scope hosting 作用域提升

在 webpack 中会自动省略一些可以简化的代码，如，

```javascript
let a = 1;
let b = 2;
let c = a + b;
console.log(c);

//会把 webpack 编译成
console.log(3);

```