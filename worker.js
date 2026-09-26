export default {
 async fetch(request, env) {
  const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type,x-app-password","Access-Control-Allow-Methods":"POST,OPTIONS"};
  if(request.method==="OPTIONS")return new Response(null,{headers:cors});
  if(request.method!=="POST")return json({error:"POST only"},405,cors);
  if(request.headers.get("x-app-password")!==env.APP_PASSWORD)return json({error:"Unauthorized"},401,cors);
  try{
   const {a,b}=await request.json();
   if(typeof a!=="string"||typeof b!=="string"||!a.trim()||!b.trim())return json({error:"A and B are required"},400,cors);
   const r=await fetch("https://api.typesafe.ai/v1/systemone",{
    method:"POST",
    headers:{"Authorization":"Bearer "+env.JEV_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({model:"jev-latest",state:a.trim(),questions:{relation:{type:"noul",instructions:"Can the given state reasonably be described as or classified as: "+b.trim()+"?"}}})
   });
   const data=await r.json();
   if(!r.ok)return json({error:data?.detail||"Jev API error"},r.status,cors);
   return json({probability:data.answers.relation.noul,model:data.model},200,cors);
  }catch(e){return json({error:e.message||"Server error"},500,cors)}
 }
};
function json(data,status,headers){return new Response(JSON.stringify(data),{status,headers:{...headers,"Content-Type":"application/json"}})}
