import{o as g,g as c,i as o,u as f,t as d,a as u}from"./web.CAOUEYuq.js";import{g as l}from"./index.DjKJqAo0.js";import{S as m}from"./ScrollTrigger.DJCkYK2h.js";import"./_commonjsHelpers.BosuxZz1.js";var p=d("<div><div class=trans-line><div class=trans-line-above></div><div class=trans-line-under>");const x=r=>{let e;return g((()=>{if(!e)return;l.registerPlugin(m.ScrollTrigger);const t=l.utils.selector(e);console.log(e.offsetHeight);let i=l.timeline({scrollTrigger:{trigger:e,start:"top bottom",end:`bottom top+=${window.innerHeight/2+e.offsetHeight}`,scrub:1.1,...r.triggerOpts}});i.fromTo([t(".trans-line-above"),t(".trans-line-under")],{yPercent:0},{yPercent:100,ease:"linear",duration:1}),u((()=>i.kill()))})),t=c(p),i=t.firstChild.firstChild,s=i.nextSibling,"function"==typeof e?f(e,t):e=t,o(i,(()=>r.children)),o(s,(()=>r.children)),t;var t,i,s};export{x as default};