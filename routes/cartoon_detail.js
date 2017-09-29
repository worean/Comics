var express = require('express');
var router = express.Router();
var Cartoon = require('../public/javascripts/CartoonModel');
var sql = require('../public/javascripts/CartoonSQL');
function circularStringify(circularObject){
    var cache = [];
    return JSON.stringify(circularObject, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }
            cache.push(value);
        }
        return value;
    });
}
router.get('/', function(req, res, next) {
    console.log(req.query.title);
    console.log(req.query.rootCutNum);

  // makeTree 테스트
  var test = new Cartoon(req.query.title, 1, parseInt(req.query.rootCutNum), "img");
  sql.makeTree(test.root);
  setTimeout(function(){
    console.log(test);
    res.render('detail', {cartoon:circularStringify(test)});
  }, 600);
  
/*
    test = new Cartoon("testComic", 1, "../images/001.jpg");
    test.root.addChild(2, "../images/a.png");
    test.root.addChild(3, "../images/b.png");
    test.root.child[1].addChild(10, "../images/c.png");
    test.root.child[1].child[0].addChild(10, "../images/c.png");
    test.root.child[1].child[0].child[0].addChild(10, "../images/c.png");
    test.root.child[1].child[0].child[0].child[0].addChild(10, "../images/c.png");
    test.root.child[1].child[0].child[0].child[0].child[0].addChild(10, "../images/c.png");
    test.root.child[1].child[0].child[0].child[0].child[0].child[0].addChild(10, "../images/c.png");
    test.root.child[0].addChild(4, "../images/aa.png");
    test.root.child[0].child[0].addChild(5, "../images/ab.png");
    test.root.child[0].child[0].child[0].addChild(6, "../images/ac.png");
    test.root.child[0].child[0].child[0].child[0].addChild(7, "../images/ac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].addChild(8, "../images/aaa.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].addChild(9, "../images/aab.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(15, "../images/aac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(16, "../images/bab.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(17, "../images/bac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(18, "../images/bac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(19, "../images/bba.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(20, "../images/bbb.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(21, "../images/bbc.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(22, "../images/aaaa.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(23, "../images/aaab.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(24, "../images/aaac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(25, "../images/baaa.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(26, "../images/baab.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(27, "../images/baac.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(11, "../images/ba.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0 ].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(12, "../images/bb.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(13, "../images/bc.png");
    test.root.child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].child[0].addChild(14, "../images/bd.png");
*/
    console.log(test);
    // res.render('detail', {please:circularStringify(test)});
});

module.exports = router;
