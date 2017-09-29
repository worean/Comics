/**
 * Created by bgh29 on 2017-08-01.
 */

function ImageSlider(num, opt) {
    var instance = this;
    this.num = num;
    this.currentPostion = 0;
    this.left=0;
    this.li_items;
    this.imageNumber;
    this.imageWidth = opt.imageWidth;
    this.imageHeigth = opt.imageHeigth;
    this.gravity = opt.gravity;
    this.prev;
    this.next;
    this.nextHandler = function() {instance.onClickNext()};
    this.prevHandler = function() {instance.onClickPrev()};
    this.currentImage = 0;
}

ImageSlider.prototype.create = function(list){
    var instance = this;
    var wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("slider_wrapper");

    this.ul = document.createElement("ul");
    this.ul.id = "image_slider_" + this.num.toString();
    wrapperDiv.appendChild(this.ul);

    list.forEach(function(v,i){
        var li = document.createElement("li");
        var img = document.createElement("img");
        var heartDiv = document.createElement("div");
        var crossDiv = document.createElement("div");
        fitImageSize(img, v.imgSrc, instance.imageWidth, instance.imageHeigth);
        heartDiv.classList.add("heart-shape");
        heartDiv.onclick = function(){
          this.classList.toggle("is-on");
          var xhr = new XMLHttpRequest();
          var url = '/modi_like?';
          url += 'num=' + v.num.toString();
          if(this.classList.length==1){
            url += '&flag=del';
          } else {
            url += '&flag=add';
          }
          fetch(url).then(function (res) {
                console.log(res.text()+"a");
            }).then(function (html) {
                console.log("a");
            });
        };
        heartDiv.style.opacity = "0.5";
        crossDiv.classList.add("x-shape");
        crossDiv.onclick = function(){
            var xhr = new XMLHttpRequest();
            var url = '/del_cut?';
            url += 'num=' + v.num.toString();
            url += '&child=' + v.child.length.toString();
            console.log(url);
            fetch(url).then(function (res) {
                console.log(res.text()+"a");
            }).then(function (html) {
                console.log("a");
            });
        };
        if(i>0){
            li.style.opacity="0.5";
            heartDiv.style.visibility="hidden";
            crossDiv.style.visibility="hidden";
        }
        li.appendChild(img);
        li.appendChild(heartDiv);
        li.appendChild(crossDiv);
        instance.ul.appendChild(li);
    });

    this.li_items = this.ul.children;
    this.imageNumber = this.li_items.length;
    this.ul.style.width = parseInt(this.imageWidth * this.imageNumber) + 'px';
    if(this.gravity=="center")
        this.left = (window.innerWidth*0.8-this.imageWidth)/2;
    this.ul.style.left = parseInt(this.left)+'px';

    this.prev = document.createElement("span");
    this.prev.classList.add("nvgt");
    this.prev.id = "prev_"+this.num.toString();
    this.prev.onclick = this.prevHandler;
    wrapperDiv.appendChild(this.prev);

    this.next = document.createElement("span");
    this.next.classList.add("nvgt");
    this.next.id = "next_"+this.num.toString();
    this.next.onclick = this.nextHandler;
    wrapperDiv.appendChild(this.next);

    return wrapperDiv;
}
function fitImageSize(obj, href, maxWidth, maxHeight) {
    var image = new Image();

    obj.onload = function(){

        var width = this.width;
        var height = this.height;

        var scalex = maxWidth / width;
        var scaley = maxHeight / height;;//maxHeight / height;

//            var scale = (scalex < scaley) ? scalex : scaley;

        obj.width = scalex * width;
        obj.height = scaley * height;

        obj.style.display = "";
    }
    obj.src = href;
}
function animate(opts){
    var start = new Date;
    var id = setInterval(function(){
        var timePassed = new Date - start;
        var progress = timePassed / opts.duration;
        if (progress > 1){
            progress = 1;
        }
        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1){
            clearInterval(id);
            opts.callback();
        }
    }, opts.delay || 17);
    //return id;
}

ImageSlider.prototype.changeWindowSize = function(){
    var temp  = this.ul.style.left-this.left
    this.left = (window.innerWidth*0.8-this.imageWidth)/2;
    this.ul.style.left = parseInt(temp+this.left)+'px';
}

ImageSlider.prototype.slideTo = function(imageToGo){
    var instance = this;
    var direction;
    var numOfImageToGo = Math.abs(imageToGo - this.currentImage);
    // slide toward left

    direction = this.currentImage > imageToGo ? 1 : -1;
    this.currentPostion = -1 * this.currentImage * this.imageWidth;
    var opts = {
        duration:500,
        delta:function(p){return p;},
        step:function(delta){
            instance.ul.style.left = parseInt(instance.currentPostion + direction * delta * instance.imageWidth * numOfImageToGo+instance.left) + 'px';
            if(delta>=0.5)
            {
                instance.li_items[instance.currentImage].style.opacity=1.5-delta;
                instance.li_items[imageToGo].style.opacity = delta;
            }
            for(i=1 ; i<instance.li_items[imageToGo].children.length ; i++){
                instance.li_items[instance.currentImage].children[i].style.visibility = "hidden";
                instance.li_items[imageToGo].children[i].style.visibility = "visible";
            }
        },
        callback:function(){
            instance.currentImage = imageToGo;
        }
    };
    animate(opts);
}

ImageSlider.prototype.onClickPrev = function(){
    if (this.currentImage == 0){
        this.slideTo(this.imageNumber - 1);
    }
    else{
        this.slideTo(this.currentImage - 1);
    }
}

ImageSlider.prototype.onClickNext = function(){
    if (this.currentImage == this.imageNumber - 1){
        this.slideTo(0);
    }
    else{
        this.slideTo(this.currentImage + 1);
    }
}
