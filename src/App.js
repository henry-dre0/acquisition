import express from "express";

const app = express();
 
app.get("/", (req, res) => {
    res.status(200).send("Hello, Welcome to DRE API!");
})

export default app;