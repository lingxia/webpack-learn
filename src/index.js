import './index.less';
import image from './avatar.jpg'; // 把图片当做模块引入，返回的结果是一个新的图片地址
import { brotliDecompressSync } from 'zlib';
// import 'bootstrap';
require("@babel/polyfill"); // 引入 polyfill 帮助实现新的类方法等 
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './a';
import './b';

console.log('index.js');

// import $ from 'jquery'; // 把 jquery 以 $ 名字暴露给全局，挂载 window 上
// const moduleA = require("./a.js");

// moduleA.a();
let img = new Image();
img.src = image;

document.body.appendChild(img);

const arrowF = ()=>{
    console.log("sss")
}

"aaa".includes("a");
console.log($);
console.log(window.$);

console.log(DEV);
console.log(expression);
console.log(FLAG)

console.log(moment().endOf('day').fromNow());