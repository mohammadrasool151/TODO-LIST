const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi');
const app = express()
/* env configuration */
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
/* mangoose setup and connection */ 
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>console.log("mongodb connection estabilshed"))
.catch((err)=>console.log(err))

/* create  a schema for todo database */
const todoSchema = new mongoose.Schema({
    caption :   {type: String},
    category : {type:String},
    isCompleted: {type:Boolean},
})

const Store  = mongoose.model('Store',todoSchema);
/* functions */



/* routs */
let items = [];
let filterType = "allItems";
isAllSelected = true;
let count;
async function setCount(){
    items = await Store.find();
    count=items.filter((ele)=>{
        return ele.isCompleted===false;
    }).length;
}

app.post('/add', async(req, res) => { 
    const schema = Joi.object().keys({
        caption  : Joi.string().required()
    })
    const { error, value } = schema.validate({caption:req.body.caption});
    
    if(error){
        res.send('<h1>invalid input!</h1>')
    }
    else{
        // console.log(req.body.catogery)

        const obj = new Store({
            caption :  req.body.caption, 
            category : req.body.category,
            isCompleted:false
         })
         collection = await obj.save();
         
      res.redirect(`/${filterType}`);
      filterType="allItems"
    }
    
 
  })
  app.get('/',async(req,res)=>{
    items = await Store.find();
    filterType="allItems"
    res.render("ExpressTodo.ejs", {task:items,task2:[],count:count,filterType:filterType})
     
  setCount();
    
  })
  app.get('/allItems',async(req,res)=>{
      items = await Store.find();

      let true_items = items.filter((ele)=>{
          return ele.isCompleted===true;
      })
      let false_items = items.filter((ele)=>{
        return ele.isCompleted===false;
    })
      filterType="allItems"
      res.render("ExpressTodo.ejs", {task:true_items,task2:false_items,count:count,filterType:filterType})
     
     setCount();
  })
  app.get('/delete/:id',async(req,res)=>{
      const result = await Store.deleteOne({_id : req.params.id})
      setCount();
      res.redirect(`/${filterType}`);
       
  })
 app.get('/update/:id',async(req,res)=>{
    const item = await  Store.findById(req.params.id);
    item.isCompleted = !item.isCompleted;
    const result = await item.save();
    res.redirect(`/${filterType}`); 
   setCount();
 })
 app.get('/complete', async(req,res)=>{
    items = await Store.find();
    let completedItems  = items.filter((ele)=>{
        return ele.isCompleted===true;
    })
    await setCount();
    filterType="complete"
    res.render("ExpressTodo.ejs",{task:completedItems,task2:[],count:count,filterType:filterType})
  
    
 })
 app.get('/active', async(req,res)=>{
    items = await Store.find();
    let activateItems  = items.filter((ele)=>{
        return ele.isCompleted===false;
    })
    await setCount();
    filterType="active"
    res.render("ExpressTodo.ejs",{task:activateItems,task2:[],count:count,filterType:filterType})
   
 
 })
 app.get('/work', async(req,res)=>{
    items = await Store.find({category:"work"});
   let activateItems = items
    await setCount();
    filterType="work"
    res.render("ExpressTodo.ejs",{task:activateItems,task2:[],count:count,filterType:filterType})
 
 })
 app.get('/personal', async(req,res)=>{
    items = await Store.find({category:"personal"});
   let activateItems = items
    await setCount();
    filterType="personal"
    res.render("ExpressTodo.ejs",{task:[],task2:activateItems,count:count,filterType:filterType})
 
 })
 app.get('/college', async(req,res)=>{
    items = await Store.find({category:"college"});
   let activateItems = items
    await setCount();
    filterType="college"
    res.render("ExpressTodo.ejs",{task:activateItems,task2:[],count:count,filterType:filterType})
     
   
 })
 app.get('/clearCompleted',async (req,res)=>{
    const result = await Store.deleteMany({isCompleted:true});
    res.redirect(`/${filterType}`); 
 })
 app.get('/selectAll',async (req,res)=>{
    items = await Store.find();
    let items = items.map((ele)=>{
        return ele.isCompleted===true;
    })
    console.log(items)
   res.render("ExpressTodo.ejs",{task:completedItems,task2:[],count:count,filterType:filterType})
    res.redirect(`/${filterType}`); 
    res.send("helo")
 })
app.listen(5300)