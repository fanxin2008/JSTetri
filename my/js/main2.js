const mainbox = document.getElementById('mainbox');
const ctx= mainbox.getContext('2d');
const BGCOLOR = '#D3D3D3';//背景颜色
const WHITE = 'white';//空隙颜色
const ITEM_COLOR = '#3a3a3a';//方格颜色
const s = 20;//方格宽度
const b = 2;//间隙宽度
const ROW = 20;
const COLUMN = 10;
var timer = null;
var itemMap = [
    {x:0,y:3},
    {x:0,y:4},
    {x:0,y:5},
    {x:0,y:6}
];//当前图形
var bgBlock = new Array(ROW);
for (var i = 0; i < ROW; i++) {
    bgBlock[i] = new Array(COLUMN).fill(0);
 }

var level = 3;  
var now = new Date();
var index = 0;
var lastIndex = index;
var initLeftIndex = 3;
var posx = initLeftIndex*(s+b);
function drawBg() {//绘制背景
    for (var i = 0; i < ROW; i++) {
        for(var j = 0; j < COLUMN; j++) {
            if(bgBlock[i][j]!=1){
              ctx.beginPath();
              ctx.fillStyle = BGCOLOR;
              ctx.fillRect(2*b+j*(s+b),2*b+i*(s+b),s,s);
              ctx.fillStyle=WHITE;
              ctx.fillRect(3*b+j*(s+b),3*b+i*(s+b),s-2*b,s-2*b);
              ctx.fillStyle=BGCOLOR;
              ctx.fillRect(4*b+j*(s+b),4*b+i*(s+b),s-4*b,s-4*b);
            } else {
              ctx.beginPath();
              ctx.fillStyle = ITEM_COLOR;
              ctx.fillRect(2*b+j*(s+b),2*b+i*(s+b),s,s);
              ctx.fillStyle=WHITE;
              ctx.fillRect(3*b+j*(s+b),3*b+i*(s+b),s-2*b,s-2*b);
              ctx.fillStyle=ITEM_COLOR;
              ctx.fillRect(4*b+j*(s+b),4*b+i*(s+b),s-4*b,s-4*b);
            }
        }
    }
}
function drawItem(){
    clear();
    drawBg();
    ctx.save();
    for(var _i = 0; _i < itemMap.length; _i++){
        let i = itemMap[_i].x;
        let j = itemMap[_i].y
        ctx.beginPath();
        ctx.fillStyle = ITEM_COLOR;
        ctx.fillRect(4+j*22,4+i*22,20,20);
        ctx.fillStyle=WHITE;
        ctx.fillRect(6+j*22,6+i*22,16,16);
        ctx.fillStyle=ITEM_COLOR;
        ctx.fillRect(8+j*22,8+i*22,12,12);
    }
    ctx.restore();
    //window.requestAnimationFrame(drawItem);
}
function move(direct){
    // if (initLeftIndex + direct >= (10 - itemMap[0].length)) {
    //     initLeftIndex = 10 - itemMap[0].length;
    // } else if (initLeftIndex + direct <= 0) {
    //     initLeftIndex = 0;
    // } else {
    //     initLeftIndex += direct;
    // }
    // if(direct == 0) {
    //     index++;
    // }
    // drawItem();
} 
function moveDown(){
    if(checkBottomBorder()){
        for(var i = 0; i < itemMap.length; i ++){
            itemMap[i].x++;
        }
        drawItem();
    } 
    else {
        //console.log(itemMap)
        clearInterval(timer);
        updateBg();
        var line = getLine();
        updateScroe(line);
        drawBg();
        getRandomItem();
        if(checkItemLegal()){
            drawItem();
            timer = setInterval(moveDown,level * 100);
        } else {
            alert('game over');
        }    
    }
}
function checkItemLegal(){
    var item = itemMap;
    if(!item){
        return false;
    }
    for(var i = 0; i < item.length; i++) {
        if(!isCellLegal(item[i].x, item[i].y)){
            return false;
        }
    }
    return true;
}
function getLine(){
    var line = 0;
    for(var i = 0; i < ROW; i++) {
        var j = 0;
        for(j = 0; j < COLUMN; j++) {
            if(bgBlock[i][j] == 0)
            break;
        }
        if(j == COLUMN) {
            line ++;
            if(i != 0) {
                for(k = i - 1; k >= 0; k--) {
                    bgBlock[k+1] = bgBlock[k];
                }
            }
            bgBlock[0] = new Array(COLUMN).fill(0);
        }
    }
    return line;
}
function updateScroe(line) {
    console.log(line);
}

