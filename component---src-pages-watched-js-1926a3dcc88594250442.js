"use strict";(self.webpackChunkahmetcanaydemircom=self.webpackChunkahmetcanaydemircom||[]).push([[354],{4783:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(1721),a=n(7294),i=n.p+"static/profile-pic-a7e6f09e74346211c0c48d9c8b0ae26a.jpg",o=n(5713),l=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){return a.createElement("div",{style:{display:"flex",marginBottom:(0,o.qZ)(2)}},a.createElement("img",{src:i,alt:"Ahmet Can Aydemir",style:{marginBottom:0,marginRight:(0,o.qZ)(.5),width:(0,o.qZ)(2),height:(0,o.qZ)(2),borderRadius:"50%"}}),a.createElement("p",{style:{maxWidth:"420px"}},"Personal blog by"," ",a.createElement("a",{href:"https://mobile.twitter.com/ahmetcnaydemir"},"Ahmet Can Aydemir"),".",a.createElement("br",null),"My thoughts about Programming and things."))},t}(a.Component),m=l},3375:function(e,t,n){var r=n(1721),a=n(7294),i=n(5713),o=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){return a.createElement("footer",{style:{marginTop:(0,i.qZ)(2.5),paddingTop:(0,i.qZ)(1)}},a.createElement("div",{style:{float:"right"}},a.createElement("a",{href:"/rss.xml",target:"_blank",rel:"noopener noreferrer"},"rss")),a.createElement("a",{href:"https://mobile.twitter.com/ahmetcnaydemir",target:"_blank",rel:"noopener noreferrer"},"twitter")," ","•"," ",a.createElement("a",{href:"https://github.com/ahmetcanaydemir",target:"_blank",rel:"noopener noreferrer"},"github")," ","•"," ",a.createElement("a",{href:"https://linkedin.com/in/ahmetcanaydemir",target:"_blank",rel:"noopener noreferrer"},"linkedin"))},t}(a.Component);t.Z=o},2248:function(e,t,n){var r=n(7294),a=n(5414),i=n(5444);function o(e){var t=e.meta,n=e.image,o=e.title,l=e.description,m=e.slug,c=e.lang,s=void 0===c?"en":c;return r.createElement(i.StaticQuery,{query:"336482444",render:function(e){var i=e.site.siteMetadata,c=l||i.description,u=n?i.siteUrl+"/"+n:null,p=""+i.siteUrl+m;return r.createElement(a.Z,Object.assign({htmlAttributes:{lang:s}},o?{titleTemplate:"%s — "+i.title,title:o}:{title:""+i.title},{meta:[{name:"description",content:c},{property:"og:url",content:p},{property:"og:title",content:o||i.title},{property:"og:description",content:c},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:i.social.twitter},{name:"twitter:title",content:o||i.title},{name:"twitter:description",content:c}].concat(u?[{property:"og:image",content:u},{name:"twitter:image",content:u}]:[]).concat(t)}))}})}o.defaultProps={meta:[],title:"",slug:""},t.Z=o},8655:function(e,t,n){n.r(t);var r=n(1721),a=(n(5444),n(4783)),i=(n(3375),n(4737)),o=n(7294),l=n(2248),m=n(7361),c=n.n(m),s=n(5713),u=function(e){function t(){return e.apply(this,arguments)||this}return(0,r.Z)(t,e),t.prototype.render=function(){this.props.pageContext.langKey;var e=c()(this,"props.data.allWatchedCsv.nodes"),t=e.filter((function(e){return"movie"===e.Title_Type})).length,n=function(t){return e.filter((function(e){return e.Title_Type===t})).map((function(e){return o.createElement("article",{key:e.Const},o.createElement("header",null,o.createElement("h4",{style:{fontSize:(0,s.qZ)(.6),marginBottom:(0,s.qZ)(1/14)}},o.createElement("a",{href:"https://www.imdb.com/title/"+e.Const+"/",target:"_blank",rel:"noopener no referrer"},e.Title)),o.createElement("small",null,e.Year+" • "+e.Runtime+" minutes"+r(e.Your_Rating)," / ",o.createElement("span",{style:{fontSize:(0,s.qZ)(.4)}},"10"))))}))},r=function(e){return Number(e)?" • ★ "+Number(e):""};return o.createElement(i.Z,{location:this.props.location,title:"Watched"},o.createElement(l.Z,null),o.createElement("main",null,o.createElement("h1",{style:{marginBottom:0,marginTop:0,border:0}},"Watched"),"Movies and tv series I rated on IMDB.",o.createElement("h3",{style:{marginBottom:(0,s.qZ)(.2)}},"Movies (",t,")"),o.createElement("hr",null),n("movie"),o.createElement("h3",{style:{marginBottom:(0,s.qZ)(.2)}},"Series (",e.length-t,")"),o.createElement("hr",null),n("tvSeries"),n("tvMiniSeries")),o.createElement("aside",{style:{marginTop:(0,s.qZ)(3)}},o.createElement(a.Z,null)))},t}(o.Component);t.default=u}}]);
//# sourceMappingURL=component---src-pages-watched-js-1926a3dcc88594250442.js.map