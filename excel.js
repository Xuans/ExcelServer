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

            let content = await excel(filepath);

            if (filter && content && content.constructor == Array) {
                try {
                    let _content = [];
                    for (let i = 0; i < content.length; i++) {
                        let param = JSON.stringify(content[i]);
                        console.log(`(${filter})(${param},${i})`)
                        let x = eval(`(${filter})(${param},${i})`);
                        if (x != false) {
                            _content.push(x);
                        }
                    }
                    content = _content;
                } catch (e) {
                    console.error(e);
                    Result.error(ctx, {
                        message: e.toString(),
                    });
                    return;
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

/**
 * 轮询查询 获取随机数组
 * number:数组长度
 * max:最大值
 * min:最小值
 */
router.get('/excel/poll',async (ctx, next) =>{
    let data = new Array(parseInt(ctx.query.number));
    let max = ctx.query.max? parseInt(ctx.query.max):100;
    let min = ctx.query.min? parseInt(ctx.query.min):0;
    for(let i=0; i<data.length ; i++){
        data[i] = parseInt(Math.random()*(max-min+1)+min,10);
    }
    console.log(data)
    Result.success(ctx, {
        content: data
    })
})

module.exports = router;