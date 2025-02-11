import{a as n,j as t}from"./index-Di_EECYp.js";import{M as m}from"./Meta-DW7EI6uA.js";import{s as l}from"./styled-Cepef8R1.js";import{A as f,T as o}from"./App-BxzvoGHx.js";import"./index-BdYws9GV.js";import"./index.esm-j0Jn8Jip.js";const g=l("div")({display:"grid",borderRadius:"15px",padding:"3em",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))"}),u=l("div")(({flipped:r,theme:i})=>({position:"relative",width:"100%",paddingTop:"100%",cursor:"pointer",perspective:"1000px",zIndex:"1",transition:"all 0.3s ease","&:hover":{scale:"1.25",zIndex:"2"},"& > div":{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",transformStyle:"preserve-3d",transition:"transform 0.5s ease"},"& > .front, & > .back":{position:"absolute",top:0,left:0,width:"100%",height:"100%",padding:"1em",display:"flex",justifyContent:"center",backfaceVisibility:"hidden"},"& > .front":{backgroundColor:i.palette.background.paper,transform:r?"rotateY(180deg)":"rotateY(0deg)",alignItems:"center",textAlign:"center"},"& > .back":{backgroundColor:i.palette.primary.main,overflowY:"auto",alignItems:"flex-start",color:i.palette.primary.contrastText,transform:r?"rotateY(0deg)":"rotateY(-180deg)",textAlign:"left"}})),w=()=>{const[r,i]=n.useState([]),c=f();n.useEffect(()=>{fetch("./activities.json").then(e=>e.json()).then(e=>i(e)).catch(e=>console.error("Error loading activities:",e))},[]);const[d,p]=n.useState(Array(r.length).fill(!1)),h=e=>{p(a=>{const s=[...a];return s[e]=!s[e],s})};return t.jsxs(t.Fragment,{children:[t.jsx(m,{title:"Activity"}),t.jsxs("div",{style:{justifyContent:"flex-start",overflowY:"auto",width:"100%",textAlign:"center",height:"90%",padding:"1em"},children:[t.jsx(o,{variant:"h3",gutterBottom:!0,children:"Activity"}),t.jsx(o,{fontStyle:"italic",color:"text.secondary",children:"A cluster of some activities that take up my time."}),t.jsx(g,{children:r.map((e,a)=>t.jsxs(u,{flipped:d[a],onClick:()=>h(a),theme:c,children:[t.jsx("div",{className:"front",children:t.jsx(o,{variant:"h6",children:e.title})}),t.jsx("div",{className:"back",children:t.jsx(o,{variant:"body2",children:e.description})})]},a))})]}),t.jsx("style",{children:`
              /* Webkit browsers */
              ::-webkit-scrollbar {
                width: 3px; /* Adjust width */
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
            `})]})};export{w as default};
