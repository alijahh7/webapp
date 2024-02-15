const {app} = require('./index');

const port = process.env.PORT || 8080;


const server = app.listen(port,()=>{
    console.log(`Running on ${port}`);
});

module.exports = server;