function updateBg(){
    for(var i = 0; i < itemMap.length; i++){
        bgBlock[itemMap[i].x][itemMap[i].y] = 1;
    }
}
function moveLeft(){
    for(var i = 0; i < itemMap.length; i++) {
        itemMap[i].y--;
    }
}
function moveRight(){
    for(var i = 0; i < itemMap.length; i++) {
        itemMap[i].y++;
    }
}
function checkRightBorder(){
    var item = itemMap;
    for(var i = 0; i < item.length; i++) {
        if(item[i].y + 1 == 20) {
            return false;
        }
        if(!isCellLegal(item[i].x, item[i].y+1)){
            return false;
        }
    }
    return true;
}
function checkLeftBorder(){
    var item = itemMap;
    for(var i = 0; i < item.length; i++) {
        if(item[i].y == 0) {
            return false;
        }
        if(!isCellLegal(item[i].x, item[i].y-1)){
            return false;
        }
    }
    return true;
}
function checkBottomBorder() {
    var item = itemMap;
    for(var i = 0; i < item.length; i++){
        if(item[i].x+1 == ROW) {
            return false;
        }
        if(!isCellLegal(item[i].x+1, item[i].y)){
            return false;
        }
    }
    return true;
}
function isCellLegal(x,y) {
    if(x > 19 || x < 0 || y > 9 || y < 0){
        return false;
    }
    if(bgBlock[x][y] == 1) {
        return false;
    }
    return true;
    //return !((x > 19 || x < 0 || y < 0 || y > 9) && bgBlock[x][y] == 1);
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
        case KEY.W: rotateItem(); break;
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
    [{x:0, y:4},{x:1, y:4},{x:0, y:5},{x:1, y:5}],
    [{x:0, y:3},{x:0, y:4},{x:1, y:4},{x:1, y:5}],
    [{x:0, y:4},{x:1, y:4},{x:1, y:5},{x:2, y:5}],
    [{x:0, y:4},{x:1, y:4},{x:2, y:4},{x:2, y:5}],
    [{x:0, y:5},{x:1, y:5},{x:2, y:5},{x:2, y:4}],
    [{x:0, y:3},{x:0, y:4},{x:0, y:5},{x:0, y:6}],
    [{x:0, y:4},{x:1, y:3},{x:1, y:4},{x:1, y:5}]   
]
    
function getRandomItem() {
    var _index = Math.floor(Math.random() * 7);
    var angle = Math.floor(Math.random() * 3) * 90;
    _index = 5;
    for(var i = 0; i < TOTALITEM[_index].length; i++){
        itemMap[i].x = TOTALITEM[_index][i].x;
        itemMap[i].y = TOTALITEM[_index][i].y;
    }
    //rotateItem(angle);
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
var rotate90 = function() {
    var temp = itemMap;
    var minx = Math.min(itemMap[0].x, itemMap[1].x, itemMap[2].x, itemMap[3].x);
    var maxx = Math.max(itemMap[0].x, itemMap[1].x, itemMap[2].x, itemMap[3].x);
    var miny = Math.min(itemMap[0].y, itemMap[1].y, itemMap[2].y, itemMap[3].y);
    var maxy = Math.max(itemMap[0].y, itemMap[1].y, itemMap[2].y, itemMap[3].y);
    var cx = Math.floor(1/2*(minx + maxx));
    var cy = Math.floor(1/2*(miny + maxy));
    //var cx = minx;
    //var cy = miny;
    var tempx,tempy;
    for(var i = 0; i < itemMap.length; i++){
        tempx = itemMap[i].x;
        tempy = itemMap[i].y;
        itemMap[i].x = cx + tempy - cy;
        itemMap[i].y = cx - tempx + cy; 
    } 
    console.log(itemMap);
};
function rotate180(matrix) {
    var temp = [];
    var len = matrix.length;
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
    drawBg();
    getRandomItem();
    drawItem();
    //window.requestAnimationFrame(drawItem);
    timer = setInterval(function(){
        moveDown();
    },level*100);
    
})();
