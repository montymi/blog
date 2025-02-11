import{E as b,j as e,a7 as u,a as l,f as g}from"./mui-vendor-CtzqAcQ0.js";import{r as m}from"./react-vendor-CCVJ8uki.js";import{b as f,m as w,M as j}from"./index-JPE1Lxr3.js";import"./___vite-browser-external_commonjs-proxy-CtPASe7f.js";typeof window<"u"&&(window.Buffer=f.Buffer);const k=()=>{const[r,a]=m.useState([]);return m.useEffect(()=>{async function n(){try{const o=await fetch("/posts/posts.json");if(!o.ok)throw new Error(`Error fetching posts: ${o.statusText}`);const i=await o.json();console.log("Fetched files:",i.posts);const c=i.posts,h=await Promise.all(c.map(async t=>{const s=await fetch(`/posts/${t}`);if(!s.ok)throw new Error(`Error fetching post file: ${s.statusText}`);const d=await s.text(),{data:p,content:x}=w(d);return{id:p.id,title:p.title,date:p.date,content:x}}));a(h)}catch(o){console.error(o)}}n()},[]),r},C=()=>{const r=k(),a=b(),n=30,[o,i]=m.useState(null),c=t=>{i(o===t?null:t)},h=(t,s)=>{const d=t.split(" ");return d.length>n&&!s?`${d.slice(0,n).join(" ")}...

*Click to read more!*`:t};return e.jsxs(u,{maxWidth:"md",style:{padding:"2em"},children:[e.jsx("div",{className:"blog-header",style:{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.5em"},children:e.jsx(l,{variant:"h5",sx:{margin:0,padding:0},children:"Blog & Updates"})}),e.jsx(g,{title:"Stay tuned for the latest news and posts!",children:e.jsx("div",{style:{marginBottom:"2em"},children:r.length>0?r.map(t=>e.jsxs("div",{className:"hover-box",style:{padding:"1.5em",marginBottom:"1.5em",borderRadius:"8px",backgroundColor:a.palette.background?a.palette.background.paper:"defaultColor",transition:"all 0.3s ease",cursor:"pointer"},onClick:()=>c(t.id),children:[e.jsx(l,{variant:"body2",sx:{marginBottom:"0.5em"},children:new Date(t.date).toLocaleDateString()}),e.jsx(l,{variant:"body2",sx:{lineHeight:"1.75em"},children:e.jsx(j,{children:h(t.content,o===t.id)})})]},t.id)):e.jsx(l,{variant:"body1",sx:{textAlign:"center",marginTop:"2em"},children:"No posts available. Please check back later!"})})}),e.jsx("style",{children:`
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
        `})]})};export{C as default};
