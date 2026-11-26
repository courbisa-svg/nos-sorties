// RSS/Atom collector prototype. Protect the endpoint with COLLECTOR_TOKEN.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const sources = [
 {name:"Google News - Alpes-Maritimes events",url:"https://news.google.com/rss/search?q=agenda+%C3%A9v%C3%A9nements+Alpes-Maritimes&hl=fr&gl=FR&ceid=FR:fr"},
 {name:"Google News - Var events",url:"https://news.google.com/rss/search?q=agenda+%C3%A9v%C3%A9nements+Var+83&hl=fr&gl=FR&ceid=FR:fr"},
 {name:"Google News - Monaco events",url:"https://news.google.com/rss/search?q=agenda+%C3%A9v%C3%A9nements+Monaco&hl=fr&gl=MC&ceid=MC:fr"},
 {name:"Google News - automobile rallies",url:"https://news.google.com/rss/search?q=rallye+%C3%A9v%C3%A9nement+06+83+Monaco&hl=fr&gl=FR&ceid=FR:fr"}
];
const places=["nice","cannes","antibes","grasse","menton","monaco","monte-carlo","beausoleil","cap-d'ail","eze","Èze","villeneuve-loubet","cagnes-sur-mer","saint-laurent-du-var","vence","mougins","valbonne","biot","theoule","mandelieu","isola","auron","valberg","saint-vallier","sospel","la bollene-vesubie","moulinet","drap","carros","gilette","contes","roquebrune-cap-martin","la turbie","frejus","fréjus","saint-raphael","saint-raphaël","toulon","hyères","hyeres","brignoles","draguignan","le luc","cuers","pierrefeu","la valette","la garde","bandol","sanary","six-fours","cavalaire","sainte-maxime","le lavandou","bormes","cotignac","callian","fayence","les arcs","vidauban","lorgues","flassans","puget"];
function decode(s:string){return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/<[^>]*>/g,"").trim();}
function tag(block:string,names:string[]){for(const n of names){const m=block.match(new RegExp("<"+n+"[^>]*>([\\s\\S]*?)</"+n+">","i"));if(m)return decode(m[1]);}return "";}
function parseItems(xml:string){const blocks=xml.match(/<(item|entry)\b[\s\S]*?<\/(item|entry)>/gi)||[];return blocks.map(b=>({title:tag(b,["title"]),description:tag(b,["description","summary","content"]),date:tag(b,["pubDate","published","updated"]),url:(tag(b,["link","guid"])||b.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]||"").trim()}));}
function area(text:string){const t=text.toLowerCase();const found=places.find(p=>t.includes(p.toLowerCase()));if(!found)return null;return found==="monaco"||found==="monte-carlo"?"MC":(["frejus","fréjus","toulon","hyères","hyeres","brignoles","draguignan","bandol","sanary","six-fours","cavalaire","sainte-maxime","le lavandou","bormes","cuers","pierrefeu","la garde","le luc","vidauban","lorgues","flassans","puget"].includes(found)?"83":"06");}
function dateValue(s:string){if(!s)return null;const d=new Date(s);return isNaN(d.getTime())?null:d.toISOString().slice(0,10);}
Deno.serve(async(req)=>{
 if(req.method!=="POST")return new Response("POST only",{status:405});
 const token=Deno.env.get("COLLECTOR_TOKEN");if(!token||req.headers.get("x-collector-token")!==token)return new Response("Unauthorized",{status:401});
 const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 let processed=0,ignored=0;const errors:string[]=[];
 for(const src of sources){try{
  const res=await fetch(src.url,{headers:{"User-Agent":"NosSorties/1.0 event feed reader"}});if(!res.ok)throw new Error("HTTP "+res.status);
  for(const item of parseItems(await res.text())){const dept=area(item.title+" "+item.description);if(!dept||!item.title||!item.url){ignored++;continue;}
   const d=dateValue(item.date);const row={id:"rss-"+btoa(item.url).replace(/[^a-z0-9]/gi,"").slice(0,40),title:item.title,start_date:d,end_date:d,dept,category:/rally|auto|voiture|wrc/i.test(item.title)?"auto":"autre",description:item.description.slice(0,1200),url:item.url,source_name:src.name,source_url:src.url,last_seen_at:new Date().toISOString()};
   const {error}=await supabase.from("events_auto").upsert(row,{onConflict:"url"});if(error)throw error;processed++;
  }
 }catch(e){errors.push(src.name+": "+String(e));}}
 return new Response(JSON.stringify({ok:errors.length===0,processed,ignored,errors,updatedAt:new Date().toISOString()},null,2),{headers:{"Content-Type":"application/json"}});
});
