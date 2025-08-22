var MaxInt = 32767; //表示极大值，即∞
var MVNum = 100; //最大顶点数 
var radius = 15; // 圆弧半径
var query = document.getElementById("query");
var myCanvas = document.getElementById('canvas');
var ctx = document.getElementById('canvas').getContext('2d');
var city_begin = "";//起点
var city_end = "";//终点
var mouse_x = null;//当前鼠标指向x坐标
var mouse_y = null;//当前鼠标指向y坐标
var path_title=document.getElementById("path_title");//画布上的提示
path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请用鼠标点击起点城市或在下方输入框输入城市名</p>";

//各城市名称及坐标
var city_list = [{
		x: 136,
		y: 62,
		name: "乌鲁木齐",
	},
	{
		x: 896,
		y: 63,
		name: "哈尔滨",
	},
	{
		x: 851,
		y: 120,
		name: "长春",
	},
	{
		x: 502,
		y: 162,
		name: "呼和浩特",
	},
	{
		x: 619,
		y: 188,
		name: "北京",
	},
	{
		x: 802,
		y: 176,
		name: "沈阳",
	},
	{
		x: 682,
		y: 239,
		name: "天津",
	},
	{
		x: 781,
		y: 248,
		name: "大连",
	},
	{
		x: 298,
		y: 263,
		name: "西宁",
	},
	{
		x: 380,
		y: 288,
		name: "兰州",
	},
	{
		x: 470,
		y: 313,
		name: "西安",
	},
	{
		x: 572,
		y: 316,
		name: "郑州",
	},
	{
		x: 664,
		y: 318,
		name: "徐州",
	},
	{
		x: 370,
		y: 385,
		name: "成都",
	},
	{
		x: 565,
		y: 398,
		name: "武汉",
	},
	{
		x: 721,
		y: 399,
		name: "上海",
	},
	{
		x: 303,
		y: 518,
		name: "昆明",
	},
	{
		x: 389,
		y: 490,
		name: "贵阳",
	},
	{
		x: 533,
		y: 474,
		name: "株洲",
	},
	{
		x: 619,
		y: 472,
		name: "南昌",
	},
	{
		x: 703,
		y: 492,
		name: "福州",
	},
	{
		x: 451,
		y: 529,
		name: "柳州",
	},
	{
		x: 390,
		y: 567,
		name: "南宁",
	},
	{
		x: 533,
		y: 558,
		name: "广州",
	},
	{
		x: 539,
		y: 600,
		name: "深圳",
	}
]

//邻接矩阵
var G = {
	vexs: new Array(MVNum), //顶点表
	arcs: new Array(MVNum), //邻接矩阵
	vexnum: 25, //图的当前点数
	arcnum: 31, //图的当前边数
}

//辅助数组的集合
var s_d_path = {
	S: new Array(MVNum), //：记录相应顶点是否已被确定最短距离
	D: new Array(MVNum), //：记录源点到相应顶点路径长度
	Path: new Array(MVNum), //：记录相应顶点的前驱顶点所在的索引
}

//城市名
var dd = new Array("乌鲁木齐", "哈尔滨", "长春", "呼和浩特", "北京", "沈阳", "天津", "大连", "西宁", "兰州", "西安",
	"郑州", "徐州", "成都", "武汉", "上海", "昆明", "贵阳", "株洲", "南昌", "福州", "柳州", "南宁", "广州", "深圳");
	
//vv1跟vv2对应的两地的距离
var vv1 = new Array("乌鲁木齐", "西宁", "兰州", "兰州", "西安", "呼和浩特", "北京", "北京", "天津",
	"天津", "沈阳", "沈阳", "长春",
	"西安", "郑州", "徐州",
	"西安", "郑州", "成都",
	"成都", "武汉", "上海",
	"昆明", "贵阳", "株洲",
	"南昌", "贵阳", "株洲",
	"柳州", "株洲", "广州");

var vv2 = new Array("兰州", "兰州", "呼和浩特", "西安", "郑州", "北京", "郑州", "天津", "徐州",
	"沈阳", "大连", "长春", "哈尔滨",
	"郑州", "徐州", "上海",
	"成都", "武汉", "昆明",
	"贵阳", "株洲", "南昌",
	"贵阳", "株洲", "南昌",
	"福州", "柳州", "柳州",
	"南宁", "广州", "深圳");

//两地距离的权值
var quanz = new Array(1892, 216, 1145, 676, 511, 668, 695, 137, 674,
	704, 397, 305, 242,
	511, 349, 651,
	534, 842, 1100,
	967, 409, 825,
	639, 902, 367,
	622, 607, 672,
	255, 975, 140);

