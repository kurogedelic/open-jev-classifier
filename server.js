import http from "node:http";
import fs from "node:fs/promises";

await loadEnv();
const port=process.env.PORT||3000;

http.createServer(async(req,res)=>{
 if(req.method==="GET"&&(req.url==="/"||req.url==="/index.html")){
  return send(res,200,await fs.readFile("index.html"),"text/html; charset=utf-8");
 }
 if(req.method==="POST"&&req.url==="/api/classify"){
  try{
   const {a,b}=JSON.parse(await body(req));
   if(!a?.trim()||!b?.trim())return json(res,400,{error:"A and B are required"});
   if(!process.env.JEV_API_KEY)return json(res,500,{error:"JEV_API_KEY is missing in .env"});
   const r=await fetch("https://api.typesafe.ai/v1/systemone",{method:"POST",headers:{Authorization:"Bearer "+process.env.JEV_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"jev-latest",state:a.trim(),questions:{relation:{type:"noul",instructions:"Can the given state reasonably be described as or classified as: "+b.trim()+"?"}}})});
   const data=await r.json();
   if(!r.ok)return json(res,r.status,{error:data?.detail||"Jev API error"});
   return json(res,200,{probability:data.answers.relation.noul,model:data.model});
  }catch(e){return json(res,500,{error:e.message})}
 }
 send(res,404,"Not found","text/plain");
}).listen(port,()=>console.log("Open Jev Classifier: http://localhost:"+port));

async function loadEnv(){try{const s=await fs.readFile(".env","utf8");for(const line of s.split(/\r?\n/)){const m=line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^['"]|['"]$/g,"")}}catch{}}
function body(req){return new Promise((ok,no)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>ok(s));req.on("error",no)})}
function json(res,status,data){send(res,status,JSON.stringify(data),"application/json")}
function send(res,status,data,type){res.writeHead(status,{"Content-Type":type});res.end(data)}
