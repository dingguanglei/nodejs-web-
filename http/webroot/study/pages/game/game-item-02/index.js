/**
 * Created by 丁光磊local on 2016/12/14.
 */
window.onload = function () {
    draw();
	STAGE_X=900;
	STAGE_Y=500;


};
function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var x_mouse;
        var y_mouse;
        canvas.onmousemove = function () {
            x_mouse = mousePos()[0];
            y_mouse = mousePos()[1];

        };
        var ball_1 = new Ball(ctx, 100, 100, 40,"black", 10, 8);
        var ball_2 = new Ball(ctx, 200, 50, 30,"red", 5, 11);
        var ball_3 = new Ball(ctx, 350, 150, 20,"yellow", 10, 13);
        var ball_self = new Ball(ctx, x_mouse, y_mouse, "black", 0, 0);
        var execute21=true;
        var execute23=true;
        var execute13=true;
        setTimeout(function(){
            ctx.clearRect(0, 0, STAGE_X, STAGE_Y);
            ball_self.x = x_mouse;
            ball_self.y = y_mouse;
            ball_self.draw();

            ball_1.run();
            ball_2.run();
            ball_3.run();

            execute21=Collapsecoll(ball_2, ball_1,execute21);
            execute23=Collapsecoll(ball_3, ball_1,execute23);
            execute13=Collapsecoll(ball_3, ball_2,execute13);

            ball_1.draw();
            ball_2.draw();
            ball_3.draw();

            setTimeout(arguments.callee,15);
        },15);

    }
}

function Ball(ctx, x, y, r,color, v_x, v_y) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = color;
    this.v_x = v_x;
    this.v_y = v_y;
    this.a_x = +0;
    this.a_y = +0.0;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    this.run = function () {
        this.x += this.v_x;
        this.y += this.v_y;
        this.v_y += this.a_y;
        if (this.x + this.radius > STAGE_X) {
            this.x = STAGE_X- this.radius;
            this.reverse(true, false);
            // this.step(true,false);
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.reverse(true, false);
            // this.step(true,false);
        }

        if (this.y + this.radius > STAGE_Y) {
            this.y = STAGE_Y- this.radius;

            this.reverse(false, true);
            this.step(false, true);
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;

            this.reverse(false, true);
            // this.step(false,true);
        }

    };
    this.reverse = function (x_reverse, y_reverse) {
        if (x_reverse) {
            this.v_x = -this.v_x;
        }
        if (y_reverse) {
            this.v_y = -this.v_y;
        }
    };
    this.step = function (x_step, y_step) {
        if (x_step) {
            this.x += this.v_x;
        }
        if (y_step) {
            this.y += this.v_y;
        }
    }
}
function Collapsecoll(ball1, ball2, ifExecute) {

    var distance = Math.pow(Math.pow((ball1.x - ball2.x), 2) + Math.pow((ball2.y - ball1.y), 2), 0.5);
    if (distance < ball1.radius + ball2.radius) {
        if (ifExecute) {
            ball1.reverse(true, true);
            ball2.reverse(true, true);
            ball1.step(true, true);
            ball2.step(true, true);
            ball1.reverse(true, true);
            ball2.reverse(true, true);

            var v_oo = new Vector(ball1.x - ball2.x, ball1.y - ball2.y);    //球心连线的向量 1->2
            var v_unit_oo = v_oo.unitLengthVector();     //球心连线的单位向量
            var v_v1 = new Vector(ball1.v_x, ball2.v_y);       //球1的速度向量
            var v_v2 = new Vector(ball2.v_x, ball2.v_y);       //球2的速度向量

            var vc1 = v_v1.dotProduct(v_unit_oo);              // 球1速度向量点乘球心连线向量，得到球心连线的模长
            var vc2 = v_v2.dotProduct(v_unit_oo);              // 球1速度向量点乘球心连线向量，得到球心连线的模长

            var v_vc1 = new Vector(v_unit_oo.x * vc1, v_unit_oo.y * vc1);        //球心连线的VC1向量
            var v_vc2 = new Vector(v_unit_oo.x * vc2, v_unit_oo.y * vc2);       //球心连线的VC2向量

            var v_vt1 = v_v1.add(v_vc1.reverse());         //vt=-vc1+v1;
            var v_vt2 = v_v2.add(v_vc2.reverse());         //vt=-vc1+v1;

            var finalv_v1 = v_vt1.add(v_vc2);
            var finalv_v2 = v_vt2.add(v_vc1);
            // console.log(v_vc1.dotProduct(v_vt1));
            // console.log(v_vc2.dotProduct(v_vt2));
            // console.log(v_vc1.dotProduct(v_unit_oo));
            // console.log(v_vc2.dotProduct(v_unit_oo));
            ball1.v_x = finalv_v1.x;
            ball1.v_y = finalv_v1.y;
            ball2.v_x = finalv_v2.x;
            ball2.v_y = finalv_v2.y;
            // ball1.step(true, true);
            // ball2.step(true, true);
        }
        else{
            ball1.step(true, true);
            ball2.step(true, true);
        }
        return false;
    }
    return true;
}

function drawArc(ctx, x_mouse, y_mouse, r, color) {
    r = arguments[3] ? arguments[3] : 50;             //默认参数 50
    color = arguments[4] ? arguments[4] : "black";    //默认黑色
    ctx.beginPath();
    ctx.arc(x_mouse, y_mouse, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);
    this.dotProduct = function (vector) {
        return vector.x * this.x + vector.y * this.y;  //返回点积
    };
    this.unitLengthVector = function () {
        return new Vector(x / this.length, y / this.length);
    };
    this.reverse = function () {
        return new Vector(-this.x, -this.y);
    };
    this.scalarMultiply = function (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    };
    this.unitVerticalVectory = function () {
        var uvv_x = 1;
        var uvv_y = -this.x / this.y;
        return new Vector(uvv_x, uvv_y).unitLengthVector();
    };
    this.add = function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
}

function mousePos(e) {

    var e = e || window.event;
    var x = e.offsetX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = e.offsetY + document.body.scrollTop + document.documentElement.scrollTop;
    return [x, y]
}
// 封装的一个用于绘制圆角矩形的函数.
function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
}