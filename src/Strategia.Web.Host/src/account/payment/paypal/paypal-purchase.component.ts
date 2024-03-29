import { Component, Input, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';
import { TenantRegistrationHelperService } from '@account/register/tenant-registration-helper.service';

import {
    PayPalPaymentServiceProxy,
    SubscriptionPaymentDto,
    PaymentServiceProxy,
    PayPalConfigurationDto,
    SubscriptionPaymentGatewayType,
    EditionPaymentType,
} from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'paypal-purchase-component',
    templateUrl: './paypal-purchase.component.html',
    animations: [accountModuleAnimation()],
})
export class PayPalPurchaseComponent extends AppComponentBase implements OnInit {
    @Input() editionPaymentType: EditionPaymentType;

    config: PayPalConfigurationDto;

    paypalIsLoading = true;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;

    totalAmount = 0;
    description = '';
    paymentId;
    redirectUrl;
    successCallbackUrl;
    errorCallbackUrl;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _payPalPaymentAppService: PayPalPaymentServiceProxy,
        private _paymentAppService: PaymentServiceProxy,
        private _router: Router,
        private _tenantRegistrationHelper: TenantRegistrationHelperService
    ) {
        super(injector);
    }

    ngOnInit(): void {

        this.setTenantIdCookieIfNeeded();

        this.paymentId = this._activatedRoute.snapshot.queryParams['paymentId'];
        this.redirectUrl = this._activatedRoute.snapshot.queryParams['redirectUrl'];

        this._payPalPaymentAppService.getConfiguration().subscribe((config: PayPalConfigurationDto) => {
            this.config = config;

            let disabledFundings = this.GetDisabledFundingsQueryString(config);
            new ScriptLoaderService()
                .load(
                    'https://www.paypal.com/sdk/js?client-id=' +
                        config.clientId +
                        '&currency=' +
                        this.appSession.application.currency +
                        disabledFundings
                )
                .then(() => {
                    this._paymentAppService.getPayment(this.paymentId).subscribe((result: SubscriptionPaymentDto) => {
                        this.description = result.description;
                        this.totalAmount = result.amount;
                        this.successCallbackUrl = result.successUrl;
                        this.errorCallbackUrl = result.errorUrl;

                        this.subscriptionPaymentGateway = result.gateway as any;

                        this.paypalIsLoading = false;
                        this.preparePaypalButton();
                    });
                });
        });
    }

    preparePaypalButton(): void {
        const self = this;
        (<any>window).paypal
            .Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: self.totalAmount,
                                    currency_code: self.appSession.application.currency,
                                },
                            },
                        ],
                    });
                },
                onApprove: function (data, actions) {
                    self._payPalPaymentAppService.confirmPayment(self.paymentId, data.orderID).subscribe(() => {
                        XmlHttpRequestHelper.ajax(
                            'post',
                            self.successCallbackUrl +
                                (self.successCallbackUrl.includes('?') ? '&' : '?') +
                                'paymentId=' +
                                self.paymentId,
                            null,
                            null,
                            (result) => {
                                if (self._tenantRegistrationHelper.registrationResult) {
                                    self._tenantRegistrationHelper.registrationResult.isActive = true;
                                }
                                self._router.navigate([self.redirectUrl]);
                            }
                        );
                    });
                },
            })
            .render('#paypal-button');
    }

    GetDisabledFundingsQueryString(config: PayPalConfigurationDto): string {
        if (!config.disabledFundings || config.disabledFundings.length <= 0) {
            return '';
        }

        return '&disable-funding=' + config.disabledFundings.join();
    }

    setTenantIdCookieIfNeeded(): void{
        if (!this._activatedRoute.snapshot.queryParams['tenantId']) {
            return;
        }

        let tenantId = parseInt(this._activatedRoute.snapshot.queryParams['tenantId']);
        abp.multiTenancy.setTenantIdCookie(tenantId);
    }
}
