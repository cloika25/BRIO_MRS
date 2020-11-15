// var towers;
// var point = init_random_point();
// var distance = dist_to_towers(point, towers);
// console.log(point)
// console.log(distance)
// console.log(match_point(towers, distance))
// draw_circle(towers.x1, towers.y1, distance.d1);
// draw_circle(towers.x2, towers.y2, distance.d2);
// draw_circle(towers.x3, towers.y3, distance.d3);
var towers;
var points;
var distances;

let file = document.getElementById('file')
file.addEventListener(onchange, readFile);

function readFile(input){
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (){
        parse_file(reader.result)
    }
}

function parse_file(file_text){
    // парсер исходного файла, отрисовка башен, пути и точек
    let rows = file_text.split('\n');
    towers = rows[0].split(',');
    distances = [];
    points = [];
    towers = {x1: towers[0], y1: towers[1],
              x2: towers[2], y2: towers[3],
              x3: towers[4], y3: towers[5]};
    draw_towers(towers);
    console.log("Towers coodinate:\n",
        "x1: ", towers.x1, " y1: ", towers.y1, "\n",
        "x2: ", towers.x2, " y2: ", towers.y2, "\n",
        "x3: ", towers.x3, " y3: ", towers.y3, "\n")
    let log_distances = "Distance to towers: \n"
    for ( let i=1; i< rows.length; i++){
        distances.push(parse_dist(rows[i].split(',')));
        log_distances += "d1: " + distances[distances.length -1].d1 + " d2: " + distances[distances.length -1].d2 +
                        " d3: " + distances[distances.length -1].d3 + '\n';
    }
    console.log(log_distances)

    points = distances.map((elem) => {
        return match_point(towers, elem);
    });

    let log_points = "Points: \n";
    for (let i = 0; i < points.length; i++){
        log_points += "x: " + points[i].x + " y: " + points[i].y + "\n";
        draw_point(points[i])
    }
    console.log(log_points)
    draw_line(points);

}

function parse_dist(row){
    return {d1: row[0], d2: row[1], d3: row[2]}
}

function draw_towers(towers){
    draw_tower(towers.x1, towers.y1);
    draw_tower(towers.x2, towers.y2);
    draw_tower(towers.x3, towers.y3);
}

function dist_to_towers(point, towers){
    // нахождение расстояния от башен до точек
    let d1 = Math.sqrt(Math.pow(Math.abs(towers.x1 - point.x), 2) + Math.pow(Math.abs(towers.y1 - point.y), 2));
    let d2 = Math.sqrt(Math.pow(Math.abs(towers.x2 - point.x), 2) + Math.pow(Math.abs(towers.y2 - point.y), 2));
    let d3 = Math.sqrt(Math.pow(Math.abs(towers.x3 - point.x), 2) + Math.pow(Math.abs(towers.y3 - point.y), 2));
    return {d1, d2, d3}
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 50);
}

function init_random_towers(){
    // создание рандомных башен
    var x1 = randomInt(500);
    var y1 = randomInt(500);
    var x2 = randomInt(500);
    var y2 = randomInt(500);
    var x3 = randomInt(500);
    var y3 = randomInt(500);
    draw_tower(x1, y1);
    draw_tower(x2, y2);
    draw_tower(x3, y3);
    return {x1, y1, x2, y2, x3, y3};
}

function init_random_point(){
    // создание рандомных точек
    var x = randomInt(500);
    var y = randomInt(500);
    return {x, y};
}

function draw_circle(x, y, r){
    // отрисовка окружности (нужно было для наглядности)
    var canvas = document.getElementById("main_field");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false);
    ctx.stroke();
}

function draw_point(point){
    // отрисовка точек
    var canvas = document.getElementById("main_field");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeRect(point.x, point.y, 2, 2);
}

function draw_line(points){
    // отрисовка пути
    var canvas = document.getElementById("main_field");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    if (points.length>1){
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++){
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }
}

function draw_tower(x, y){
    // отрисовка башен
    var canvas = document.getElementById("main_field");
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    let w = 10;
    let h = 10;
    ctx.strokeRect(x - w/2, y - h/2, w, h)
}

