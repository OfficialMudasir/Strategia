"use strict";(self.webpackChunkabp_zero_template=self.webpackChunkabp_zero_template||[]).push([[57472],{57472:(b,p,s)=>{s.r(p),s.d(p,{InstallModule:()=>_});var g=s(75603),u=s(60263),m=s(91170),S=s(64369),c=s(58127),d=s(37857),h=s(28746),e=s(41571),f=s(36895),r=s(24006),v=s(61228),M=s(73565);function C(l,i){if(1&l&&(e.\u0275\u0275elementStart(0,"option",37),e.\u0275\u0275text(1),e.\u0275\u0275elementEnd()),2&l){const o=i.$implicit;e.\u0275\u0275propertyInterpolate("value",o.value),e.\u0275\u0275advance(1),e.\u0275\u0275textInterpolate1(" ",o.name," ")}}const y=[{path:"",component:(()=>{class l extends c.c{constructor(o,t){super(o),this._installSettingService=t,this.saving=!1}loadAppSettingsJson(){this._installSettingService.getAppSettingsJson().subscribe(t=>{this.setupSettings.webSiteUrl=t.webSiteUrl,this.setupSettings.serverUrl=t.serverSiteUrl,this.languages=t.languages})}init(){this._installSettingService.checkDatabase().subscribe(o=>{o.isDatabaseExist&&(window.location.href="/")}),this.setupSettings=new d.peI,this.setupSettings.smtpSettings=new d.enA,this.setupSettings.billInfo=new d.iKc,this.setupSettings.defaultLanguage="en",this.loadAppSettingsJson()}ngOnInit(){this.init()}saveAll(){this.saving=!0,this._installSettingService.setup(this.setupSettings).pipe((0,h.x)(()=>{this.saving=!1})).subscribe(()=>{window.location.href="/"})}}return l.\u0275fac=function(o){return new(o||l)(e.\u0275\u0275directiveInject(e.Injector),e.\u0275\u0275directiveInject(d.Q7b))},l.\u0275cmp=e.\u0275\u0275defineComponent({type:l,selectors:[["ng-component"]],features:[e.\u0275\u0275InheritDefinitionFeature],decls:83,vars:29,consts:[[1,"content","col-lg-12"],[1,"container","container-fluid","pb-10"],[1,"card","card-custom"],[1,"card-header"],[1,"card-title"],[1,"card-icon"],[1,"la","la-gear"],[1,"card-label"],["id","installForm",1,"form"],[1,"card-body"],[1,"form-section"],[1,"fs-lg","text-dark","fw-bold","mb-6"],[1,"fs-lg","text-dark","fw-bold","mb-6-title"],[1,"mb-5"],["type","text","placeholder","Connection String","name","connectionString","autocomplete","new-password",1,"form-control",3,"ngModel","value","ngModelChange"],[1,"separator","separator-dashed","my-5"],["type","password","placeholder","Admin Password","name","adminPassword","autocomplete","new-password",1,"form-control",3,"ngModel","ngModelChange"],["type","text","placeholder","Client Side URL","name","webSiteUrl",1,"form-control",3,"ngModel","value","ngModelChange"],["type","text","placeholder","Server Side URL","name","serverUrl",1,"form-control",3,"ngModel","value","ngModelChange"],["name","defaultLanguage",1,"form-control",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],["type","email","placeholder","Default from address","name","defaultFromAddress",1,"form-control",3,"ngModel","ngModelChange"],["type","text","placeholder","Default from displayName","name","defaultFromDisplayName",1,"form-control",3,"ngModel","ngModelChange"],["type","text","placeholder","SMTP host","name","smtpHost",1,"form-control",3,"ngModel","ngModelChange"],["type","number","placeholder","SMTP port","name","smtpPort",1,"form-control",3,"ngModel","ngModelChange"],[1,"control-label","col-md-12"],[1,"form-check","form-check-custom","form-check-solid","py-1"],["id","Settings_SmtpEnableSsl","type","checkbox","name","smtpEnableSsl","value","true",1,"form-check-input",3,"ngModel","ngModelChange"],[1,"form-check-label"],["id","Settings_SmtpUseDefaultCredentials","type","checkbox","name","smtpUseDefaultCredentials","value","true",1,"form-check-input",3,"ngModel","ngModelChange"],["type","text","placeholder","Domain name","name","smtpDomain",1,"form-control",3,"ngModel","ngModelChange"],["type","text","placeholder","User name","name","smtpUserName",1,"form-control",3,"ngModel","ngModelChange"],["type","password","placeholder","Password","name","smtpPassword","id","SmtpPassword",1,"form-control",3,"ngModel","ngModelChange"],["type","text","name","legalName","placeholder","Legal name",1,"form-control",3,"ngModel","ngModelChange"],["name","billAddress","rows","5","placeholder","Address",1,"form-control",3,"ngModel","ngModelChange"],[1,"card-footer"],["id","SaveButton",1,"btn","btn-primary",3,"buttonBusy","busyText","click"],[3,"value"]],template:function(o,t){1&o&&(e.\u0275\u0275elementStart(0,"div")(1,"div",0)(2,"div",1)(3,"div",2)(4,"div",3)(5,"div",4)(6,"span",5),e.\u0275\u0275element(7,"i",6),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(8,"h3",7),e.\u0275\u0275text(9,"Strategia Installation"),e.\u0275\u0275elementEnd()()(),e.\u0275\u0275elementStart(10,"form",8)(11,"div",9)(12,"div",10)(13,"div",11)(14,"h5",12),e.\u0275\u0275text(15,"Connection String"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(16,"div",13)(17,"input",14),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.connectionString=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275element(18,"div",15),e.\u0275\u0275elementStart(19,"div",11)(20,"h5",12),e.\u0275\u0275text(21,"Admin Password"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(22,"div",13)(23,"input",16),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.adminPassword=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275element(24,"div",15),e.\u0275\u0275elementStart(25,"div",11)(26,"h5",12),e.\u0275\u0275text(27,"Client Side URL"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(28,"div",13)(29,"input",17),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.webSiteUrl=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(30,"div",11)(31,"h5",12),e.\u0275\u0275text(32,"Server Side URL"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(33,"div",13)(34,"input",18),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.serverUrl=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275element(35,"div",15),e.\u0275\u0275elementStart(36,"div",11)(37,"h5",12),e.\u0275\u0275text(38,"Default Language"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(39,"div",13)(40,"select",19),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.defaultLanguage=n}),e.\u0275\u0275template(41,C,2,2,"option",20),e.\u0275\u0275elementEnd()(),e.\u0275\u0275element(42,"div",15),e.\u0275\u0275elementStart(43,"div",11)(44,"h5",12),e.\u0275\u0275text(45,"SMTP Settings"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(46,"div",13)(47,"input",21),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.defaultFromAddress=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(48,"div",13)(49,"input",22),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.defaultFromDisplayName=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(50,"div",13)(51,"input",23),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpHost=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(52,"div",13)(53,"input",24),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpPort=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(54,"div",13),e.\u0275\u0275element(55,"label",25),e.\u0275\u0275elementStart(56,"label",26)(57,"input",27),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpEnableSsl=n}),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(58,"span",28),e.\u0275\u0275text(59),e.\u0275\u0275pipe(60,"localize"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(61,"label",26)(62,"input",29),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpUseDefaultCredentials=n}),e.\u0275\u0275elementEnd(),e.\u0275\u0275elementStart(63,"span",28),e.\u0275\u0275text(64),e.\u0275\u0275pipe(65,"localize"),e.\u0275\u0275elementEnd()()(),e.\u0275\u0275elementStart(66,"div",13)(67,"input",30),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpDomain=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(68,"div",13)(69,"input",31),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpUserName=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(70,"div",13)(71,"input",32),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.smtpSettings.smtpPassword=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275element(72,"div",15),e.\u0275\u0275elementStart(73,"div",11)(74,"h5",12),e.\u0275\u0275text(75,"Invoice Info"),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(76,"div",13)(77,"input",33),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.billInfo.legalName=n}),e.\u0275\u0275elementEnd()(),e.\u0275\u0275elementStart(78,"div",13)(79,"textarea",34),e.\u0275\u0275listener("ngModelChange",function(n){return t.setupSettings.billInfo.address=n}),e.\u0275\u0275elementEnd()()()(),e.\u0275\u0275elementStart(80,"div",35)(81,"button",36),e.\u0275\u0275listener("click",function(){return t.saveAll()}),e.\u0275\u0275text(82," Save "),e.\u0275\u0275elementEnd()()()()()()()),2&o&&(e.\u0275\u0275property("@routerTransition",void 0),e.\u0275\u0275advance(17),e.\u0275\u0275propertyInterpolate("value",t.setupSettings.connectionString),e.\u0275\u0275property("ngModel",t.setupSettings.connectionString),e.\u0275\u0275advance(6),e.\u0275\u0275property("ngModel",t.setupSettings.adminPassword),e.\u0275\u0275advance(6),e.\u0275\u0275propertyInterpolate("value",t.setupSettings.webSiteUrl),e.\u0275\u0275property("ngModel",t.setupSettings.webSiteUrl),e.\u0275\u0275advance(5),e.\u0275\u0275propertyInterpolate("value",t.setupSettings.serverUrl),e.\u0275\u0275property("ngModel",t.setupSettings.serverUrl),e.\u0275\u0275advance(6),e.\u0275\u0275property("ngModel",t.setupSettings.defaultLanguage),e.\u0275\u0275advance(1),e.\u0275\u0275property("ngForOf",t.languages),e.\u0275\u0275advance(6),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.defaultFromAddress),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.defaultFromDisplayName),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpHost),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpPort),e.\u0275\u0275advance(4),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpEnableSsl),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(60,25,"UseSsl")," "),e.\u0275\u0275advance(3),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpUseDefaultCredentials),e.\u0275\u0275advance(2),e.\u0275\u0275textInterpolate1(" ",e.\u0275\u0275pipeBind1(65,27,"Use Default Credentials")," "),e.\u0275\u0275advance(3),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpDomain),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpUserName),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.smtpSettings.smtpPassword),e.\u0275\u0275advance(6),e.\u0275\u0275property("ngModel",t.setupSettings.billInfo.legalName),e.\u0275\u0275advance(2),e.\u0275\u0275property("ngModel",t.setupSettings.billInfo.address),e.\u0275\u0275advance(2),e.\u0275\u0275property("buttonBusy",t.saving)("busyText",t.l("SavingWithThreeDot")))},dependencies:[f.sg,r.\u0275NgNoValidate,r.NgSelectOption,r.\u0275NgSelectMultipleOption,r.DefaultValueAccessor,r.NumberValueAccessor,r.CheckboxControlValueAccessor,r.SelectControlValueAccessor,r.NgControlStatus,r.NgControlStatusGroup,r.NgModel,r.NgForm,v.L,M.F],styles:["#kt_aside,#kt_footer,#kt_header{display:none!important}\n"],encapsulation:2,data:{animation:[(0,S.MH)()]}}),l})(),pathMatch:"full"}];let I=(()=>{class l{}return l.\u0275fac=function(o){return new(o||l)},l.\u0275mod=e.\u0275\u0275defineNgModule({type:l}),l.\u0275inj=e.\u0275\u0275defineInjector({imports:[m.Bz.forChild(y),m.Bz]}),l})(),_=(()=>{class l{}return l.\u0275fac=function(o){return new(o||l)},l.\u0275mod=e.\u0275\u0275defineNgModule({type:l}),l.\u0275inj=e.\u0275\u0275defineInjector({imports:[u.o,g.g,I]}),l})()}}]);