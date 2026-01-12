const mongoose = require('mongoose');

let isConnected = false;


async function dbConnect() { 
    if(isConnected){
        console.log("Already Connected to DB");
        return;
    }

    console.log(process.env.MONGODB_URI)
    try{
        const touch = await mongoose.connect(process.env.MONGODB_URI,{
            dbName:'EasFarm',
        });
        isConnected = touch.connections[0].readyState === 1;
        console.log(`MongoDB connected: ${touch.connections[0].host}`);
    }
    catch(error){
        console.error("Mongodb Connection Error", error.message);
        process.exit(1);
    }
}
module.exports = dbConnect;








// export {dbConnect};
// https://chatgpt.com/c/689db865-54fc-832c-9b86-0953abae2bd6 
// https://chatgpt.com/c/689b853e-03d4-8324-bf37-23a075f639ed
// https://chatgpt.com/c/689eb73e-8c60-8327-94c2-db93e19bb4ba
// to put here export in function , this is not syntax of common Js;
