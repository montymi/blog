import{r as E,a as u,j as o,_ as c,u as P,T as y,R as _,D as b,b as M,c as m,d,e as R,f as S,g as D}from"./index-Di_EECYp.js";import{H as k}from"./index.esm-j0Jn8Jip.js";import"./index-BdYws9GV.js";var x,l=E;x=l.createRoot,l.hydrateRoot;const v=u.createContext(null);function g(){return u.useContext(v)}const C=typeof Symbol=="function"&&Symbol.for,H=C?Symbol.for("mui.nested"):"__THEME_NESTED__";function $(e,t){return typeof t=="function"?t(e):c({},e,t)}function B(e){const{children:t,theme:r}=e,n=g(),a=u.useMemo(()=>{const s=n===null?r:$(n,r);return s!=null&&(s[H]=n!==null),s},[r,n]);return o.jsx(v.Provider,{value:a,children:t})}const f={};function h(e,t,r,n=!1){return u.useMemo(()=>{const a=e&&t[e]||t;if(typeof r=="function"){const s=r(a),i=e?c({},t,{[e]:s}):s;return n?()=>i:i}return e?c({},t,{[e]:r}):c({},t,r)},[e,t,r,n])}function L(e){const{children:t,theme:r,themeId:n}=e,a=P(f),s=g()||f,i=h(n,a,r),T=h(n,s,r,!0),j=i.direction==="rtl";return o.jsx(B,{theme:T,children:o.jsx(y.Provider,{value:i,children:o.jsx(_,{value:j,children:o.jsx(b,{value:i==null?void 0:i.components,children:t})})})})}const O=["theme"];function w(e){let{theme:t}=e,r=M(e,O);const n=t[m];return o.jsx(L,c({},r,{themeId:n?m:void 0,theme:n||t}))}const p={palette:{background:{default:"#fafafa",paper:"#fff"}},components:{MuiButtonBase:{defaultProps:{disableRipple:!0}},MuiDivider:{styleOverrides:{vertical:{marginRight:10,marginLeft:10},middle:{marginTop:10,marginBottom:10,width:"80%"}}}}},N={light:d(p,{palette:{mode:"light",background:{default:"#fafafa",paper:"#fff"},primary:{main:"#3f51b5"}}}),dark:d(p,{palette:{mode:"dark",background:{default:"#111",paper:"#171717"},primary:{main:"#333"}}})};function V({children:e}){const[t]=R();return o.jsx(w,{theme:S(N[t]),children:e})}const W=document.getElementById("root"),Y=x(W);function F(e){Y.render(o.jsx(u.StrictMode,{children:o.jsx(D,{children:o.jsx(k,{children:o.jsx(V,{children:o.jsx(e,{})})})})}))}export{F as default};
