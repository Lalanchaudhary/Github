const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const http=require("http");
const body_parser=require("body-parser");
const {Server} =require("socket.io");
const MainRouter=require("./routes/MainRoutes")
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const init = require("./controller/init")
const addRepo = require("./controller/add")
const commit=require("./controller/commit")
const firebaseSdk=require('./config/firebaseSdk');
const push = require('./controller/push');
const { pullRepo } = require('./controller/pull');
const { default: mongoose } = require("mongoose");

dotenv.config()


yargs(hideBin(process.argv))
.command("start", "Server start command", {}, ServerStart)
    .command("init", "Your repo is initalize", {}, init)
    .command("add <file>", "Add a file to repository", (yargs) => {
        yargs.positional("file", {
            describe: "File to add the stagging area",
            type: "string"
        })
    }, (argv) => {
        addRepo(argv.file);
    })
    .command("commit <message>","commit the staged file",
        (yargs)=>{
            yargs.positional("commit",{
                describe:"Commit message",
                type:"string"
            });
        },(argv)=>{
            commit(argv.message)
        }
    )
    .command("push","push all the commits in firebase",{},push)
    .command("pull","Pull the all files",{},pullRepo)
    .demandCommand(1, "you need to add atleast one command")
    .help().argv



    function ServerStart()
    {
        const app=express();
        app.use(cors({origin:"*"}));
        app.use(body_parser.json());
        app.use(express.json());
        app.use(MainRouter);
        const PORT=process.env.PORT || 9000;
        const MongoUri=process.env.MONGODB_URI;

        mongoose.connect(MongoUri).then(()=>{
            console.log('====================================');
            console.log("MongoDb Connected successfully");
            console.log('====================================');
        })
        .catch((err)=>{
            console.error("Error occured at connection Database",err)
        })
       

        let user="test";
        const httpServer=http.createServer(app);

        const io=new Server(httpServer,{
            cors:{
                origin:"*",
                methods:["GET","POST"]
            }
        })

        io.on("connection",(socket)=>{
            socket.on("join room",(userId)=>{
                user=userId;
                console.log('====================================');
                console.log(user);
                console.log('====================================');
                socket.join(userId)
            })
        })

        const db=mongoose.connection;

        db.once("open",async()=>{
            console.log('====================================');
            console.log("CRUD operation called");
            console.log('====================================');
        })

        httpServer.listen(PORT,()=>{
            console.log(`Server start at port ${PORT}`);
        })
    }