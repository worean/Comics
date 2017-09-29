/**
 * Created by bgh29 on 2017-07-18.
 */

function Cut(num, imgSrc, like, parent){
    this.num = num;
    this.imgSrc = imgSrc;
    this.like = like;
    this.parent = parent || null;
    this.child = [];
}

function Cartoon(title, like, rootNum, rootImgSrc){
    this.title = title;
    this.like = like;

    this.root = new Cut(rootNum, rootImgSrc, 0);
}

Cut.prototype.addChild = function(num, imgSrc, like) {
    var child = new Cut(num, imgSrc, like, this);
    this.child.push(child);
    return child;
};


function CutList(){
    this._len = 0;
    this.head = null;
}

CutList.prototype.add = function(cutsrc){
    var cut = new Cut(cutsrc);
    var cur = this.head;

    if(!cur){
        this.head = cut;
        this._len++;

        return cut;
    }
    while(cur.next){
        cur = cur.next;
    }
    cur.next = cut;
    this._len++;

    return cut;
}

CutList.prototype.remove = function(position) {
    var cur = this.head,
        len = this._len,
        cnt = 0,
        message = {failure: 'Failure: non-existent node in this list.'},
        pre = null,
        deletedNode = null;

    if (position < 0 || position > len) {
        throw new Error(message.failure);
    }

    if (position === 1) {
        this.head = cur.next;
        deletedNode = cur;
        cur = null;
        this._len--;

        return deletedNode;
    }

    while (cnt < position) {
        pre = cur;
        cur = cur.next;
        cnt++;
    }

    pre.next = cur.next;
    deletedNode = cur;
    cur = null;
    this._len--;

    return deletedNode;
};

CutList.prototype.searchCutAt = function(position) {
    var cur = this.head,
        len = this._len,
        cnt = 1,
        message = {failure: 'Failure: non-existent node in this list.'};

    if (len === 0 || position < 1 || position > len) {
        throw new Error(message.failure);
    }

    while (cnt < position) {
        cur = cur.next;
        cnt++;
    }

    return cur;
};

module.exports = Cartoon;
