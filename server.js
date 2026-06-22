const express=require('express');
const mongoose=require('mongoose');
const devuser=require('./devusermodel');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const middleware=require('./middleware');
const reviewmodel=require('./reviewmodel');
const app=express();

app.use(cors({
    origin:'*'
}))
app.use(express.json()); //helps to convert the json data into JS objects format or req.body is considered as undefined.
mongoose.connect('mongodb://nadagounis_db_user:Shivani18@ac-sishbh2-shard-00-00.nwgdmsv.mongodb.net:27017,ac-sishbh2-shard-00-01.nwgdmsv.mongodb.net:27017,ac-sishbh2-shard-00-02.nwgdmsv.mongodb.net:27017/?ssl=true&replicaSet=atlas-8aqcv6-shard-0&authSource=admin&appName=Cluster1').then(()=>console.log('DB is connected'));

app.get('/',(req,res)=>{
    return res.send("hello world");
})

app.post('/register',async(req,res)=>{
    try{
        const {fullname,email,mobile,skill,password,confirmpassword}=req.body;
        const exist=await devuser.findOne({email});
        if(exist){
            return res.status(400).send('User Already Registered');
        }
        if(password!=confirmpassword){
            return res.status(403).send("Invalid Password");
        }
        let newUser=new devuser({
            fullname,email,mobile,skill,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send("Data is updated to DB Successfully");
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error');
    }
})

app.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        const exist=await devuser.findOne({email});
        if(!exist){
            return res.status(400).send("User Not Found");
        }
        if(exist.password!=password){
            return res.status(400).send("Invalid Password");
        }
        let payload={ //payload is the data that is stored inside the jwt token
            user:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtPassword',{expiresIn:"7d"},
           (err,token)=>{
            if(err) throw err
            return res.json({token})
           } 
        )
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})

app.get('/allprofiles',middleware,async(req,res)=>{
    try{
        let allprofiles=await devuser.find();
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})

app.get('/myprofile',middleware,async(req,res)=>{
    try{
        let user=await devuser.findById(req.user.id);
        return res.json(user);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})

app.post('/addreview',middleware,async(req,res)=>{
    try{
        const{taskworker,rating}=req.body;
        const exist = await devuser.findById(req.user.id);
        const newReview = new reviewmodel({
            taskprovider:exist.fullname,
            taskworker,rating
        })
        newReview.save();
        return res.status(200).send('Review Updated Successfully');
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})

app.get('/myreview',middleware,async(req,res)=>{
    try{
        let allreviews = await reviewmodel.find();
        let myreviews = allreviews.filter(review=>review.taskworker.toString()===req.user.id.toString());
        return res.status(200).json(myreviews);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})

app.listen(5000,()=>console.log("server is running on port 5000"));