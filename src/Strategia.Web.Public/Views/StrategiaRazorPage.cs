﻿using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Strategia.Web.Public.Views
{
    public abstract class StrategiaRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected StrategiaRazorPage()
        {
            LocalizationSourceName = StrategiaConsts.LocalizationSourceName;
        }
    }
}
