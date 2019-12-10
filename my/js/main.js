const mainbox = document.getElementById('mainbox');
const ctx = mainbox.getContext('2d');
const prebox = document.getElementById('preview');
const prectx = prebox.getContext('2d');
const BGCOLOR = '#D3D3D3';//背景颜色
const WHITE = 'white';//空隙颜色
const ITEM_COLOR = '#3a3a3a';//方格颜色
const s = 20;//方格宽度
const b = 2;//间隙宽度
const ROW = 20;
const COLUMN = 10;
var timer = null;
var preItem = [];
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
var level = 10;  
var score = 0;
function drawBg() {//绘制背景
    for (var i = 0; i < ROW; i++) {
        for (var j = 0; j < COLUMN; j++) {
            if (bgBlock[i][j] != 1) {
              ctx.beginPath();
              ctx.fillStyle = BGCOLOR;
              ctx.fillRect(2*b+j*(s+b), 2*b+i*(s+b), s, s);
              ctx.fillStyle = WHITE;
              ctx.fillRect(3*b+j*(s+b), 3*b+i*(s+b), s-2*b, s-2*b);
              ctx.fillStyle = BGCOLOR;
              ctx.fillRect(4*b+j*(s+b), 4*b+i*(s+b), s-4*b, s-4*b);
            } else {
              ctx.beginPath();
              ctx.fillStyle = ITEM_COLOR;
              ctx.fillRect(2*b+j*(s+b), 2*b+i*(s+b), s, s);
              ctx.fillStyle = WHITE;
              ctx.fillRect(3*b+j*(s+b), 3*b+i*(s+b), s-2*b, s-2*b);
              ctx.fillStyle = ITEM_COLOR;
              ctx.fillRect(4*b+j*(s+b), 4*b+i*(s+b), s-4*b, s-4*b);
            }
        }
    }
}
function drawItem() {
    clear();
    drawBg();
    ctx.save();
    for (var _i = 0; _i < itemMap.length; _i++) {
        let i = itemMap[_i].x;
        let j = itemMap[_i].y
        ctx.beginPath();
        ctx.fillStyle = ITEM_COLOR;
        ctx.fillRect(4+j*22, 4+i*22, 20, 20);
        ctx.fillStyle = WHITE;
        ctx.fillRect(6+j*22, 6+i*22, 16, 16);
        ctx.fillStyle = ITEM_COLOR;
        ctx.fillRect(8+j*22, 8+i*22, 12, 12);
    }
    ctx.restore();
}
function drawPre() {
    var cw = prebox.innerWidth || 100;
    var ch = prebox.innerHeight || 100;
    prectx.clearRect(0, 0, cw, ch);
    for (var _i = 0; _i < preItem.length; _i++) {
        let i = preItem[_i].x;
        let j = preItem[_i].y - 3;
        prectx.beginPath();
        prectx.fillStyle = ITEM_COLOR;
        prectx.fillRect(4+j*22, 4+i*22, 20, 20);
        prectx.fillStyle=WHITE;
        prectx.fillRect(6+j*22, 6+i*22, 16, 16);
        prectx.fillStyle = ITEM_COLOR;
        prectx.fillRect(8+j*22, 8+i*22, 12, 12);
    }
    prectx.restore();
}
function moveDown() {
    if (checkBottomBorder()) {
        for (var i = 0; i < itemMap.length; i++) {
            itemMap[i].x++;
        }
        drawItem();
    } else {
        clearInterval(timer);
        updateBg();
        var line = getLine();
        updateScroe(line);
        drawBg();
        copyItem(preItem, itemMap);
        preItem = getRandomItem();
        drawPre();
        if (checkItemLegal()) {
            drawItem();
            timer = setInterval(moveDown, level * 100);
        } else {
            alert('game over');
        }    
    }
}
function copyItem(r, t) {
    for (var i = 0; i < r.length; i++) {
        t[i].x = r[i].x;
        t[i].y = r[i].y;
    }
}
function checkItemLegal(){
    var item = itemMap;
    if (!item) {
        return false;
    }
    for (var i = 0; i < item.length; i++) {
        if (!isCellLegal(item[i].x, item[i].y)) {
            return false;
        }
    }
    return true;
}
function getLine() {
    var line = 0;
    for (var i = 0; i < ROW; i++) {
        var j = 0;
        for (j = 0; j < COLUMN; j++) {
            if(bgBlock[i][j] == 0)
            break;
        }
        if (j == COLUMN) {
            line++;
            if (i != 0) {
                for (k = i - 1; k >= 0; k--) {
                    bgBlock[k+1] = bgBlock[k];
                }
            }
            bgBlock[0] = new Array(COLUMN).fill(0);
        }
    }
    return line;
}
function updateScroe(line) {
    if (line > 2 && line < 5) {
        score = score + line * 20;
    } else if (line >= 5 && line < 8){
        score = score + line * 30;
    } else if (line >=8) {
        score = score + line * 40;
    } else {
        score = score + line * 10;
    }
    level = (10 - parseInt(score/100)) <= 0 ? 1 : (10 - parseInt(score/100));
    document.getElementsByClassName('level')[0].innerHTML = '<h4>level: ' + (10 - level + 1) +'</h4>';
    document.getElementsByClassName('score')[0].innerHTML = '<h4>score: ' + score +'</h4>';
}
function goBottom() {
    clearInterval(timer);
    timer = setInterval(moveDown, 50);
} 
function updateBg() {
    for (var i = 0; i < itemMap.length; i++) {
        bgBlock[itemMap[i].x][itemMap[i].y] = 1;
    }
}
function moveLeft() {
    if (checkLeftBorder()) {
        for (var i = 0; i < itemMap.length; i++) {
            itemMap[i].y--;
        }
        drawItem();
    }  
}
function moveRight() {
    if (checkRightBorder()) {
        for (var i = 0; i < itemMap.length; i++) {
            itemMap[i].y++;
        }
        drawItem();
    }
    
}
function checkRightBorder() {
    var item = itemMap;
    for (var i = 0; i < item.length; i++) {
        if (item[i].y + 1 == ROW) {
            return false;
        }
        if (!isCellLegal(item[i].x, item[i].y+1)) {
            return false;
        }
    }
    return true;
}
function checkLeftBorder() {
    var item = itemMap;
    for (var i = 0; i < item.length; i++) {
        if (item[i].y == 0) {
            return false;
        }
        if (!isCellLegal(item[i].x, item[i].y-1)) {
            return false;
        }
    }
    return true;
}
function checkBottomBorder() {
    var item = itemMap;
    for (var i = 0; i < item.length; i++) {
        if (item[i].x + 1 == ROW) {
            return false;
        }
        if (!isCellLegal(item[i].x + 1, item[i].y)) {
            return false;
        }
    }
    return true;
}
function isCellLegal(x, y) {
    if (x > ROW - 1 || x < 0 || y > COLUMN - 1 || y < 0) {
        return false;
    }
    if (bgBlock[x][y] == 1) {
        return false;
    }
    return true;
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
    RIGHT: 39,
    BS:32
};

