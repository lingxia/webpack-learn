const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAsset = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devServer:{//开发服务器配置
        port: 3000,
        progress: true, //进度条
        contentBase: "./build", // 指定目录启动静态服务
        open: true,  //自动打开浏览器
        compress: true, // 压缩

        // 处理跨域问题方式一
        // proxy:{//配置代理
        //     '/api': {
        //         target: "http://localhost:3000",
        //         pathRewrite: {
        //             // 访问 localhost:8080/api -> 代理到 localhost:3000
        //             // 8080 是 webpack dev 的端口，3000 是服务端端口
        //             "/api": "" 
        //         }
        //     }
        // },

        // 处理跨域问题方式二
        // 前端只想mock数据，不做代理转发，访问接口时先走 before 钩子里找，找到了即返回，不到服务端
        // before(app){//app 是 webpack 的 express devServer
        //     app.get("user", (req, res)=>{
        //         res.json("hello");
        //     })
        // },

        // 处理跨域问题方式三：
        // 在 node 起的服务器端中引入 webpack-dev-middleware 插件作为中间件
        // 读取 webpack 配置后交给 webpack 生成 compiler 对象，然后交给 webpack-dev-middleware
        // 这样 webpack dev 模式下和 node 服务器可以在一个端口下启动


    },

    // 不同的模式可以使用不同的配置文件
    // 比如，相同的信息可以放在 webpack.base.js
    // 开发环境可以配置在 webpack.dev.js，生产环境配置在 webpack.prod.js
    // 通过 webpack-merge 插件来与基本信息合并
    mode:'development', //模式
    // entry: './src/index.js', //单入口
    entry:{//多入口
        home: './src/index.js',
        other:'./src/other.js'
    },
    // watch: true,//实时监控，有文件变化后自动触发 build
    // watchOptions:{//watch 相关的参数
    //     poll: 1000, //每秒检测 1000 次
    //     aggregateTimeout: 500, // 防抖，500 毫秒内输入的内容仅 build 一次
    //     ignored: /node_modules/ //不需要监控的文件/文件夹
    // },

    //1,source-map，源码映射 选项值会单独生成一个 sourcemap 文件（.map)，映射源码，找到行列，大而全
    //2,eval-source-map，不会产生单独的文件，映射源码，找到行列
    //3,cheap-module-source-map，产生单独的映射文件，但是不会产生列
    //4,cheap-module-eval-source-map，不会产生单独的文件，且不会产生列
    // devtool:'source-map',
    output:{
        //filename: 'bundle.js', //打包后的文件名
        filename: '[name].js', //多输出
        path: path.resolve(__dirname, 'build'), //输出的路径，绝对路径
        // publicPath: "xxxxx" //公共资源路径
    },
    // externals:{
    //     jquery: "jQuery"
    // },

    resolve:{//解析 第三方包 common
        // modules: [path.resolve('node_modules')],
        // alias:{//配置别名
        //     bootstrap: 'bootstrap/dist/css/bootstrap.css'
        // },

        // //配置加载模块时的主入口字段，一般模块默认主入口是 package.json 中的 main 字段
        // //这里可以修改
        // mainFields: ['style', "main"],

        // //配置加载模块时的主入口文件名称，一般模块默认主入口文件是 index.js
        // //这里可以修改
        // mainFiles:[],

        // // import 的时候，不写后缀时，默认解析后缀的顺序
        // extensions: ['js', 'css', 'vue']
    },
    optimization:{//配置webpack的优化项，覆盖默认配置
        // minimize: true,//开启压缩
        // minimizer:[
        //     new TerserJSPlugin({}), //用于压缩 js
        //     new OptimizeCssAsset({})//用于压缩 css
        // ]
    },
    plugins:[//数组，放着所有的 plugin

        new HtmlWebpackPlugin({
            template: "./src/index.html", //模板
            filename: "index.html", //打包后的名称
            // minify:{//html 压缩优化
            //     removeAttributeQuotes:true,  //去除引号
            //     collapseWhitespace:true //空行折叠
            // },
            // hash: true
            chunks:['home'] //只引入 home.js
        }),

        /**
         * 多入口，生成多个 html
         * */
        new HtmlWebpackPlugin({
            template: "./src/index.html", //模板
            filename: "other.html", //打包后的名称
            // minify:{//html 压缩优化
            //     removeAttributeQuotes:true,  //去除引号
            //     collapseWhitespace:true //空行折叠
            // },
            // hash: true
            chunks: ['home', 'other']//引入 home.js 和 other.js
        }),

        //将样式抽离成一个文件的插件
        new MinCssExtractPlugin({
            filename: 'css/main.css', //抽离后的文件的路径/名称
        }),

        new webpack.ProvidePlugin({// 在每个模块中都注入 $, 即 jQuery，代码中就可以不用 import 了
            $: 'jquery'
        }),

        // new OptimizeCssAsset({}),

        // new TerserJSPlugin({})

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
        new webpack.BannerPlugin("@copy right by zhaojian"),

        new webpack.DefinePlugin({
            // 定义一些全局变量/环境变量，可以在代码中引用
            DEV: JSON.stringify("development"), //development
            FLAG: 'true',  // true
            expression: '1+1'  //2
        })
    ],
    module:{//模块，对指定的 test 匹配到的文件，使用对应的 loader 来处理，将其转化成模块的概念，打包进去

        noParse: /jquery/, //不去解析 jquery 中的依赖关系，一般知道该模块没有其他依赖，则可以不用去解析

        //loader 希望功能单一，
        //单个loader用字符串，多个loader用数组，从右向左，从下到上
        //loader 可以写成对象形式，这样可以给loader多传一个参数 options
        //loader 的几种类型： pre: 前置loader; normal: 普通loader; post: 后置loader; 内联 loader
        rules:[//规则
            // {
            //     test: require.resolve('jquery'),
            //     use: 'expose-loader?$'
            // },
            {
                test:/\.js$/,
                use:[
                    {
                        loader: "babel-loader",
                        options:{//用 babel-loader 把 es6 转换成 es5
                            presets:[// 众多 babel 插件的集合
                                '@babel/preset-env'
                            ],
                            plugins:[//可以配置其他插件
                                '@babel/plugin-transform-runtime'//注入转换成es5后某些新语法依赖的运行时，如 generator，promise，所以生成环境依赖 @babel/runtime
                            ]
                        },
                    },
                    // {
                    //     loader: "eslint-loader"
                    // }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                //style-loader，把 css 插入到 head 标签
                //css-loader，解析 css，主要解析 @import 语法
                test:/\.css$/,  
                use:[
                    
                    // {
                    //     loader: 'style-loader',
                    //     options:{
                    //         injectType: 'styleTag',
                    //         insert:'top' //生成的css插入到html顶部
                    //     }
                    // },
                    MinCssExtractPlugin.loader, //css 样式不在放在 style 标签里，而是创建 link 标签，引入抽离的外部样式文件
                    'css-loader',
                    'postcss-loader'//加上浏览器厂商标示前缀，需要添加 postcss.config.js，需要再 package.json 中指定 "browserslist": ["> 1%", "last 2 versions"]字段，或使用  .browserslistrc 文件指定
                ]
            },
            {
                //style-loader，把 css 插入到 head 标签
                //css-loader，解析 css，主要解析 @import 语法
                //less-loader，把 less 转换成 css
                test:/\.less$/,  
                use:[
                    MinCssExtractPlugin.loader, //css 样式不在放在 style 标签里，而是创建 link 标签，引入抽离的外部样式文件
                    'css-loader',
                    'postcss-loader',//加上浏览器厂商标示前缀，需要添加 postcss.config.js，需要再 package.json 中指定 "browserslist": ["> 1%", "last 2 versions"]字段，或使用  .browserslistrc 文件指定
                    'less-loader'
                ]
            },
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
                        outputPath: "/img/", //图片保存到 build/img/ 目录下
                        // publicPath: "xxxx" //图片资源路径，在生成的 html 和 css 中引入图片的地方加上路径
                    }
                }
            },
            {
                //html-withimg-loader 针对 html 中引入的图片，默认会在内部生成一张图片到 build 的目录下，
                //把生成图片的名字返回回来，类似 25fa84a32da9f192e22c7498a39185a6.jpg
                test:/\.html$/,  
                use:'html-withimg-loader'
            }
        ]
    }
}