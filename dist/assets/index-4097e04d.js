import{d as H,I as J,u as K,r as o,w as O,e as tt,S as B,o as c,f as h,g as a,h as n,j as d,k as t,x as _,c as et,t as r,F as j,i as at,b as z,U as lt,V as v,W as st,X as it,Y as ot,Z as w,q as F,$ as nt,v as rt,z as dt,a0 as ut,a2 as pt}from"./index-264675fd.js";const ct={class:"grid"},vt={class:"col-12"},bt={class:"card p-4 shadow-2 border-round"},mt={class:"text-2xl font-bold"},gt={class:"flex gap-2"},ft={class:"p-input-icon-left"},ht={class:"card shadow-1 surface-0"},_t={class:"text-center py-4"},xt={class:"text-xl"},yt={class:"flex justify-content-center align-items-center py-4"},kt={class:"p-paginator p-component p-unselectable-text p-paginator-bottom"},wt={class:"p-paginator-left-content"},Ct={class:"p-paginator-current"},$t={class:"p-paginator-right-content"},Vt=["disabled"],Pt=["disabled"],Ut=["onClick"],Dt={key:1,class:"p-paginator-dots"},Nt=["disabled"],Et=["disabled"],Rt={class:"flex align-items-center justify-content-center"},At={__name:"index",setup(It){const P=H(),C=J(),{t:i}=K(),x=o(!0),U=o([]),b=o(!1),D=o(null),N=o(null),M=o({}),y=o("");o(null);const u=o(1),$=o(0),p=o(10),k=o(0),W=o(""),q=o(""),E=o(""),R=o(""),I=o(0),S=o(0),T=o([]),m=()=>{x.value=!0,z.get("/api/attribute",{params:{page:u.value,limit:p.value,search:y.value||void 0}}).then(l=>{U.value=l.data.data.data,$.value=l.data.data.total,k.value=l.data.data.last_page,W.value=l.data.data.first_page_url,q.value=l.data.data.last_page_url,E.value=l.data.data.next_page_url,R.value=l.data.data.prev_page_url,I.value=l.data.data.from,S.value=l.data.data.to,T.value=l.data.data.links,x.value=!1}).catch(l=>{C.add({severity:"error",summary:i("error"),detail:i("attribute.loadError"),life:3e3}),x.value=!1,console.error("Error fetching attributes:",l)})};O([y,p],()=>{u.value=1,m()});const g=l=>{l>=1&&l<=k.value&&(u.value=l,m())},G=l=>{p.value=l.value,u.value=1,m()},L=l=>{D.value=l,b.value=!0},Q=()=>{z.delete(`/api/attribute/${D.value}`).then(()=>{C.add({severity:"success",summary:i("success"),detail:i("attribute.deleteSuccess"),life:3e3}),m(),b.value=!1}).catch(l=>{C.add({severity:"error",summary:i("error"),detail:i("attribute.deleteError"),life:3e3}),console.error("Error deleting attribute:",l)})},X=()=>{N.value.exportCSV()},Y=()=>{P.push({name:"attribute-create"})},Z=l=>{P.push({name:"attribute-update",params:{id:l}})};return tt(()=>{m()}),(l,e)=>{const f=B("can"),A=B("tooltip");return c(),h("div",ct,[a("div",vt,[a("div",bt,[n(t(st),{class:"mb-4"},{start:d(()=>[a("h2",mt,r(t(i)("attribute.managementTitle")),1)]),end:d(()=>[a("div",gt,[a("span",ft,[e[8]||(e[8]=a("i",{class:"pi pi-search"},null,-1)),n(t(lt),{modelValue:y.value,"onUpdate:modelValue":e[0]||(e[0]=s=>y.value=s),placeholder:t(i)("attribute.search")},null,8,["modelValue","placeholder"])]),_(n(t(v),{label:t(i)("attribute.export"),icon:"pi pi-upload",class:"p-export",onClick:X},null,8,["label"]),[[f,"list attributes"]]),_(n(t(v),{label:t(i)("attribute.new"),icon:"pi pi-plus",class:"p-button-success",onClick:Y},null,8,["label"]),[[f,"create attributes"]])])]),_:1}),n(t(it)),a("div",ht,[_((c(),et(t(nt),{ref_key:"dt",ref:N,value:U.value,loading:x.value,"data-key":"id",paginator:!1,rows:p.value,filters:M.value,totalRecords:$.value,"responsive-layout":"scroll",stripedRows:"",showGridlines:"",class:"p-datatable-sm"},{empty:d(()=>[a("div",_t,[e[9]||(e[9]=a("i",{class:"pi pi-exclamation-circle text-2xl mb-2"},null,-1)),a("p",xt,r(t(i)("attribute.noData")),1)])]),loading:d(()=>[a("div",yt,[n(t(ot),{style:{width:"50px",height:"50px"},strokeWidth:"4"})])]),default:d(()=>[n(t(w),{"selection-mode":"multiple","header-style":"width: 3rem"}),n(t(w),{field:"name_ar",header:t(i)("attribute.nameAr"),sortable:!0,"header-style":"width:20%; min-width:10rem;"},{body:d(s=>[F(r(s.data.name_ar),1)]),_:1},8,["header"]),n(t(w),{field:"name_en",header:t(i)("attribute.nameEn"),sortable:!0,"header-style":"width:20%; min-width:10rem;"},{body:d(s=>[F(r(s.data.name_en),1)]),_:1},8,["header"]),n(t(w),{header:t(i)("actions"),"header-style":"width: 12rem"},{body:d(s=>[_(n(t(v),{icon:"pi pi-pencil",class:"p-detail",onClick:V=>Z(s.data.id)},null,8,["onClick"]),[[f,"edit attributes"],[A,t(i)("edit"),void 0,{top:!0}]]),_(n(t(v),{icon:"pi pi-trash mx-2",class:"p-delete",onClick:V=>L(s.data.id)},null,8,["onClick"]),[[f,"delete attributes"],[A,t(i)("delete"),void 0,{top:!0}]])]),_:1},8,["header"])]),_:1},8,["value","loading","rows","filters","totalRecords"])),[[f,"list attributes"]]),a("div",kt,[a("div",wt,[a("span",Ct,r(t(i)("show"))+" "+r(I.value)+" "+r(t(i)("to"))+" "+r(S.value)+" "+r(t(i)("from"))+" "+r($.value),1)]),a("div",$t,[a("button",{class:"p-paginator-first p-paginator-element p-link",disabled:u.value===1,onClick:e[1]||(e[1]=s=>g(1))},e[10]||(e[10]=[a("span",{class:"p-paginator-icon pi pi-angle-double-left"},null,-1)]),8,Vt),a("button",{class:"p-paginator-prev p-paginator-element p-link",disabled:!R.value,onClick:e[2]||(e[2]=s=>g(u.value-1))},e[11]||(e[11]=[a("span",{class:"p-paginator-icon pi pi-angle-left"},null,-1)]),8,Pt),(c(!0),h(j,null,at(T.value,(s,V)=>(c(),h(j,{key:V},[s.label&&!isNaN(parseInt(s.label))?(c(),h("button",{key:0,class:rt(["p-paginator-page p-paginator-element p-link",{"p-highlight":s.active}]),onClick:St=>g(parseInt(s.label))},r(s.label),11,Ut)):s.label==="..."?(c(),h("span",Dt,"...")):dt("",!0)],64))),128)),a("button",{class:"p-paginator-next p-paginator-element p-link",disabled:!E.value,onClick:e[3]||(e[3]=s=>g(u.value+1))},e[12]||(e[12]=[a("span",{class:"p-paginator-icon pi pi-angle-right"},null,-1)]),8,Nt),a("button",{class:"p-paginator-last p-paginator-element p-link",disabled:u.value===k.value,onClick:e[4]||(e[4]=s=>g(k.value))},e[13]||(e[13]=[a("span",{class:"p-paginator-icon pi pi-angle-double-right"},null,-1)]),8,Et),n(t(ut),{filter:"",modelValue:p.value,"onUpdate:modelValue":e[5]||(e[5]=s=>p.value=s),options:[5,10,20,30],onChange:G,class:"ml-2",style:{width:"80px"}},null,8,["modelValue"])])])]),n(t(pt),{visible:b.value,"onUpdate:visible":e[7]||(e[7]=s=>b.value=s),style:{width:"450px"},header:t(i)("attribute.deleteConfirmTitle"),modal:!0},{footer:d(()=>[n(t(v),{label:t(i)("no"),icon:"pi pi-times",class:"p-button-text",onClick:e[6]||(e[6]=s=>b.value=!1)},null,8,["label"]),n(t(v),{label:t(i)("yes"),icon:"pi pi-check",class:"p-button-text p-button-danger",onClick:Q},null,8,["label"])]),default:d(()=>[a("div",Rt,[e[14]||(e[14]=a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem",color:"var(--red-500)"}},null,-1)),a("span",null,r(t(i)("attribute.deleteConfirmMessage")),1)])]),_:1},8,["visible","header"])])])])}}};export{At as default};
