const util      = require('./util');
const Koa       = require('koa');
const serve     = require('koa-static');
const Router    = require('koa-router');
const koaBody   = require('koa-body');
const webpush   = require('web-push');

const port = process.env.PORT || 8085;
const app = new Koa();
const router = new Router();

// VAPID keys
const vapidKeys = {
    publicKey: 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A',
    privateKey: 'TVe_nJlciDOn130gFyFYP8UiGxxWd3QdH6C5axXpSgM'
};

webpush.setVapidDetails(
    'mailto:13979788219@163.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/**
 * 提交subscription信息，并保存
 */
router.post('/subscription', koaBody(), async ctx => {
    let body = ctx.request.body;
    await util.saveRecord(body);
    ctx.response.body = { status: 0 };
});

/**
 * 向push service推送信息
 */
function pushMessage(subscription, data = {}) {
    webpush.sendNotification(subscription, data, {}).then(data => {
        console.log('push service response:', JSON.stringify(data));
    }).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
            return util.remove(subscription);
        }
        console.log('Push error:', err);
    });
}

/**
 * 消息推送API
 */
router.post('/push', koaBody(), async ctx => {
    let payload = ctx.request.body;    
    let list = await util.findAll();
    
    list.forEach(subscription => {
        pushMessage(subscription, JSON.stringify(payload));
    });

    ctx.response.body = {
        status: list.length > 0 ? 0 : -1
    };
});

app.use(router.routes());
app.use(serve(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
