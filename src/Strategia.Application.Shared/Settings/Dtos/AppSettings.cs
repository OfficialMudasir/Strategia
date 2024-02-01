using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.Settings.Dtos
{
    namespace Syntaq.Falcon.Web
    {
        public class StorageConnection
        {
            public string ConnectionString { get; set; }
            public string BlobStorageContainer { get; set; }
        }

        public class FileValidationService
        {
            public string Url { get; set; }
            public string OcpApimSubscriptionKey { get; set; }
            public string ApiGovtNzInitiatedBy { get; set; }
        }

        public class AppConfig
        {
            public string WebSiteRootAddress { get; set; }
            public string RedirectAllowedExternalWebSites { get; set; }
            public string SwaggerEndPoint { get; set; }
        }   
    }

}
