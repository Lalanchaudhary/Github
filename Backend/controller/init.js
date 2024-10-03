const fs=require("fs").promises;
const path=require("path");

const init=async()=>{
    const repoPath=path.resolve(process.cwd(),".LalanGit");
    const commitPath=path.join(repoPath,"commits");

    try
    {
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitPath,{recursive:true});

        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket:process.env.S3_BUCKET})
        );
        console.log("Repository is initalize!")
    }
    catch(err)
    {
        console.error("Error occured add respository time",err)
    }
}

module.exports=init