"use strict";(self.webpackChunkahmetcanaydemircom=self.webpackChunkahmetcanaydemircom||[]).push([[389],{4783:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(1721),a=n(7294),o=n.p+"static/profile-pic-a7e6f09e74346211c0c48d9c8b0ae26a.jpg",i=n(5713),l=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){return a.createElement("div",{style:{display:"flex",marginBottom:(0,i.qZ)(2)}},a.createElement("img",{src:o,alt:"Ahmet Can Aydemir",style:{marginBottom:0,marginRight:(0,i.qZ)(.5),width:(0,i.qZ)(2),height:(0,i.qZ)(2),borderRadius:"50%"}}),a.createElement("p",{style:{maxWidth:"420px"}},"Personal blog by"," ",a.createElement("a",{href:"https://mobile.twitter.com/ahmetcnaydemir"},"Ahmet Can Aydemir"),".",a.createElement("br",null),"My thoughts about Programming and things."))},t}(a.Component),m=l},3375:function(e,t,n){var r=n(1721),a=n(7294),o=n(5713),i=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){return a.createElement("footer",{style:{marginTop:(0,o.qZ)(2.5),paddingTop:(0,o.qZ)(1)}},a.createElement("div",{style:{float:"right"}},a.createElement("a",{href:"/rss.xml",target:"_blank",rel:"noopener noreferrer"},"rss")),a.createElement("a",{href:"https://mobile.twitter.com/ahmetcnaydemir",target:"_blank",rel:"noopener noreferrer"},"twitter")," ","•"," ",a.createElement("a",{href:"https://github.com/ahmetcanaydemir",target:"_blank",rel:"noopener noreferrer"},"github")," ","•"," ",a.createElement("a",{href:"https://linkedin.com/in/ahmetcanaydemir",target:"_blank",rel:"noopener noreferrer"},"linkedin"))},t}(a.Component);t.Z=i},2248:function(e,t,n){var r=n(7294),a=n(5414),o=n(5444);function i(e){var t=e.meta,n=e.image,i=e.title,l=e.description,m=e.slug,c=e.lang,s=void 0===c?"en":c;return r.createElement(o.StaticQuery,{query:"336482444",render:function(e){var o=e.site.siteMetadata,c=l||o.description,u=n?o.siteUrl+"/"+n:null,p=""+o.siteUrl+m;return r.createElement(a.Z,Object.assign({htmlAttributes:{lang:s}},i?{titleTemplate:"%s — "+o.title,title:i}:{title:""+o.title},{meta:[{name:"description",content:c},{property:"og:url",content:p},{property:"og:title",content:i||o.title},{property:"og:description",content:c},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:o.social.twitter},{name:"twitter:title",content:i||o.title},{name:"twitter:description",content:c}].concat(u?[{property:"og:image",content:u},{name:"twitter:image",content:u}]:[]).concat(t)}))}})}i.defaultProps={meta:[],title:"",slug:""},t.Z=i},8781:function(e,t,n){n.r(t);var r=n(1721),a=(n(5444),n(4783)),o=(n(3375),n(4737)),i=n(7294),l=n(2248),m=n(7361),c=n.n(m),s=n(5713),u=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){this.props.pageContext.langKey;var e=c()(this,"props.data.allBooksCsv.nodes"),t=function(t){return e.filter((function(e){return e.Exclusive_Shelf===t})).map((function(e){var t=""+e.Title;return i.createElement("article",{key:t},i.createElement("header",null,i.createElement("h4",{style:{fontSize:(0,s.qZ)(.6),marginBottom:(0,s.qZ)(1/14)}},t),i.createElement("small",null,e.Author_l_f+" • "+e.Publisher+" • "+e.Number_of_Pages+" pages"+n(e.My_Rating))))}))},n=function(e){return Number(e)?" • "+new Array(Number(e)||0).fill("★").join(""):""};return i.createElement(o.Z,{location:this.props.location,title:"Books"},i.createElement(l.Z,null),i.createElement("main",null,i.createElement("h1",{style:{marginBottom:0,marginTop:0,border:0}},"Books"),"Books I rated on Goodreads.",i.createElement("h3",{style:{marginBottom:(0,s.qZ)(.2)}},"Reading"),i.createElement("hr",null),t("currently-reading"),i.createElement("h3",{style:{marginBottom:(0,s.qZ)(.2)}},"Readed"),i.createElement("hr",null),t("read"),i.createElement("h3",{style:{marginBottom:(0,s.qZ)(.2)}},"To-Read"),i.createElement("hr",null),t("to-read")),i.createElement("aside",{style:{marginTop:(0,s.qZ)(3)}},i.createElement(a.Z,null)))},t}(i.Component);t.default=u}}]);
//# sourceMappingURL=component---src-pages-books-js-b43bfadf0976e5ca2342.js.map