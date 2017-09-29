var canvas = new fabric.Canvas('canvas');
canvas.setWidth(800);
canvas.setHeight(800);

fabric.Balloon = fabric.util.createClass(fabric.Rect, {
    astart:0,
    aend:0,
    ax: 0,
    ay: 0,
    isCircle: false,
    initialize: function (options) {
        this.callSuper('initialize',options);
    },

    _render: function(ctx){
        if(this.width < 1 && this.height < 1){
            ctx.fillRect(-0.5, -0.5, 1, 1);
            return;
        }
        
        var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
        ry = this.ry ? Math.min(this.ry, this.height / 2) : 0,
        w = this.width,
        h = this.height,
        x = this.width / 2,
        y = this.height / 2,
        isRounded = rx !== 0 || ry !== 0,
        startAngle = this.astart,
        endAngle = this.aend;
        isArrowed = startAngle !== endAngle,
        k = 1 - 0.5522847498;
        
        ctx.beginPath();

        if (this.isCircle) {
            ctx.moveTo(0, -y);
            ctx.quadraticCurveTo(-x, -y, -x, 0);
            ctx.quadraticCurveTo(-x, y, 0, y);
            ctx.quadraticCurveTo(x, y, x, 0);
            ctx.quadraticCurveTo(x, -y, 0, -y);
        }
        else{
            ctx.moveTo(-x + rx, -y);
    
            ctx.lineTo(-x + w - rx, -y);
            isRounded && ctx.bezierCurveTo(-x + w - k * rx, -y, -x + w, -y + k * ry, -x + w, -y + ry);
    
            ctx.lineTo(x + w, y + h - ry);
            isRounded && ctx.bezierCurveTo(-x + w, -y + h - k * ry, -x + w - k * rx, -y + h, -x + w - rx, -y + h);
    
            ctx.lineTo(x + rx, y + h);
            isRounded && ctx.bezierCurveTo(-x + k * rx, -y + h, -x, -y + h - k * ry, -x, -y + h - ry);
    
            ctx.lineTo(x, y + ry);
            isRounded && ctx.bezierCurveTo(-x, -y + k * ry, -x + k * rx, -y, -x + rx, -y);

        }
        ctx.closePath();
        
        if(isArrowed){
            var pointoncurve1, pointoncurve2;
            var startPoint = {a: startAngle / (Math.PI/2), b: (startAngle % (Math.PI/2)) * (2/Math.PI)},
                endPoint = { a: endAngle / (Math.PI / 2), b: (endAngle % (Math.PI / 2)) * (2 / Math.PI) };
            switch (parseInt(startPoint.a)) {
                case 0:
                    pointoncurve1 = getQuadraticCurvePoint(0, -y, -x, -y, -x, 0, startPoint.b);
                    break;

                case 1:
                    pointoncurve1 = getQuadraticCurvePoint(-x, 0, -x, y, 0, y, startPoint.b);
                    break;

                case 2:
                    pointoncurve1 = getQuadraticCurvePoint(0, y, x, y, x, 0, startPoint.b);
                    break;

                case 3:
                    pointoncurve1 = getQuadraticCurvePoint(x, 0, x, -y, 0, -y, startPoint.b);
                    break;
            }
            switch (parseInt(endPoint.a)) {
                case 0:
                    pointoncurve2 = getQuadraticCurvePoint(0, -y, -x, -y, -x, 0, endPoint.b);
                    break;

                case 1:
                    pointoncurve2 = getQuadraticCurvePoint(-x, 0, -x, y, 0, y, endPoint.b);
                    break;

                case 2:
                    pointoncurve2 = getQuadraticCurvePoint(0, y, x, y, x, 0, endPoint.b);
                    break;

                case 3:
                    pointoncurve2 = getQuadraticCurvePoint(x, 0, x, -y, 0, -y, endPoint.b);
                    break;
            }
            if (this.ax < 0) {
                x = -x;
            }
            ctx.moveTo(pointoncurve1.x, pointoncurve1.y);
            ctx.lineTo(this.ax, this.ay);
            ctx.lineTo(pointoncurve2.x, pointoncurve2.y);
        }
        this._renderStroke(ctx);
        this._renderFill(ctx);
    },
    _renderControls: function(ctx, styleOverride, childrenOverride) {
        ctx.save();
        this.callSuper('_renderControls', ctx, styleOverride);
        //show ArrowPoint

        ctx.restore();
    },

});


function _getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
    return {
        x:  _getQBezierValue(position, startX, cpX, endX),
        y:  _getQBezierValue(position, startY, cpY, endY)
    };
}


// Double-click event handler
var fabricDblClick = function (obj, handler) {
    return function () {
        if (obj.clicked) handler(obj);
        else {
            obj.clicked = true;
            setTimeout(function () {
                obj.clicked = false;
            }, 500);
        }
    };
};

function addBalloon(){

    var items =[];

    var ungroup = function (group) {
        items = group._objects;
        group._restoreObjectsState();
        canvas.remove(group);
        for (var i = 0; i < items.length; i++) {
            canvas.add(items[i]);
        }
        // if you have disabled render on addition
        canvas.renderAll();
    };

    var balloon = new fabric.Balloon({
        top: 200,
        left: 200,
        width: 50,
        height: 50,
        isCircle:true,
        ax:-20,ay:40,
        astart:12 * Math.PI/16,
        aend:15*Math.PI/16, 
        stroke:'#000' ,
        fill: '#fff' });

    var BalloonText = new fabric.IText("Text", {
        fontFamily: 'Comic Sans',
        fontSize: 14,
        stroke: '#000',
        strokeWidth: 1,
        fill: "#000",
        left: 200,
        top: 200
    });

    var group = new fabric.Group([balloon, BalloonText], {
        left: 200,
        top: 200
    });
    canvas.add(group);

    group.on('mousedown', fabricDblClick(group, function (obj) {
        ungroup(group);
        canvas.setActiveObject(BalloonText);
        BalloonText.enterEditing();
        BalloonText.selectAll();
    }));
    BalloonText.on('editing:exited', function () {
        var items = [];
        canvas.forEachObject(function (obj) {
            items.push(obj);
            canvas.remove(obj);
        });
        var grp = new fabric.Group(items.reverse(), {});
        canvas.add(grp);
        grp.on('mousedown', fabricDblClick(grp, function (obj) {
            ungroup(grp);
            canvas.setActiveObject(BalloonText);
            BalloonText.enterEditing();
            BalloonText.selectAll();
        }));
    });
};

addBalloon();