function match_point(towers, distance){
    let x1 = towers.x1;
    let x2 = towers.x2;
    let x3 = towers.x3;
    let y1 = towers.y1;
    let y2 = towers.y2;
    let y3 = towers.y3;
    let l1 = distance.d1;
    let l2 = distance.d2;
    let l3 = distance.d3;
    // находим точку пересечения трех окружностей
    // (x1-x)^2 + (y1-y)^2 = l1^2
    // (x2-x)^2 + (y2-y)^2 = l2^2
    // (x3-x)^2 + (y3-y)^2 = l3^2
    // аскрывваем скобки, отнимает от первого второе, от второго третье
    // x1^2 - x2^2 - 2*x1*x + 2*x2*x + y1^2 - y2^2  - 2*y1*y + 2*y2*y = l1^2 - l2^2
    // x2^2 - x3^2 - 2*x2*x + 2*x3*x + y2^2 - y3^2  - 2*y2*y + 2*y3*y = l2^2 - l3^2
    //
    // выражаем x и y
    //  y = (l1^2 - l2^2 - x1^2 + x2^2 + 2*x1*x - 2*x2*x - y1^2 + y2^2) / 2(y2-y1)
    //  y = (l2^2 - l3^2 - x2^2 + x3^2 + 2*x2*x - 2*x3*x - y2^2 + y3^2) / 2(y3-y2)
    //
    //  x = (l1^2 - l2^2 - y1^2 + y2^2 + 2*y1*y - 2*y2*y - x1^2 + x2^2) / 2(x2-x1)
    //  x = (l2^2 - l3^2 - y2^2 + y3^2 + 2*y2*y - 2*y3*y - x2^2 + x3^2) / 2(x3-x2)
    //
    // приравниваем между собой y
    // приравниваем x
    //  (l1^2 - l2^2 - x1^2 + x2^2 + 2*x1*x - 2*x2*x - y1^2 + y2^2) / 2(y2-y1) =
    //      (l2^2 - l3^2 - x2^2 + x3^2 + 2*x2*x - 2*x3*x - y2^2 + y3^2) / 2(y3-y2)
    //
    //  (l1^2 - l2^2 - y1^2 + y2^2 + 2*y1*y - 2*y2*y - x1^2 + x2^2) / 2(x2-x1) =
    //      (l2^2 - l3^2 - y2^2 + y3^2 + 2*y2*y - 2*y3*y - x2^2 + x3^2) / 2(x3-x2)
    //
    // находим координаты объекта
    // x = ((y2 - y1)*(l2^2 - l3^2 - x2^2 + x3^2 - y2^2 + y3^2)- (y3 - y2)*(l1^2 - l2^2 - x1^2 + x2^2 - y1^2 + y2^2))/
    //                                                                      2((y3 - y2)*(x1 - x2) - (y2 - y1)*(x2 - x3))
    // y = ((x2 - x1)*(l2^2 - l3^2 - y2^2 + y3^2 - x2^2 + x3^2)- (x3 - x2)*(l1^2 - l2^2 - y1^2 + y2^2 - x1^2 + x2^2))/
    //                                                                      2((x3 - x2)*(y1 - y2) - (x2 - x1)*(y2 - y3))
    try {
        let x = ((y2 - y1) * (l2 * l2 - l3 * l3 - y2 * y2 + y3 * y3 - x2 * x2 + x3 * x3) - (y3 - y2) * (l1 * l1 - l2 * l2 - y1 * y1 + y2 * y2 - x1 * x1 + x2 * x2))
                                                            / (2 * ((y3 - y2) * (x1 - x2)  - (y2 - y1) * (x2 - x3)));
        let y = ((x2 - x1) * (l2 * l2 - l3 * l3 - x2 * x2 + x3 * x3 - y2 * y2 + y3 * y3) - (x3 - x2) * (l1 * l1 - l2 * l2 - x1 * x1 + x2 * x2 - y1 * y1 + y2 * y2))
                                                            / (2 * ((x3 - x2) * (y1 - y2)  - (x2 - x1) * (y2 - y3)));

        return {x, y};
    }
    catch (e) {
        console.log(e);
    }
}
        