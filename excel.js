const excel = require('excel').default;
const fs = require('fs');

const router = require('koa-router')();
const path = require('path');
const Result = require('./Result/Result');

const CONFIG = require(path.resolve(process.cwd(), './package.json'));


router.get('/excel/get', async (ctx, next) => {

    try {
        const filename = `${ctx.request.query.filename}.xlsx`;
        const filepath = path.resolve(process.cwd(), path.join(CONFIG.DATASOURCE, filename));
        const filter = ctx.request.query.filter;

        if (fs.existsSync(filepath)) {
            const timeout = setTimeout(() => Result.error(ctx, {
                message: '读取文件超时'
            }), CONFIG.TIMEOUT);

            const content = await excel(filepath);

            if (filter && content && content.constructor == Array) {
                try {
                    let _content = [];
                    for (let i = 0; i < content.length; i++) {
                        let x = eval(`(${filter})(${content[i]},${i})`);
                        if (x != false) {
                            _content.push(x);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }

            clearTimeout(timeout);

            Result.success(ctx, {
                content
            });


        } else {
            Result.error(ctx, {
                message: '找不到文件'
            });
        }
    } catch (e) {
        Result.error(ctx, e)
    }
});

router.post('/excel/post', async (ctx, next) => {
    Result.success(ctx, {
        content: 'Hello Post'
    })
})

module.exports = router;