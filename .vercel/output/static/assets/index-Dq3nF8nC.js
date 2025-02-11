import{a as h,j as e}from"./index-Di_EECYp.js";import{b,m as u,M as g}from"./index-3OUufB4H.js";import{A as f,T as l,E as w}from"./App-BxzvoGHx.js";import{C as j}from"./Container-CxsRkmxQ.js";import"./index-BdYws9GV.js";import"./___vite-browser-external_commonjs-proxy-D45grg_z.js";import"./styled-Cepef8R1.js";typeof window<"u"&&(window.Buffer=b.Buffer);const k=()=>{const[s,a]=h.useState([]);return h.useEffect(()=>{async function n(){try{const o=await fetch("/posts/posts.json");if(!o.ok)throw new Error(`Error fetching posts: ${o.statusText}`);const i=await o.json();console.log("Fetched files:",i.posts);const c=i.posts,p=await Promise.all(c.map(async t=>{const r=await fetch(`/posts/${t}`);if(!r.ok)throw new Error(`Error fetching post file: ${r.statusText}`);const d=await r.text(),{data:m,content:x}=u(d);return{id:m.id,title:m.title,date:m.date,content:x}}));a(p)}catch(o){console.error(o)}}n()},[]),s},S=()=>{const s=k(),a=f(),n=30,[o,i]=h.useState(null),c=t=>{i(o===t?null:t)},p=(t,r)=>{const d=t.split(" ");return d.length>n&&!r?`${d.slice(0,n).join(" ")}...

*Click to read more!*`:t};return e.jsxs(j,{maxWidth:"md",style:{padding:"2em"},children:[e.jsx("div",{className:"blog-header",style:{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5em"},children:e.jsx(l,{variant:"h5",sx:{margin:0,padding:0},children:"Blog & Updates"})}),e.jsx(w,{title:"Stay tuned for the latest news and posts!",children:e.jsx("div",{style:{marginBottom:"2em"},children:s.length>0?s.map(t=>e.jsxs("div",{className:"hover-box",style:{padding:"1.5em",marginBottom:"1.5em",borderRadius:"8px",backgroundColor:a.palette.background?a.palette.background.paper:"defaultColor",transition:"all 0.3s ease",cursor:"pointer"},onClick:()=>c(t.id),children:[e.jsx(l,{variant:"body2",sx:{marginBottom:"0.5em"},children:new Date(t.date).toLocaleDateString()}),e.jsx(l,{variant:"body2",sx:{lineHeight:"1.75em"},children:e.jsx(g,{children:p(t.content,o===t.id)})})]},t.id)):e.jsx(l,{variant:"body1",sx:{textAlign:"center",marginTop:"2em"},children:"No posts available. Please check back later!"})})}),e.jsx("style",{children:`
          .hover-box:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
          }
          /* Mobile devices and below */
          @media (max-width: 600px) {
            .blog-container {
              width: 100% !important; /* Full width on small screens */
              max-width: 100% !important;
            }
          }
          /* Webkit browsers */
          ::-webkit-scrollbar {
            width: 5px; /* Adjust width */
            height: 5px; /* Adjust height */
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.5); /* Scrollbar thumb color */
            border-radius: 10px; /* Rounded edges */
          }
          ::-webkit-scrollbar-track {
            background: transparent; /* Track background color */
          }
          /* For Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.5) transparent;
          }
        `})]})};export{S as default};
