import{x as M,b as F,_ as s,B as W,t as B}from"./index-Di_EECYp.js";import{$ as I,a0 as q}from"./App-BxzvoGHx.js";const z=["ownerState"],G=["variants"],H=["name","slot","skipVariantsResolver","skipSx","overridesResolver"];function J(e){return Object.keys(e).length===0}function K(e){return typeof e=="string"&&e.charCodeAt(0)>96}function A(e){return e!=="ownerState"&&e!=="theme"&&e!=="sx"&&e!=="as"}const Q=M(),U=e=>e&&e.charAt(0).toLowerCase()+e.slice(1);function _({defaultTheme:e,theme:n,themeId:t}){return J(n)?e:n[t]||n}function X(e){return e?(n,t)=>t[e]:null}function x(e,n){let{ownerState:t}=n,d=F(n,z);const l=typeof e=="function"?e(s({ownerState:t},d)):e;if(Array.isArray(l))return l.flatMap(h=>x(h,s({ownerState:t},d)));if(l&&typeof l=="object"&&Array.isArray(l.variants)){const{variants:h=[]}=l;let m=F(l,G);return h.forEach(r=>{let i=!0;typeof r.props=="function"?i=r.props(s({ownerState:t},d,t)):Object.keys(r.props).forEach(p=>{(t==null?void 0:t[p])!==r.props[p]&&d[p]!==r.props[p]&&(i=!1)}),i&&(Array.isArray(m)||(m=[m]),m.push(typeof r.style=="function"?r.style(s({ownerState:t},d,t)):r.style))}),m}return l}function Y(e={}){const{themeId:n,defaultTheme:t=Q,rootShouldForwardProp:d=A,slotShouldForwardProp:l=A}=e,h=c=>W(s({},c,{theme:_(s({},c,{defaultTheme:t,themeId:n}))}));return h.__mui_systemSx=!0,(c,m={})=>{I(c,o=>o.filter(a=>!(a!=null&&a.__mui_systemSx)));const{name:r,slot:i,skipVariantsResolver:p,skipSx:T,overridesResolver:k=X(U(i))}=m,V=F(m,H),E=p!==void 0?p:i&&i!=="Root"&&i!=="root"||!1,N=T||!1;let L,v=A;i==="Root"||i==="root"?v=d:i?v=l:K(c)&&(v=void 0);const R=q(c,s({shouldForwardProp:v,label:L},V)),C=o=>typeof o=="function"&&o.__emotion_real!==o||B(o)?a=>x(o,s({},a,{theme:_({theme:a.theme,defaultTheme:t,themeId:n})})):o,P=(o,...a)=>{let O=C(o);const y=a?a.map(C):[];r&&k&&y.push(f=>{const u=_(s({},f,{defaultTheme:t,themeId:n}));if(!u.components||!u.components[r]||!u.components[r].styleOverrides)return null;const S=u.components[r].styleOverrides,w={};return Object.entries(S).forEach(([$,D])=>{w[$]=x(D,s({},f,{theme:u}))}),k(f,w)}),r&&!E&&y.push(f=>{var u;const S=_(s({},f,{defaultTheme:t,themeId:n})),w=S==null||(u=S.components)==null||(u=u[r])==null?void 0:u.variants;return x({variants:w},s({},f,{theme:S}))}),N||y.push(h);const b=y.length-a.length;if(Array.isArray(o)&&b>0){const f=new Array(b).fill("");O=[...o,...f],O.raw=[...o.raw,...f]}const j=R(O,...y);return c.muiName&&(j.muiName=c.muiName),j};return R.withConfig&&(P.withConfig=R.withConfig),P}}const ee=Y();export{ee as s};
