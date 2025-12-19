import "reflect-metadata"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"




//configure the dotenv
dotenv.config()

//instance of express
const app=express()

//middlewares
app.use(express.json())//for parsing application/json3
app.use(express.urlencoded({extended:true}))// for parsing application/x-www-form-urlencoded
app.use(cookieParser()) || 3000

//CORS configuration
app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,PUT,DELETE,POST,PATCH",
    credentials:true
}))




const port =process.env.PORT 

app.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
})