"use strict";(self.webpackChunkabp_zero_template=self.webpackChunkabp_zero_template||[]).push([[35368],{35368:($,s,a)=>{a.r(s),a.d(s,{WebhookEventDetailModule:()=>V});var c=a(75603),v=a(60263),d=a(91170),h=a(58127),b=a(64369),e=a(41571),m=a(37857),u=a(36895),g=a(20388),p=a(59245),x=a(17806),E=a(7318),f=a(10805),_=a(55317),S=a(80149),k=a(80659),w=a(73565),I=a(34201);const C=["detailModal"];function y(n,i){if(1&n&&(e.\u0275\u0275elementStart(0,"div",29),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.webhookEvent.data," ")}}function M(n,i){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"div",29)(1,"p")(2,"span",30),e.\u0275\u0275text(3),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(4,"span",31),e.\u0275\u0275text(5),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(6,"button",32),e.\u0275\u0275listener("click",function(){e.\u0275\u0275restoreView(t);const l=e.\u0275\u0275nextContext(2);return e.\u0275\u0275resetView(l.showMoreData())}),e.\u0275\u0275text(7),e.\u0275\u0275pipe(8,"localize"),e.\u0275\u0275elementEnd()()}if(2&n){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1("",t.webhookEvent.data.slice(0,t.maxDataLength),". . ."),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",t.webhookEvent.data," "),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(8,3,"ShowData")," ")}}function D(n,i){if(1&n&&(e.\u0275\u0275elementStart(0,"div",9)(1,"div",24)(2,"label",25),e.\u0275\u0275text(3),e.\u0275\u0275pipe(4,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(5,"div",26),e.\u0275\u0275text(6),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(7,"div",24)(8,"label",25),e.\u0275\u0275text(9),e.\u0275\u0275pipe(10,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(11,"div",26),e.\u0275\u0275text(12),e.\u0275\u0275pipe(13,"luxonFormat"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(14,"div",27)(15,"label",25),e.\u0275\u0275text(16),e.\u0275\u0275pipe(17,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275template(18,y,2,1,"div",28),e.\u0275\u0275template(19,M,9,5,"div",28),e.\u0275\u0275elementEnd()()),2&n){const t=e.\u0275\u0275nextContext();e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(4,7,"WebhookEvent")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",t.webhookEvent.webhookName," "),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(10,9,"CreationTime")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind2(13,11,t.webhookEvent.creationTime,"F")," "),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(17,14,"Data")),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngIf",t.webhookEvent.data.length<=t.maxDataLength),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",t.webhookEvent.data.length>t.maxDataLength)}}function W(n,i){1&n&&(e.\u0275\u0275elementStart(0,"tr")(1,"th",33),e.\u0275\u0275text(2),e.\u0275\u0275pipe(3,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(4,"th",34),e.\u0275\u0275text(5),e.\u0275\u0275pipe(6,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(7,"th"),e.\u0275\u0275text(8),e.\u0275\u0275pipe(9,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(10,"th",35),e.\u0275\u0275text(11),e.\u0275\u0275pipe(12,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(13,"th",36),e.\u0275\u0275text(14),e.\u0275\u0275pipe(15,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(16,"th"),e.\u0275\u0275text(17),e.\u0275\u0275pipe(18,"localize"),e.\u0275\u0275elementEnd()()),2&n&&(e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(3,6,"Actions")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(6,8,"WebhookSubscriptionId")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(9,10,"WebhookEndpoint")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(12,12,"CreationTime")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(15,14,"HttpStatusCode")),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(18,16,"Response")))}function T(n,i){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"li",45)(1,"a",46),e.\u0275\u0275listener("click",function(){e.\u0275\u0275restoreView(t);const l=e.\u0275\u0275nextContext(2).$implicit,r=e.\u0275\u0275nextContext();return e.\u0275\u0275resetView(r.resend(l.id))}),e.\u0275\u0275text(2),e.\u0275\u0275pipe(3,"localize"),e.\u0275\u0275elementEnd()()}2&n&&(e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(3,1,"Resend")," "))}function B(n,i){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"ul",43),e.\u0275\u0275template(1,T,4,3,"li",44),e.\u0275\u0275pipe(2,"permission"),e.\u0275\u0275elementStart(3,"li",45)(4,"a",46),e.\u0275\u0275listener("click",function(){e.\u0275\u0275restoreView(t);const l=e.\u0275\u0275nextContext().$implicit,r=e.\u0275\u0275nextContext();return e.\u0275\u0275resetView(r.goToWebhookSubscriptionDetail(l.webhookSubscriptionId))}),e.\u0275\u0275text(5),e.\u0275\u0275pipe(6,"localize"),e.\u0275\u0275elementEnd()()()}2&n&&(e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",e.\u0275\u0275pipeBind1(2,2,"Pages.Administration.Webhook.ResendWebhook")),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(6,4,"GoToSubscription")," "))}function z(n,i){if(1&n&&(e.\u0275\u0275elementStart(0,"span"),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&n){const t=e.\u0275\u0275nextContext().$implicit;e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",t.response," ")}}function L(n,i){if(1&n){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"span")(1,"button",47),e.\u0275\u0275listener("click",function(){e.\u0275\u0275restoreView(t);const l=e.\u0275\u0275nextContext().$implicit,r=e.\u0275\u0275nextContext();return e.\u0275\u0275resetView(r.showDetailModal(l.response))}),e.\u0275\u0275text(2),e.\u0275\u0275pipe(3,"localize"),e.\u0275\u0275elementEnd()()}2&n&&(e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(3,1,"ShowResponse")," "))}function R(n,i){if(1&n&&(e.\u0275\u0275elementStart(0,"tr")(1,"td")(2,"div",37)(3,"button",38),e.\u0275\u0275element(4,"i",39)(5,"span",40),e.\u0275\u0275elementEnd(),e.\u0275\u0275template(6,B,7,6,"ul",41),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(7,"td"),e.\u0275\u0275text(8),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(9,"td"),e.\u0275\u0275text(10),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(11,"td"),e.\u0275\u0275text(12),e.\u0275\u0275pipe(13,"luxonFormat"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(14,"td"),e.\u0275\u0275text(15),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(16,"td"),e.\u0275\u0275template(17,z,2,1,"span",42),e.\u0275\u0275template(18,L,4,3,"span",42),e.\u0275\u0275elementEnd()()),2&n){const t=i.$implicit,o=e.\u0275\u0275nextContext();e.\u0275\u0275advance(8),e.\u0275\u0275textInterpolate1(" ",t.webhookSubscriptionId," "),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",t.webhookUri," "),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind2(13,6,t.creationTime,"yyyy-LL-dd HH:mm:ss")," "),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",t.responseStatusCode," "),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngIf",(null==t||null==t.response?null:t.response.length)<=o.listMaxResponseLength),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",(null==t||null==t.response?null:t.response.length)>o.listMaxResponseLength)}}function P(n,i){1&n&&(e.\u0275\u0275elementStart(0,"div",48),e.\u0275\u0275text(1),e.\u0275\u0275pipe(2,"localize"),e.\u0275\u0275elementEnd()),2&n&&(e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(2,1,"NoData")," "))}const A=function(){return{"min-width":"50rem"}},O=[{path:"",component:(()=>{class n extends h.c{constructor(t,o,l,r,F){super(t),this._webhookEventService=o,this._webhookSendAttemptService=l,this._router=r,this._activatedRoute=F,this.loading=!0,this.maxDataLength=300,this.listMaxResponseLength=100,this.detailModalText=""}ngOnInit(){this.webhookEventId=this._activatedRoute.snapshot.queryParams.id,this.getDetail()}getSendAttempts(t){this.primengTableHelper.showLoadingIndicator(),this._webhookSendAttemptService.getAllSendAttemptsOfWebhookEvent(this.webhookEventId).subscribe(o=>{this.primengTableHelper.totalRecordsCount=o.items.length,this.primengTableHelper.records=o.items,this.primengTableHelper.hideLoadingIndicator()})}getDetail(){this._webhookEventService.get(this.webhookEventId).subscribe(t=>{this.webhookEvent=t,this.loading=!1})}goToWebhookSubscriptionDetail(t){this._router.navigate(["app/admin/webhook-subscriptions-detail"],{queryParams:{id:t}})}resend(t){this.message.confirm(this.l("WebhookEventWillBeSendWithSameParameters"),this.l("AreYouSure"),o=>{o&&(this.showMainSpinner(),this._webhookSendAttemptService.resend(t).subscribe(()=>{abp.notify.success(this.l("WebhookSendAttemptInQueue")),this.hideMainSpinner()},()=>{this.hideMainSpinner()}))})}showDetailModal(t){this.detailModalText=t,this.detailModal.show()}showMoreData(){document.getElementById("dataDots").classList.add("d-none"),document.getElementById("dataShowMoreBtn").classList.add("d-none"),document.getElementById("dataMore").classList.remove("d-none")}}return n.\u0275fac=function(t){return new(t||n)(e.\u0275\u0275directiveInject(e.Injector),e.\u0275\u0275directiveInject(m.mVG),e.\u0275\u0275directiveInject(m.JYj),e.\u0275\u0275directiveInject(d.F0),e.\u0275\u0275directiveInject(d.gz))},n.\u0275cmp=e.\u0275\u0275defineComponent({type:n,selectors:[["ng-component"]],viewQuery:function(t,o){if(1&t&&e.\u0275\u0275viewQuery(C,7),2&t){let l;e.\u0275\u0275queryRefresh(l=e.\u0275\u0275loadQuery())&&(o.detailModal=l.first)}},features:[e.\u0275\u0275InheritDefinitionFeature],decls:31,vars:19,consts:[[3,"title"],[1,"card","card-custom","gutter-b"],["class","card-body",4,"ngIf"],[1,"card-header","align-items-center","border-0","mt-4"],[1,"card-title","align-items-start","flex-column"],[1,"fw-bolder","text-dark"],[1,"card-toolbar"],[1,"btn","btn-outline-brand","btn-sm","btn-icon","btn-icon-md",3,"click"],[1,"flaticon2-refresh"],[1,"card-body"],[1,"row","align-items-center"],[1,"col","primeng-datatable-container",3,"busyIf"],[3,"value","rows","paginator","lazy","tableStyle","onLazyLoad"],["dataTable",""],["pTemplate","header"],["pTemplate","body"],["class","primeng-no-data",4,"ngIf"],[3,"modalSave"],["createOrEditWebhookSubscriptionModal",""],["bsModal","","id","detailModal","tabindex","-1","role","dialog","aria-labelledby","detailModal","aria-hidden","true",1,"modal","fade"],["detailModal","bs-modal"],[1,"modal-dialog","modal-lg"],[1,"modal-content"],[1,"modal-body"],[1,"mb-5","row"],[1,"col-2","col-form-label"],[1,"col-10"],[1,"row","mb-2"],["class","col-10 text-break",4,"ngIf"],[1,"col-10","text-break"],["id","dataDots"],["id","dataMore",1,"d-none"],["id","dataShowMoreBtn",1,"btn","btn-outline-primary","btn-sm",3,"click"],[2,"width","100px"],[2,"width","320px"],[2,"width","180px"],[2,"width","130px"],["dropdown","","placement","bottom left",1,"btn-group"],["id","dropdownButton","type","button","dropdownToggle","","aria-controls","dropdownMenu",1,"btn","btn-primary","btn-sm","dropdown-toggle"],[1,"bi","bi-gear-fill"],[1,"caret"],["id","dropdownMenu","class","dropdown-menu","role","menu","aria-labelledby","dropdownButton",4,"dropdownMenu"],[4,"ngIf"],["id","dropdownMenu","role","menu","aria-labelledby","dropdownButton",1,"dropdown-menu"],["role","menuitem",4,"ngIf"],["role","menuitem"],["href","javascript:;",1,"dropdown-item",3,"click"],[1,"btn","btn-outline-primary","btn-sm",3,"click"],[1,"primeng-no-data"]],template:function(t,o){1&t&&(e.\u0275\u0275elementStart(0,"div"),e.\u0275\u0275element(1,"sub-header",0),e.\u0275\u0275pipe(2,"localize"),e.\u0275\u0275elementStart(3,"div")(4,"div",1),e.\u0275\u0275template(5,D,20,16,"div",2),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(6,"div",1)(7,"div",3)(8,"h3",4)(9,"span",5),e.\u0275\u0275text(10),e.\u0275\u0275pipe(11,"localize"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(12,"div",6)(13,"button",7),e.\u0275\u0275listener("click",function(){return o.getSendAttempts()}),e.\u0275\u0275element(14,"i",8),e.\u0275\u0275elementEnd()()(),e.\u0275\u0275elementStart(15,"div",9)(16,"div",10)(17,"div",11)(18,"p-table",12,13),e.\u0275\u0275listener("onLazyLoad",function(r){return o.getSendAttempts(r)}),e.\u0275\u0275template(20,W,19,18,"ng-template",14),e.\u0275\u0275template(21,R,19,9,"ng-template",15),e.\u0275\u0275elementEnd(),e.\u0275\u0275template(22,P,3,3,"div",16),e.\u0275\u0275elementEnd()()()(),e.\u0275\u0275elementStart(23,"create-or-edit-webhook-subscription",17,18),e.\u0275\u0275listener("modalSave",function(){return o.getDetail()}),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(25,"div",19,20)(27,"div",21)(28,"div",22)(29,"div",23),e.\u0275\u0275text(30),e.\u0275\u0275elementEnd()()()()()()),2&t&&(e.\u0275\u0275property("@routerTransition",void 0),e.\u0275\u0275advance(1),e.\u0275\u0275property("title",e.\u0275\u0275pipeBind1(2,14,"WebhookEventDetail")),e.\u0275\u0275advance(2),e.\u0275\u0275classMap(o.containerClass),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngIf",o.webhookEvent),e.\u0275\u0275advance(5),e.\u0275\u0275textInterpolate(e.\u0275\u0275pipeBind1(11,16,"WebhookSendAttempts")),e.\u0275\u0275advance(7),e.\u0275\u0275property("busyIf",o.primengTableHelper.isLoading),e.\u0275\u0275advance(1),e.\u0275\u0275propertyInterpolate("rows",o.primengTableHelper.defaultRecordsCountPerPage),e.\u0275\u0275property("value",o.primengTableHelper.records)("paginator",!1)("lazy",!0)("tableStyle",e.\u0275\u0275pureFunction0(18,A)),e.\u0275\u0275advance(4),e.\u0275\u0275property("ngIf",0==o.primengTableHelper.totalRecordsCount),e.\u0275\u0275advance(8),e.\u0275\u0275textInterpolate1(" ",o.detailModalText," "))},dependencies:[u.O5,g.oB,p.Hz,p.Mq,p.TO,x.U,E.iA,f.jx,_.$,S.s,k.n,w.F,I.a],styles:["#portlet-detail[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{padding:8px}.primeng-datatable-container[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .primeng-datatable-container[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{text-align:center}#detailModal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]{overflow-wrap:break-word}"],data:{animation:[(0,b.MH)()]}}),n})(),pathMatch:"full"}];let j=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.\u0275\u0275defineNgModule({type:n}),n.\u0275inj=e.\u0275\u0275defineInjector({imports:[d.Bz.forChild(O),d.Bz]}),n})();var H=a(56995);let V=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.\u0275\u0275defineNgModule({type:n}),n.\u0275inj=e.\u0275\u0275defineInjector({imports:[v.o,c.g,j,H.WebhookSubscriptionModule]}),n})()}}]);