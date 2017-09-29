//Load
function Image_Load(obj) {
    var pathpoint = obj.value.lastIndexOf('.');
    var filepoint = obj.value.substring(pathpoint+1,obj.length);
    var filetype = filepoint.toLowerCase();
    if(filetype=='jpg'|| filetype=='jpeg'|| filetype=='png' || filetype=='gif'  || filetype=='bmp'){
        var reader = new FileReader();
        reader.readAsDataURL(obj.files[0]);
        reader.onload = function  () {
            var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
            tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
            tempImage.onload = function () {
                var image = new fabric.Image(this);
                canvas.add(image);
            }
        }
    }
    else{
        alert("이미지 파일만 선택할 수 있습니다.");
    }
    obj.value = "";
}

var curLayer;
var LayerCount = 1;
function addLayer() {
    var newLayer = document.createElement("div");
    newLayer.style.borderRadius = "5px";
    newLayer.style.marginTop = "5px";
    newLayer.style.width = "100%";
    newLayer.style.background="#FFCC66";
    newLayer.style.color="white";
    newLayer.innerText = "Layer" + LayerCount++;
    newLayer.onclick = function changeLayer() {
        if(curLayer)
            curLayer.style.background = "#FFCC66";
        this.style.background = "gray";
        curLayer = this;

        var i;
        for(i=0;i<objs.length;i++){
            if(objs[i].layer == curLayer.innerText){
                objs[i].selectable = true;
                objs[i].evented = true;
            }
            else{
                objs[i].selectable = false;
                objs[i].evented = false;
            }
        }
    }
    GetElement('layer-objects').appendChild(newLayer);
    newLayer.click();
}

function mergeObjectsByLayer() {

    if(Flag==0) {
        var i, temp = [], group;

        for (i = 0; i < objs.length; i++) {
            if (objs[i].layer === curLayer.innerText) {
                temp.push(objs[i]);
            }
        }

        group = new fabric.Group(temp);

        for (i = 0; i < temp.length; i++) {
            canvas.remove(temp[i]);
        }

        canvas.add(group);
    }
    else {
        alert("자동채색이나 Edge-Detect가 끝난 후에 할수 있습니다.");
    }
}

//서버로 캔버스를 보내는 함수이다. mainCanvas에 캔버스를 넣고, flag는 서버에 저장하려면 3을 사용하면 된다. (1과 2는 오토드로우 용이므로 사용 X)
function sendCanvas(main_canvas, flag) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/image_receiver', true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    xhr.setRequestHeader("Cache-Control","no-cache, must-revalidate");
    xhr.setRequestHeader("Pragma","no-cache");

    var params = "image=";
    params += main_canvas.toDataURL('image/png');
    params +='&flag=' + flag;

    if(flag==3) {
        params += '&parent=' + parentNum;
    }
    else if(flag==2) {
        xhr.onreadystatechange = function rspns() {
            if (xhr.readyState == 4) {
                var img = new Image();
                img.src = "data:image/png;base64," + xhr.responseText;
                img.onload = function () {
                    var image = new fabric.Image(this);
                    canvas.add(image);
                }
            }
        };
    }

    xhr.send(params);
    //window.location="http://localhost:3000/";
}