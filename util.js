const request   = require('request');
const Datastore = require('nedb');

const db = new Datastore();

module.exports.get = function (url, opt = {}) {
    return new Promise((r, j) => {
        request.get(url, opt, (err, res, body) => {
            if (err) {
                j(err);
                return;
            }
            r(body);
        });
    });
};

module.exports.post = function (url, opt = {}) {
    return new Promise((r, j) => {
        request.post(url, opt, (err, res, body) => {
            if (err) {
                j(err);
                return;
            }
            r(body);
        });
    });
};

module.exports.saveRecord = function (obj) {
    // 兼容不同的数据结构，确保 subscription 对象存在
    let subscription = obj.subscription || obj;
    // 如果 obj 本身就是 subscription 对象（包含 endpoint），则直接使用
    if (!subscription.endpoint && obj.endpoint) {
        subscription = obj;
    }

    return new Promise((r, j) => {
        if (!subscription || !subscription.endpoint) {
             console.log('无效的订阅对象');
             return r(obj);
        }
        
        db.findOne({'endpoint': subscription.endpoint}, (err, res) => {
            if (err) {
                j(err);
                return;
            }
            if (res) {
                console.log('已存在');
                db.update({'endpoint': subscription.endpoint}, subscription, {}, err => {
                    if (err) {
                        j(err);
                        return;
                    }
                    r(obj);
                });
                return;
            }
            db.insert(subscription, (err, item) => {
                if (err) {
                    j(err);
                    return;
                }
                console.log('存储完毕');                
                r(obj);
            });
        });
    });
};

module.exports.findAll = function () {
    return new Promise((r, j) => {
        db.find({}, (err, list) => {
            if (err) {
                j(err);
                return;
            }
            r(list);
        });
    });
};

module.exports.find = function (query) {
    return new Promise((r, j) => {
        db.find(query, (err, list) => {
            if (err) {
                j(err);
                return;
            }
            r(list);
        });
    });
};

module.exports.remove = function (obj) {
    return new Promise((r, j) => {
        db.remove(obj, {multi: true}, (err, num) => {
            if (err) {
                j(err);
                return;
            }
            r(num);
        });
    });
};