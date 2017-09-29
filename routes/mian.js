var express = require('express');
var router = express.Router();
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
/* GET users listing. */
router.get('/', function(req, res, next) {

  // listCartoon 테스트
  var test = [];
  sql.listCartoon(test);
  setTimeout(function(){
    // for (var i = 0; i < test.length; i++) {
    //   console.log('22222222222');
    //   console.log(test[i]);
    // }
    // // check용
    // console.log('22222222222');
    // console.log(test);
    res.render('main', {cartoon:circularStringify(test)});
  }, 2000);

//  res.render('main');
});

module.exports = router;
