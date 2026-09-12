const express=require('express');const cors=require('cors');const app=express();app.use(cors());app.use(express.json());
const demo={balance:24500,categories:{Food:2400,Shopping:3200,Transport:1800,Bills:4200,Other:2600},recurring:[{name:'Utilities',amount:1800},{name:'Mobile',amount:599}]};
app.get('/api/banks',(req,res)=>res.json(['SBI','HDFC Bank','ICICI Bank','Axis Bank']));
app.post('/api/analyze',(req,res)=>{const d=req.body?.data||demo;const total=Object.values(d.categories).reduce((a,b)=>a+b,0);const high=Object.entries(d.categories).sort((a,b)=>b[1]-a[1])[0];const savings=Math.round(d.categories.Shopping*.2+d.categories.Food*.1);res.json({totalSpending:total,highestCategory:{name:high[0],amount:high[1]},potentialSavings:savings,recurring:d.recurring,recommendation:`You could save about ₹${savings} every month.`})});
app.post('/api/payment/simulate',(req,res)=>res.json({success:true,simulated:true,message:'No real transaction was made.'}));
app.get('/api/dashboard',(req,res)=>res.json(demo));
app.listen(process.env.PORT||3001,()=>console.log('Saarthi backend running'));