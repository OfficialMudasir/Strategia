using Abp.IO.Extensions;
using Abp.UI;
using Abp.Web.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Strategia.Files;
using Strategia.Files.Dtos;
using Strategia.Storage;
using Strategia.Web.Controllers;
using Syntaq.Falcon.Files;
 
using System.Linq;

namespace Syntaq.Falcon.Web.Controllers
{
    public abstract class FilesControllerBase : StrategiaControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;
         private readonly FilesManager _filesManager;

        protected FilesControllerBase(
            ITempFileCacheManager tempFileCacheManager,
            FilesManager filesManager
        )
        {
            _filesManager = filesManager;
            _tempFileCacheManager = tempFileCacheManager;
        }

        [AllowAnonymous]
        public UploadFilesOutput UploadFile(FileDto2 input)
        {
            if (!CheckFileTypeValidation(input.Type))
            {
                return new UploadFilesOutput
                {
                    FileName = input.Name,
                    FileType = input.Type
                };
            }
            try
            {
                var UploadedFile = Request.Form.Files.First();

                if (UploadedFile == null)
                {
                    throw new UserFriendlyException(L("ProfilePicture_Change_Error"));
                }

                byte[] fileBytes;
                using (var stream = UploadedFile.OpenReadStream())
                {
                    fileBytes = stream.GetAllBytes();
                }


                // STQ MODIFIED AV MALWARE SCANNING
                if (_filesManager.ValidateFile(fileBytes, input.Name).Result)
                {
                    if (input.IsPrevUpload == true)
                    {
                        _tempFileCacheManager.GetFile(input.FileToken);
                        _tempFileCacheManager.SetFile(input.FileToken, fileBytes);
                    }
                    else
                    {
                        _tempFileCacheManager.SetFile(input.FileToken, fileBytes);
                    }

                    return new UploadFilesOutput
                    {
                        FileToken = input.FileToken,
                        FileName = input.Name,
                        FileType = input.Type
                    };
                }
                else
                {
                    throw new UserFriendlyException("Malware scan failed. ");
                }

            }
            catch (UserFriendlyException ex)
            {
                return new UploadFilesOutput(new ErrorInfo(ex.Message));
            }
        }

        //Prevent File Upload Vulnerabilities. TODO keep adding unacceptable file types.
        private bool CheckFileTypeValidation(string fileType)
        {
            switch (fileType)
            {
                case "application/x-msdownload":
                    return false;
                case "application/x-zip-compressed":
                    return false;
                case null:
                    return false;
            }


            return true;
        }
    }
}
