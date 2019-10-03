let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

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
    plugins:[//数组，放着所有的 plugin

        new HtmlWebpackPlugin({
            template: "./src/index.html", //模板
            filename: "index.html", //打包后的名称
            minify:{//html 压缩优化
                removeAttributeQuotes:true,  //去除引号
                collapseWhitespace:true //空行折叠
            },
            // hash: true
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
                    {
                        loader: 'style-loader',
                        options:{
                            injectType: 'styleTag',
                            insert:'top' //生成的css插入到html顶部
                        }
                    },
                    'css-loader'
                ]
            }
            ,
            {
                //style-loader，把 css 插入到 head 标签
                //css-loader，解析 css，主要解析 @import 语法
                //less-loader，把 less 转换成 css
                test:/\.less$/,  
                use:[
                    {
                        loader: 'style-loader',
                        options:{
                            injectType: 'styleTag',
                            insert:'top' //生成的css插入到html顶部
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            }
            
        ]
    }
}