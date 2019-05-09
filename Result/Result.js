module.exports={
    success(ctx,content){
        ctx.response.type = 'json';
        ctx.response.body=JSON.stringify({
            status:true,
            content:content
        });

        return ctx;
    },
    error(ctx,error){
        console.log(error);
        ctx.response.type = 'json';
        ctx.response.body=JSON.stringify({
            status:false,
            errorMsg:error && error.message || error
        });

        return ctx;
    }
}