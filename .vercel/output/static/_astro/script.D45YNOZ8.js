import{o as i,g as a,u as s,t as p,a as n}from"./web.CAOUEYuq.js";import{g as o}from"./index.DjKJqAo0.js";import{S as m}from"./ScrollTrigger.DJCkYK2h.js";import{S as g}from"./index.C03LSoLi.js";import"./_commonjsHelpers.BosuxZz1.js";var u=p("<div class=divScript>");const h=()=>{let r;return i((()=>{if(!r)return;o.registerPlugin(m.ScrollTrigger);const t=new g(".footer__title",{types:"lines, words",lineClass:"split-line"});let e=o.timeline({scrollTrigger:{trigger:".footer__title",start:"top+=50% bottom",end:"bottom+=100% bottom",scrub:!0}});e.fromTo(t.words,{autoAlpha:0},{autoAlpha:1,duration:5.5,stagger:.4,ease:"linear"});let s=o.timeline({scrollTrigger:{trigger:".home__hero-clone-wrap",start:"top+=30% top",end:"bottom bottom",scrub:!0}});s.fromTo(".home__hero-clone-wrap",{autoAlpha:0,ease:"linear"},{autoAlpha:1,ease:"linear"}),n((()=>{e.kill(),s.kill(),t.isSplit&&t.revert()}))})),t=a(u),"function"==typeof r?s(r,t):r=t,t;var t};export{h as default};