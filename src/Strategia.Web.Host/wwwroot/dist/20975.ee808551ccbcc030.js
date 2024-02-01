"use strict";(self.webpackChunkabp_zero_template=self.webpackChunkabp_zero_template||[]).push([[20975],{20975:(A,y,a)=>{a.r(y),a.d(y,{UpgradeModule:()=>U});var h=a(60263),g=a(12749),d=a(91170),v=a(64369),f=a(58127),o=a(37857),c=a(85079),e=a(41571),b=a(6004),P=a(20068),m=a(36895),l=a(24006),S=a(73565);function T(i,r){1&i&&(e.\u0275\u0275elementStart(0,"div")(1,"div",10)(2,"label",11),e.\u0275\u0275text(3),e.\u0275\u0275pipe(4,"localize"),e.\u0275\u0275elementEnd()()()),2&i&&(e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(4,1,"RecurringSubscriptionUpgradeNote")," "))}function I(i,r){if(1&i&&(e.\u0275\u0275elementStart(0,"div")(1,"div",10)(2,"label",12),e.\u0275\u0275text(3),e.\u0275\u0275pipe(4,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(5,"div",13)(6,"p",14),e.\u0275\u0275text(7),e.\u0275\u0275pipe(8,"number"),e.\u0275\u0275elementEnd()()()()),2&i){const t=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(4,3,"Total")," "),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate2(" ",t.appSession.application.currencySign,"",e.\u0275\u0275pipeBind2(8,5,t.additionalPrice,"1.2-2")," ")}}function x(i,r){if(1&i){const t=e.\u0275\u0275getCurrentView();e.\u0275\u0275elementStart(0,"button",15),e.\u0275\u0275listener("click",function(){const p=e.\u0275\u0275restoreView(t).$implicit,u=e.\u0275\u0275nextContext(2);return e.\u0275\u0275resetView(u.checkout(p.gatewayType))}),e.\u0275\u0275text(1),e.\u0275\u0275pipe(2,"localize"),e.\u0275\u0275elementEnd()}if(2&i){const t=r.$implicit,n=e.\u0275\u0275nextContext(2);e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(2,1,"CheckoutWith"+n.getPaymentGatewayType(t.gatewayType))," ")}}function C(i,r){if(1&i&&(e.\u0275\u0275elementStart(0,"div",1)(1,"div",2)(2,"h3",3),e.\u0275\u0275text(3),e.\u0275\u0275pipe(4,"localize"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(5,"form",4)(6,"h4",5),e.\u0275\u0275text(7),e.\u0275\u0275pipe(8,"localize"),e.\u0275\u0275elementEnd(),e.\u0275\u0275element(9,"div",6),e.\u0275\u0275template(10,T,5,3,"div",7),e.\u0275\u0275template(11,I,9,8,"div",7),e.\u0275\u0275elementStart(12,"div",8),e.\u0275\u0275template(13,x,3,3,"button",9),e.\u0275\u0275elementEnd()()()),2&i){const t=e.\u0275\u0275nextContext();e.\u0275\u0275property("@routerTransition",void 0),e.\u0275\u0275advance(3),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(4,6,"PaymentInfo")," "),e.\u0275\u0275advance(4),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind2(8,8,"Upgrade_Edition_Description",t.edition.displayName)," "),e.\u0275\u0275advance(3),e.\u0275\u0275property("ngIf",t.hasRecurringSubscription()),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngIf",!t.hasRecurringSubscription()),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngForOf",t.paymentGateways)}}const E=[{path:"",component:(()=>{class i extends f.c{constructor(t,n,s,p,u,F,M){super(t),this._router=n,this._paymentHelperService=s,this._activatedRoute=p,this._paymentAppService=u,this._tenantRegistrationAppService=F,this._editionHelperService=M,this.subscriptionPaymentType=o.Ykt,this.subscriptionStartType=o.gPM,this.edition=new o._6E,this.tenantId=abp.session.tenantId,this.subscriptionPaymentGateway=o.UWJ,this.editionPaymentTypeCheck=o.qLZ,this.showPaymentForm=!1}ngOnInit(){this.showMainSpinner(),this.editionPaymentType=parseInt(this._activatedRoute.snapshot.queryParams.editionPaymentType),this.upgradeEditionId=this._activatedRoute.snapshot.queryParams.upgradeEditionId,this.appSession.tenant.edition.isFree?this._tenantRegistrationAppService.getEdition(this.upgradeEditionId).subscribe(t=>{this._editionHelperService.isEditionFree(t)?this._paymentAppService.switchBetweenFreeEditions(t.id).subscribe(()=>{this.hideMainSpinner(),this._router.navigate(["app/admin/subscription-management"])}):(this.hideMainSpinner(),this.redirectToBuy())}):this._paymentAppService.hasAnyPayment().subscribe(t=>{if(!t)return this.hideMainSpinner(),void this.redirectToBuy();this._paymentAppService.getPaymentInfo(this.upgradeEditionId).subscribe(n=>{this.edition=n.edition,this.additionalPrice=Number(n.additionalPrice.toFixed(2)),this.additionalPrice<c.g.MinimumUpgradePaymentAmount?this._paymentAppService.upgradeSubscriptionCostsLessThenMinAmount(this.upgradeEditionId).subscribe(()=>{this.spinnerService.hide(),this.showPaymentForm=!0,this._router.navigate(["app/admin/subscription-management"])}):(this.spinnerService.hide(),this.showPaymentForm=!0)}),this._paymentAppService.getLastCompletedPayment().subscribe(n=>{let s=new o.X$y;s.gatewayType=n.gateway,s.supportsRecurringPayments=!0,this.paymentGateways=[s],this.paymentPeriodType=n.paymentPeriodType,this.appSession.tenant.subscriptionPaymentType===this.subscriptionPaymentType.Manual&&this._paymentAppService.getActiveGateways(void 0).subscribe(p=>{this.paymentGateways=p})})})}checkout(t){let n=new o.LQI;n.editionId=this.edition.id,n.editionPaymentType=this.editionPaymentType,n.paymentPeriodType=this.paymentPeriodType,n.recurringPaymentEnabled=this.hasRecurringSubscription(),n.subscriptionPaymentGatewayType=t,n.successUrl=c.g.remoteServiceBaseUrl+"/api/services/app/payment/"+this._paymentHelperService.getEditionPaymentType(this.editionPaymentType)+"Succeed",n.errorUrl=c.g.remoteServiceBaseUrl+"/api/services/app/payment/PaymentFailed",this._paymentAppService.createPayment(n).subscribe(s=>{this._router.navigate(["account/"+this.getPaymentGatewayType(t).toLocaleLowerCase()+"-purchase"],{queryParams:{paymentId:s,isUpgrade:!0,redirectUrl:"app/admin/subscription-management"}})})}getPaymentGatewayType(t){return this._paymentHelperService.getPaymentGatewayType(t)}hasRecurringSubscription(){return this.appSession.tenant.subscriptionPaymentType!==this.subscriptionPaymentType.Manual}redirectToBuy(){this._router.navigate(["account/buy"],{queryParams:{tenantId:this.appSession.tenant.id,editionPaymentType:o.qLZ.BuyNow,editionId:this.upgradeEditionId,subscriptionStartType:this.subscriptionStartType.Paid}})}}return i.\u0275fac=function(t){return new(t||i)(e.\u0275\u0275directiveInject(e.Injector),e.\u0275\u0275directiveInject(d.F0),e.\u0275\u0275directiveInject(b.T),e.\u0275\u0275directiveInject(d.gz),e.\u0275\u0275directiveInject(o.KC),e.\u0275\u0275directiveInject(o.Zr1),e.\u0275\u0275directiveInject(P.Y))},i.\u0275cmp=e.\u0275\u0275defineComponent({type:i,selectors:[["ng-component"]],features:[e.\u0275\u0275InheritDefinitionFeature],decls:1,vars:1,consts:[["class","login-form",4,"ngIf"],[1,"login-form"],[1,"pb-13","pt-lg-0","pt-5"],[1,"fw-bolder","text-dark","fs-h4","fs-h1-lg"],["method","post",1,"login-form","form"],[1,"mb-2"],[1,"separator","separator-border-dashed"],[4,"ngIf"],[1,"pb-lg-0","pb-5"],["class","btn btn-success w-100",3,"click",4,"ngFor","ngForOf"],[1,"mb-5","row"],[1,"col-sm-12"],[1,"col-sm-8"],[1,"col-sm-4","text-end"],["id","totalPrice",1,"fw-bolder"],[1,"btn","btn-success","w-100",3,"click"]],template:function(t,n){1&t&&e.\u0275\u0275template(0,C,14,11,"div",0),2&t&&e.\u0275\u0275property("ngIf",n.showPaymentForm)},dependencies:[m.sg,m.O5,l.\u0275NgNoValidate,l.NgControlStatusGroup,l.NgForm,m.JJ,S.F],encapsulation:2,data:{animation:[(0,v.RP)()]}}),i})(),pathMatch:"full"}];let w=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.\u0275\u0275defineNgModule({type:i}),i.\u0275inj=e.\u0275\u0275defineInjector({imports:[d.Bz.forChild(E),d.Bz]}),i})(),U=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.\u0275\u0275defineNgModule({type:i}),i.\u0275inj=e.\u0275\u0275defineInjector({imports:[h.o,g.y,w]}),i})()}}]);