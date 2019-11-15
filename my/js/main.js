const mainbox = document.getElementById('mainbox');
const ctx= mainbox.getContext('2d');
const BGCOLOR = '#D3D3D3';//背景颜色
const WHITE = 'white';//空隙颜色
const ITEM_COLOR = '#3a3a3a';//方格颜色
const s = 20;//方格宽度
const b = 2;//间隙宽度
var itemMap = [[0,1,0,],[1,1,1]];//当前图形
var now = new Date();
var index = 0;
var initLeftIndex = 3;
var posx = initLeftIndex*(s+b);
function drawBg() {//绘制背景
    for (var i = 0; i < 20; i++) {
        for(var j = 0; j < 10; j++) {
            ctx.beginPath();
            ctx.fillStyle = BGCOLOR;
            ctx.fillRect(2*b+j*(s+b),2*b+i*(s+b),s,s);
            ctx.fillStyle=WHITE;
            ctx.fillRect(3*b+j*(s+b),3*b+i*(s+b),s-2*b,s-2*b);
            ctx.fillStyle=BGCOLOR;
            ctx.fillRect(4*b+j*(s+b),4*b+i*(s+b),s-4*b,s-4*b);
        }
    }
}
function drawItem(){
    clear();
    drawBg();
    var now1 = new Date();
    index = now1.getSeconds() - now.getSeconds();
    //var start = now.getSeconds();
    ctx.save();
    ctx.translate(posx,index*(b+s));
    for (var _i = 0; _i < itemMap.length; _i++) {
        for (var _j = 0; _j < itemMap[0].length; _j++) {
            let i = _i ;
            let j = _j ;
            if(itemMap[_i][_j] == 1) { 
                ctx.beginPath();
                ctx.fillStyle = ITEM_COLOR;
                ctx.fillRect(4+j*22,4+i*22,20,20);
                ctx.fillStyle=WHITE;
                ctx.fillRect(6+j*22,6+i*22,16,16);
                ctx.fillStyle=ITEM_COLOR;
                ctx.fillRect(8+j*22,8+i*22,12,12);
            }
        }
    }
    ctx.restore();
    window.requestAnimationFrame(drawItem);
}
function move(direct){
    if (initLeftIndex + direct >= (10 - itemMap[0].length)) {
        initLeftIndex = 10 - itemMap[0].length;
    } else if (initLeftIndex + direct <= 0) {
        initLeftIndex = 0;
    } else {
        initLeftIndex += direct;
    }
    posx = initLeftIndex*(s+b);
}    
/*
 * 按键处理部分
 *
 */
var KEY = {
    W: 87,
    UP: 38,
    D: 68,
    A: 65,
    LEFT: 37,
    RIGHT: 39
};

function press(event) {
    var code = event.keyCode;
    var dir = 0;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: dir++; break;
            
        case KEY.LEFT:
        case KEY.A: dir--; break;

        case KEY.UP:
        case KEY.W: itemMap = rotateItem(); break;
        default:dir = 0; break;
    }
    move(dir);
}
function release(event) {
    var code = event.keyCode;
    var dir = 0;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: dir++; break;
            
        case KEY.LEFT:
        case KEY.A: dir--; break;

        default:dir = 0; break;
    }
    move(dir);
}
/* 按键事件结束*/
/*
 * 图像旋转及生成
 *
 */
var TOTALITEM = [
    [[1,1,1,1]],
    [[0,1,0],[1,1,1]],
    [[1,1],[1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]]
]
    
function getRandomItem() {
    var index = Math.floor(Math.random() * 7);
    var angle = Math.floor(Math.random() * 3) * 90;
    itemMap = TOTALITEM[index];    
}

/*
 * params:0-0,3-90,6-180,9-270
 * 
 */
function rotateItem(an) {
    var result = [];
    var angle = an || 90;
    switch(angle) {
        case 0: result = itemMap; break;
        case 90: result = rotate90(itemMap); break; 
        case 180: result = rotate180(itemMap); break;
        case 270: result = rotate270(itemMap); break;
        default: break;
    }
    return result; 
}
var rotate90 = function(matrix) {
    var temp = [];
    var row = matrix.length;
    var col = matrix[0].length;
    var dst = row - 1;
    for(var i = 0; i < row; i++,dst--){
        for(var j = 0; j < col; j++){
            if(!temp[j]){
                temp[j] = [];
            }
            temp[j][dst] = matrix[i][j];
        }
    }
 
   return temp;
};
function rotate180(matrix) {
    var temp = [];
    var len = martix.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            let k = len - 1 - i;
            if (!temp[k]) {
                temp[k] = [];
            }
            temp[k][len-1-j] = matrix[i][j];
        }
    }
    return temp;
}
function rotate270(matrix) {
    var temp = [];
    let len = matrix.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            let k = len - 1 - i;
            if (!temp[j]) {
                temp[j] = [];
            }
            temp[j][k] = matrix[i][j];
        }
    }
    return temp;
}
function clear() {//清除画布
    var cw = mainbox.innerWidth || 226;
    var ch = mainbox.innerHeight || 446;
    ctx.clearRect(0,0,cw,ch);
}

(function(){
    getRandomItem();
    window.requestAnimationFrame(drawItem);
    
})();
