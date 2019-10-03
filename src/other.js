import './a';
import './b';

console.log('other.js');


let btn = document.createElement("<button>hello</button");
// btn.innerText = "hello";

btn.addEventListener('click', function(){
    console.log("click");
});

document.body.appendChild(btn);