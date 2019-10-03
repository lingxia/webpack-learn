const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAsset = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
    devServer:{//开发服务器配置
        port: 3000,
        progress: true, //进度条
        contentBase: "./build", // 指定目录启动静态服务
        open: true,  //自动打开浏览器
        compress: true, // 压缩
    },
    mode:'development', //模式
    entry: './src/index.js', //入口
    output:{
        filename: 'bundle.js', //打包后的文件名
        path: path.resolve(__dirname, 'build') //输出的路径，绝对路径
    },
    optimization:{//配置webpack的优化项，覆盖默认配置
        minimize: true,//开启压缩
        minimizer:[
            new TerserJSPlugin({}), //用于压缩 js
            new OptimizeCssAsset({})//用于压缩 css
        ]
    },
    plugins:[//数组，放着所有的 plugin

        new HtmlWebpackPlugin({
            template: "./src/index.html", //模板
            filename: "index.html", //打包后的名称
            minify:{//html 压缩优化
                removeAttributeQuotes:true,  //去除引号
                collapseWhitespace:true //空行折叠
            },
            hash: true
        }),

        //将样式抽离成一个文件的插件
        new MinCssExtractPlugin({
            filename: 'main.css', //抽离后的文件的名称

        })
    ],
    module:{//模块，对指定的 test 匹配到的文件，使用对应的 loader 来处理，将其转化成模块的概念，打包进去
        //loader 希望功能单一，
        //单个loader用字符串，多个loader用数组，从右向左，从下到上
        //loader 可以写成对象形式，这样可以给loader多传一个参数 options
        rules:[//规则
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
            }
            ,
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
            }
            
        ]
    }
}