function press(event) {
    var code = event.keyCode;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: moveRight(); break;
            
        case KEY.LEFT:
        case KEY.A: moveLeft(); break;

        case KEY.UP:
        case KEY.W: rotateItem(); break;

        case KEY.BS: goBottom(); break;

        default:moveDown(); break;
    }
}
function release(event) {
    var code = event.keyCode;
    switch(code) {
        case KEY.RIGHT:
        case KEY.D: moveRight(); break;
            
        case KEY.LEFT:
        case KEY.A: moveLeft(); break;

        case KEY.UP:
        case KEY.W: rotateItem(); break;

        case KEY.BS: goBottom(); break;

        default:moveDown(); break;
    }
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
    var _index = Math.floor(Math.random() * TOTALITEM.length);
    //var angle = Math.floor(Math.random() * 3) * 90;
    var temp = new Array(TOTALITEM[_index].length);
    for (var i = 0; i < TOTALITEM[_index].length; i++) {
        temp[i] = Object.assign({}, TOTALITEM[_index][i]);
    }
    return temp;
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
        case 90: result = rotate90(); break; 
        // case 180: result = rotate180(); break;
        // case 270: result = rotate270(); break;
        default: break;
    }
    if (result.length > 0) {
        itemMap = result;
        drawItem();
    }
    return result; 
}
function rotate90() {
    var temp = new Array(itemMap.length);
    for (var i = 0; i < itemMap.length; i++) {
        temp[i] = new Array(itemMap[i].length).fill(0);
    }
    var cx = Math.round((itemMap[0].x + itemMap[1].x + itemMap[2].x + itemMap[3].x)/4);;
    var cy = Math.round((itemMap[0].y + itemMap[1].y + itemMap[2].y + itemMap[3].y)/4);;
    var tempx, tempy;
    for (var i = 0; i < itemMap.length; i++) {
        tempx = itemMap[i].x;
        tempy = itemMap[i].y;
        temp[i].x = cx + cy - tempy ;
        temp[i].y = cy - cx + tempx ; 
    } 
    for (var i = 0; i < itemMap.length; i++) {
        if (!isCellLegal(temp[i].x, temp[i].y)) {
            return [];
        }
    }
    return temp;
};
// function rotate180() {
//     var temp = new Array(itemMap.length);
//     for (var i = 0; i < itemMap.length; i++) {
//         temp[i] = new Array(itemMap[i].length).fill(0);
//     }
//     var cx = Math.round((itemMap[0].x + itemMap[1].x + itemMap[2].x + itemMap[3].x)/4);;
//     var cy = Math.round((itemMap[0].y + itemMap[1].y + itemMap[2].y + itemMap[3].y)/4);;
//     var tempx,tempy;
//     for (var i = 0; i < itemMap.length; i++) {
//         tempx = itemMap[i].x;
//         tempy = itemMap[i].y;
//         temp[i].x = 2*cx - tempx ;
//         temp[i].y = 2*cy - tempy ; 
//     } 
//     for (var i = 0; i < itemMap.length; i++) {
//         if (!isCellLegal(temp[i].x, temp[i].y)) {
//             return [];
//         }
//     }
//     return temp;
// }
// function rotate270() {
//     var temp = new Array(itemMap.length);
//     for (var i = 0; i < itemMap.length; i++) {
//         temp[i] = new Array(itemMap[i].length).fill(0);
//     }
//     var cx = Math.round((itemMap[0].x + itemMap[1].x + itemMap[2].x + itemMap[3].x)/4);;
//     var cy = Math.round((itemMap[0].y + itemMap[1].y + itemMap[2].y + itemMap[3].y)/4);;
//     var tempx,tempy;
//     for (var i = 0; i < itemMap.length; i++){
//         tempx = itemMap[i].x;
//         tempy = itemMap[i].y;
//         temp[i].x = tempy - cy + cx;
//         temp[i].y = cx - cy + tempx ; 
//     } 
//     for (var i = 0; i < itemMap.length; i++) {
//         if (!isCellLegal(temp[i].x, temp[i].y)) {
//             return [];
//         }
//     }
//     return temp;
// }
function clear() {//清除画布
    var cw = mainbox.innerWidth || 226;
    var ch = mainbox.innerHeight || 446;
    ctx.clearRect(0, 0, cw, ch);
}

(function(){
    drawBg();
    updateScroe(0);
    itemMap = getRandomItem();
    preItem = getRandomItem();
    drawItem();
    drawPre();
    timer = setInterval(function(){
        moveDown();
    }, level*100); 
})();
