(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{k7Sn:function(e,t){t.supportedLanguages={en:"English",tr:"Türkçe"}},"vPK/":function(e,t,n){},yZlL:function(e,t,n){"use strict";n.r(t);var a=n("dI71"),r=n("q1tI"),l=n.n(r),i=n("Wbzz"),o=n("mwIZ"),s=n.n(o),c=(n("vPK/"),n("SbOt")),m=n("7oih"),u=n("EYWl"),p=n("JLKy"),g=n("L6NH"),d=n("p3AD"),f=n("k7Sn"),h={"https://reactjs.org":{"pt-br":"https://pt-br.reactjs.org"}},E=function(e){return f.supportedLanguages[e].replace(/ /g," ")},y='system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",\n    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",\n    "Droid Sans", "Helvetica Neue", sans-serif',b=function(e){function t(){return e.apply(this,arguments)||this}return Object(a.a)(t,e),t.prototype.render=function(){var e=this.props,t=e.translations,n=e.lang,a=e.languageLink,r=e.editUrl,o=(t.filter((function(e){return"tr"!==e})),-1!==t.indexOf("tr"));return l.a.createElement("div",{className:"translations"},l.a.createElement(p.a,{style:{fontFamily:y}},t.length>0&&l.a.createElement("span",null,o&&l.a.createElement("span",{style:{display:"block"}},"Written in:"," ","en"===n?l.a.createElement("b",null,E("en")):l.a.createElement(i.Link,{to:a("en")},"English")," • ","tr"===n?l.a.createElement("b",null,"Türkçe"):l.a.createElement(i.Link,{to:"/"+a("tr")},"Türkçe"))),"en"!==n&&l.a.createElement("div",{style:{marginTop:Object(d.a)(1/3)}},"tr"!==n&&l.a.createElement(l.a.Fragment,null,l.a.createElement(i.Link,{to:a("en")},"Read the original")," • ",l.a.createElement("a",{href:r,target:"_blank",rel:"noopener noreferrer"},"Improve this translation")," • "),l.a.createElement(i.Link,{to:"/"+n},"Tüm Türkçe gönderileri göster")," ")))},t}(l.a.Component),k=function(e){function t(){return e.apply(this,arguments)||this}return Object(a.a)(t,e),t.prototype.render=function(){var e=this.props.data.markdownRemark,t=s()(this.props,"data.site.siteMetadata.title"),a=this.props.pageContext,r=a.previous,o=a.next,p=a.slug,k=a.translations,v=a.translatedLinks,L=e.fields.langKey,w=e.html;w=function(e,t){var n=e.match(/https?:\/\/(www)?[^\/\s)"?]+/gm);return n&&f.supportedLanguages[t]?(n.forEach((function(n){h[n]&&h[n][t]&&(e=e.replace(n,h[n][t]))})),e):e}(w,L),v.forEach((function(e){var t="/"+L+e;w=w.replace(new RegExp('"'+(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+'"'),"g"),'"'+t+'"')})),(k=k.slice()).sort((function(e,t){return E(e)<E(t)?-1:1})),function(e){switch(e){case"tr":Promise.all([n.e(0),n.e(14)]).then(n.t.bind(null,"Mq6Z",7)),Promise.all([n.e(0),n.e(13)]).then(n.t.bind(null,"e/YJ",7))}}(L);var j=function(e,t){var n=e.replace(t+"/","");return function(e){return"en"===e?n:""+e+n}}(p,L),x=j("en"),O="https://github.com/ahmetcanaydemir/ahmetcanaydemir.github.io/edit/master/src/pages/"+x.slice(1,x.length-1)+"/index"+("en"===L?"":"."+L)+".md";encodeURIComponent("https://ahmetcanaydemir.com"+x);return l.a.createElement(m.a,{location:this.props.location,title:t},l.a.createElement(u.a,{lang:L,title:e.frontmatter.title,description:e.frontmatter.spoiler,slug:e.fields.slug}),l.a.createElement("main",null,l.a.createElement("article",null,l.a.createElement("header",null,l.a.createElement("h1",{style:{color:"var(--textTitle)"}},e.frontmatter.title),l.a.createElement("p",{style:Object.assign({},Object(d.b)(-.2),{display:"block",marginBottom:Object(d.a)(1),marginTop:Object(d.a)(-.8)})},Object(g.a)(e.frontmatter.date,L)," • "+Object(g.b)(e.timeToRead)),k.length>0&&l.a.createElement(b,{translations:k,editUrl:O,languageLink:j,lang:L})),l.a.createElement("div",{dangerouslySetInnerHTML:{__html:w}}),l.a.createElement("footer",null))),l.a.createElement("aside",null,l.a.createElement("div",{style:{margin:"90px 0 40px 0",fontFamily:y}}),l.a.createElement(c.a,null),l.a.createElement("nav",null,l.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},l.a.createElement("li",null,r&&l.a.createElement(i.Link,{to:r.fields.slug,rel:"prev",style:{marginRight:20}},"← ",r.frontmatter.title)),l.a.createElement("li",null,o&&l.a.createElement(i.Link,{to:o.fields.slug,rel:"next"},o.frontmatter.title," →"))))))},t}(l.a.Component);t.default=k}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-e9198502072038e6d29c.js.map