//监听当前鼠标所指坐标
myCanvas.addEventListener("mousemove", function(e) {
	var sw = (myCanvas.style.width.replace(/\px/g, "")) | 0,
		sh = (myCanvas.style.height.replace(/\px/g, "")) | 0;

	if(e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= myCanvas.offsetLeft;
	y -= myCanvas.offsetTop;

	if(sw) x *= myCanvas.width / sw;
	if(sh) y *= myCanvas.height / sh;
	x |= 0;
	y |= 0;

	mouse_x = x;
	mouse_x = y;
}, false);

//鼠标点击画布
function whichButton(event) {
	var btnNum = event.button;
	if(btnNum == 2) {
		console.log("您点击了鼠标右键！")
	} else if(btnNum == 0) {
		console.log("您点击了鼠标左键！")
		var now_click_sport_index = find_nearest_city();
		if(now_click_sport_index==-1){return 0;}
		if(city_begin==""&&city_end==""){
			//当起点终点都未定时
			city_begin=city_list[now_click_sport_index].name;
			draw_finish_path_city(now_click_sport_index,"blue"); //渲染城市蓝圈
			path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请点击终点城市</p>";
		}else if(city_begin!=""&&city_end==""&&city_begin==city_list[now_click_sport_index].name){
			//当起点确定,终点不确定且当前点击点为之前确定的起点时
			city_begin="";
			ctx.clearRect(0,0,myCanvas.width,myCanvas.height);//清空画布
			draw();//重新初始化画布
			path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请用鼠标点击起点城市或在下方输入框输入城市名</p>";
		}else if(city_begin!=""&&city_end==""&&city_begin!=city_list[now_click_sport_index].name){
			//当起点确定终点不确定且当前点击点不为之前确定的起点时
			city_end=city_list[now_click_sport_index].name;
			to_query();
			path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请用鼠标点击起点城市或在下方输入框输入城市名</p>";
		}else if(city_begin!=""&&city_end!=""){
			ctx.clearRect(0,0,myCanvas.width,myCanvas.height);//清空画布
			draw();//重新初始化画布
			city_begin=city_list[now_click_sport_index].name;
			draw_finish_path_city(now_click_sport_index,"blue"); //渲染城市蓝圈
			city_end="";
//			path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请用鼠标点击起点城市或在下方输入框输入城市名</p>";
			path_title.innerHTML = "<p style='width:1000px;color:red;font-size: 20px;text-align: center;'>请点击终点城市</p>";
		}
		//draw_finish_path_city(e,"blue"); //渲染城市蓝圈
	} else if(btnNum == 1) {
		console.log("您点击了鼠标中键！");
	} else {
		console.log("您点击了" + btnNum + "号键，我不能确定它的名称。");
	}
}

//遍历检测鼠标点击的城市,返回城市所在数组的索引
function find_nearest_city() {
	var i = 0;
	console.log("当前点击x:", x, " y:", y)
	
	for(i; i < city_list.length; i++) {
		var x_disparity= x - city_list[i].x;
		var y_disparity= y - city_list[i].y;
		if(Math.sqrt(x_disparity*x_disparity+y_disparity*y_disparity)<=15){
			return i;
		}
	}
	return -1;
}

//查询按钮
function to_query() {
	ctx.clearRect(0, 0, 1000, 700);
	ctx.lineWidth = 1;
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.strokeStyle = 'rgb(0,0,0)';
	draw();

	var begin_num = 0;
	var end_num = 0;

	if(city_begin == "" || city_end == "") {
		alert("请检查输入城市");
		return 0;
	}

	console.log(city_begin)
	console.log(city_end)
	//将起点终点城市所在索引赋值
	begin_num = locate_city(city_begin);
	end_num = locate_city(city_end);
	var e = locate_city(city_end);
	if(begin_num == -1 || end_num == -1) {
		alert("请检查输入是否有误");
		return 0;
	}

	G = CreateGraph(G); //创建邻接矩阵

	s_d_path = ShortestPath_DIJ(G, begin_num, s_d_path); //求最短路径
	console.log(s_d_path)
	
	draw_path(G, end_num, s_d_path); //红线绘制最短路径
	draw_path_city(G, e, s_d_path); //对经过的城市进行红圈标注
	while(s_d_path.Path[e] != -1) {
		e = s_d_path.Path[e];
	}
	draw_finish_path_city(e, "blue"); //渲染起点的城市红圈

	document.getElementById("path_num").innerHTML = "最短路径长度为：<span style='color:red;'>" + s_d_path.D[end_num] + "</span>";
	var s = show_shortest_path_string(G, end_num, s_d_path);
	//	console.log(s)
	document.getElementById("path_city").innerHTML = "最短路径途径城市为：<span style='color:red;'>" + s + "</span>";
}

//红线绘制最短路径
function draw_path(G, v, s_d_path) {
	if(v != -1) {
		draw_path(G, s_d_path.Path[v], s_d_path);
		if(s_d_path.Path[v] != -1) {
			ctx.strokeStyle = 'rgb(255,51,0)';
			ctx.lineWidth = 3;
			console.log("v:", v)
			var v1_index = locate_city(G.vexs[v]);
			var v2_index = locate_city(G.vexs[s_d_path.Path[v]]);
			console.log("v1_index:", v1_index, " v2_index:", v2_index)
			var x1 = city_list[v1_index].x;
			var x2 = city_list[v2_index].x;
			var y1 = city_list[v1_index].y;
			var y2 = city_list[v2_index].y;
			//		  	G.vexs[v]
			console.log("x1:", x1, " y1:", y1)
			console.log("x2:", x2, " y2:", y2)
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
	}
}

//对经过的城市进行红圈标注
function draw_path_city(G, v, s_d_path) {
	if(v != -1) {
		draw_path_city(G, s_d_path.Path[v], s_d_path);
		if(s_d_path.Path[v] != -1) {
			ctx.beginPath();
			var x = city_list[v].x; // x 坐标值
			var y = city_list[v].y; // y 坐标值
			var startAngle = 0; // 开始点
			var endAngle = Math.PI * 2; // 结束点
			var anticlockwise = true; // 顺时针或逆时针

			clearArcFun(x, y, radius, ctx);

			//将各个城市画圆填入画布
			ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			ctx.stroke();

			//将城市名填入画布
			ctx.font = "10px serif";
			if(city_list[v].name.length == 2) {
				ctx.fillText(city_list[v].name, x - 10, y + 3);
			} else if(city_list[v].name.length == 3) {
				ctx.fillText(city_list[v].name, x - 15, y + 5);
			} else if(city_list[v].name.length == 4) {
				ctx.fillText(city_list[v].name, x - 20, y + 5);
			} else {
				ctx.fillText(city_list[v].name, x - 10, y + 3);
			}
		}
	}
}

//对索引为v的城市圈圈标注
function draw_finish_path_city(v, color) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'blue';
	if(color == "red") ctx.strokeStyle = 'red';
	ctx.beginPath();
	var x = city_list[v].x; // x 坐标值
	var y = city_list[v].y; // y 坐标值
	var startAngle = 0; // 开始点
	var endAngle = Math.PI * 2; // 结束点
	var anticlockwise = true; // 顺时针或逆时针

	clearArcFun(x, y, radius, ctx);

	//将各个城市画圆填入画布
	ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	ctx.stroke();

	//将城市名填入画布
	ctx.font = "10px serif";
	if(city_list[v].name.length == 2) {
		ctx.fillText(city_list[v].name, x - 10, y + 3);
	} else if(city_list[v].name.length == 3) {
		ctx.fillText(city_list[v].name, x - 15, y + 5);
	} else if(city_list[v].name.length == 4) {
		ctx.fillText(city_list[v].name, x - 20, y + 5);
	} else {
		ctx.fillText(city_list[v].name, x - 10, y + 3);
	}
}

//初始化画布
function draw() {
	//	ctx = document.getElementById('canvas').getContext('2d');
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';
	//绘制个城市之间的连线
	for(var b = 0; b < vv1.length; b++) {
		var begin_spot = 0;
		var end_spot = 0;
		var v1_index = locate_city(vv1[b]);
		var v2_index = locate_city(vv2[b]);
		var x1 = city_list[v1_index].x;
		var x2 = city_list[v2_index].x;
		var y1 = city_list[v1_index].y;
		var y2 = city_list[v2_index].y;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.fillStyle = '#0000ff';
		ctx.font = "20px serif";
		ctx.fillText(quanz[b], (x1 + x2) / 2, (y1 + y2) / 2);
		ctx.fillStyle = 'rgb(0,0,0)';
	}

	//绘制城市及其名字
	for(var a = 0; a < city_list.length; a++) {
		ctx.beginPath();
		var x = city_list[a].x; // x 坐标值
		var y = city_list[a].y; // y 坐标值
		var startAngle = 0; // 开始点
		var endAngle = Math.PI * 2; // 结束点
		var anticlockwise = true; // 顺时针或逆时针

		clearArcFun(x, y, radius, ctx);

		//将各个城市画圆填入画布
		ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		ctx.stroke();

		//将城市名填入画布
		ctx.font = "10px serif";
		if(city_list[a].name.length == 2) {
			ctx.fillText(city_list[a].name, x - 10, y + 3);
		} else if(city_list[a].name.length == 3) {
			ctx.fillText(city_list[a].name, x - 15, y + 5);
		} else if(city_list[a].name.length == 4) {
			ctx.fillText(city_list[a].name, x - 20, y + 5);
		} else {
			ctx.fillText(city_list[a].name, x - 10, y + 3);
		}
		//document.write("\"",city_list[a].name,"\",")
	}
}

//(x,y)为要清除的圆的圆心，r为半径，cxt为canvas
function clearArcFun(x, y, r, ctx) {
	var stepClear = 1; //别忘记这一步  
	clearArc(x, y, r);

	function clearArc(x, y, radius) {
		var calcWidth = radius - stepClear;
		var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
		var posX = x - calcWidth;
		var posY = y - calcHeight;

		var widthX = 2 * calcWidth;
		var heightY = 2 * calcHeight;

		if(stepClear <= radius) {
			ctx.clearRect(posX, posY, widthX, heightY);
			stepClear += 1;
			clearArc(x, y, radius);
		}
	}
}

//查找城市输入时的索引,查找成功返回索引，失败则返回-1
function locate_city(city_name) {
	var a = 0;
	for(a; a < dd.length; a++) {
		if(dd[a] == city_name) {
			return a;
		}
	}
	return -1;
}

//查找元素s所在邻接矩阵的位置
function LocateVex(G, s) {
	for(i = 0; i < G.arcnum; i++)
		if(G.vexs[i] == s) {
			break;
		}
	return i;
}

//创建邻接矩阵,返回创建好的G
function CreateGraph(G) {
	for(var i = 0; i < MVNum; i++) {
		G.arcs[i] = new Array(MVNum);
	}
	var a = 0;
	var b = 0;

	for(a; a < G.vexnum; a++) {
		G.vexs[a] = dd[a];
	}

	for(a = 0; a < MVNum; a++)
		for(b = 0; b < MVNum; b++)
			G.arcs[a][b] = MaxInt;

	for(var i = 0; i < G.arcnum; i++) {
		var v1;
		var v2;
		var w = quanz[i];
		v1 = vv1[i];
		v2 = vv2[i];
		w = quanz[i];
		a = LocateVex(G, v1);
		b = LocateVex(G, v2);
		G.arcs[a][b] = w;
		G.arcs[b][a] = w;
	}
	return G;
}

//展示邻接矩阵
function Show(G) {
	for(var a = 0; a < G.vexnum; a++) {
		for(var b = 0; b < G.vexnum; b++) {
			if(G.arcs[a][b] == MaxInt) {
				console.log("∞\t")
			} else {
				console.log(G.arcs[a][b], "\t")
			}
		}
		console.log("\n")
	}

}

//迪杰斯特拉算法求最短路径
function ShortestPath_DIJ(G, v0, s_d_path) {
	var i = 0;
	var j = 0;
	var k = 0;
	for(i = 0; i < G.vexnum; i++) {
		s_d_path.S[i] = false; //将S设为空集
		s_d_path.D[i] = G.arcs[v0][i]; //将各点到v0点的距离初始为各边的权值
		//将与源点有连线点的前驱点设为源点，无连线点的前驱点设为-1
		if(s_d_path.D[i] < MaxInt) {
			s_d_path.Path[i] = v0;
		} else {
			s_d_path.Path[i] = -1;
		}
	}
	s_d_path.S[v0] = true; //将v0加入s
	s_d_path.D[v0] = 0; //将源点到源点的距离设为0

	//因为初始化后S数组中已经有一个点是选中状态为true，所以只用循环顶点减一次
	for(i = 1; i < G.vexnum; i++) {
		var min = MaxInt;
		//找出数组D中距离最小且在S数组中为未选中状态的点
		for(j = 0; j < G.vexnum; j++) {
			//console.log(!s_d_path.S[j])
			if(!s_d_path.S[j] && s_d_path.D[j] < min) {
				min = s_d_path.D[j];
				k = j;
			}
		}
		s_d_path.S[k] = true; //找到后将该点设置为选中过的状态
		//更新D数组，若（当前选中点k与源点的距离）+（当前选中点与相邻点j的距离)<源点到相邻点j的距离，
		//则更新D数组中j元素的信息
		for(j = 0; j < G.vexnum; j++) {
			if(!s_d_path.S[j] && (s_d_path.D[k] + G.arcs[k][j] < s_d_path.D[j])) {
				s_d_path.D[j] = s_d_path.D[k] + G.arcs[k][j];
				s_d_path.Path[j] = k;
			}
		}
	}
	return s_d_path;
}

//用递归输出最短路径经过的点
function show_shortest_path(G, v, s_d_path) {
	if(v != -1) {
		show_shortest_path(G, s_d_path.Path[v], s_d_path);
		document.write("->", G.vexs[v])
	}

}

//用递归输出最短路径经过的点并返回字符串
function show_shortest_path_string(G, v, s_d_path) {
	var all_path = "";
	if(v != -1) {
		show_shortest_path_string(G, s_d_path.Path[v], s_d_path);
		all_path = all_path + "->" + G.vexs[v];
		return show_shortest_path_string(G, s_d_path.Path[v], s_d_path) + all_path;
	}
	return '';
}