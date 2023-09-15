import express from "express";
import conf from "./database/db.js";
import Router from "./routes/api.js";


const app = express();
app.use(express.json())
app.use(Router);
const port = 4000
conf();



app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})