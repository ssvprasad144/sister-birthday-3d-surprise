import React,{useState}from"react";
import{ArrowLeft,Camera,Check,Copy,ExternalLink,Image as ImageIcon,Upload}from"lucide-react";
import "./admin.css";
const slots=[
{id:"memory-1",label:"Memory 01",description:"Childhood / early years"},
{id:"memory-2",label:"Memory 02",description:"Growing up"},
{id:"memory-3",label:"Memory 03",description:"Special moments"},
{id:"memory-4",label:"Memory 04",description:"Today"},
{id:"final",label:"Final photo",description:"Birthday finale"}
];
export default function Admin(){
 const[previews,setPreviews]=useState({}),[status,setStatus]=useState(""),[drag,setDrag]=useState(null);
 const select=(slot,files)=>{const file=files?.[0];if(!file||!file.type.startsWith("image/"))return;setPreviews(p=>({...p,[slot.id]:URL.createObjectURL(file)}));setStatus("Ready: "+slot.id+".jpg");};
 const copy=async(id)=>{await navigator.clipboard?.writeText("public/photos/"+id+".jpg");setStatus("Copied public/photos/"+id+".jpg");};
 return <div className="admin-page"><div className="admin-shell">
  <header className="admin-head"><div><span className="admin-kicker">BIRTHDAY EXPERIENCE · ADMIN</span><h1>Photo Studio</h1><p>Choose the photos first, then place the same files in GitHub.</p></div><a href="./" className="back"><ArrowLeft size={15}/> View experience</a></header>
  <div className="admin-note"><Check size={17}/><div><b>GitHub is the permanent photo storage.</b><span>This panel previews and prepares the slots. It never asks for your GitHub password or token.</span></div></div>
  <section className="admin-grid">{slots.map(slot=><article className="upload-card" key={slot.id}><div className="card-top"><div><span>{slot.label}</span><h2>{slot.description}</h2></div><Camera size={19}/></div>
   <label className={"drop "+(drag===slot.id?"drag":"")} onDragEnter={()=>setDrag(slot.id)} onDragLeave={()=>setDrag(null)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();setDrag(null);select(slot,e.dataTransfer.files)}}>
    {previews[slot.id]?<img src={previews[slot.id]} alt={slot.description}/>:<><ImageIcon size={30}/><b>Choose photo</b><small>or drag & drop</small></>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>select(slot,e.target.files)}/>
   </label><div className="filename"><code>{slot.id}.jpg</code><button onClick={()=>copy(slot.id)}><Copy size={14}/></button></div><div className="upload-hint"><Upload size={13}/> GitHub: <code>public/photos/{slot.id}.jpg</code></div>
  </article>)}</section>
  {status&&<div className="admin-status"><Check size={16}/>{status}</div>}
  <section className="github-steps"><div className="steps-title">Publish the photos</div><ol><li>Open <code>public/photos</code> in GitHub.</li><li>Click <b>Add file → Upload files</b>.</li><li>Upload these exact names: <code>memory-1.jpg</code>, <code>memory-2.jpg</code>, <code>memory-3.jpg</code>, <code>memory-4.jpg</code>, <code>final.jpg</code>.</li><li>Commit to <code>main</code>.</li><li>GitHub Pages automatically rebuilds the site.</li></ol><a href="https://github.com/ssvprasad144/sister-birthday-3d-surprise/tree/main/public/photos" target="_blank" rel="noreferrer">Open GitHub photo folder <ExternalLink size={14}/></a></section>
 </div></div>
}