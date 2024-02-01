using Abp.Web.Models;
using Castle.MicroKernel.Registration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.Files
{
    public class UploadFilesOutput : ErrorInfo
    {
        public string FileName { get; set; }

        public string FileType { get; set; }

        public string FileToken { get; set; }

        public UploadFilesOutput()
        {

        }

        public UploadFilesOutput(ErrorInfo error)
        {
            Code = error.Code;
            Details = error.Details;
            Message = error.Message;
            ValidationErrors = error.ValidationErrors;
        }
    }
}
