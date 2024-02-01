using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Strategia.Files.Dtos;
using Strategia.Settings.Dtos.Syntaq.Falcon.Web;
using Strategia.Storage;
 
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Strategia.Files
{
    public class FilesManager : StrategiaDomainServiceBase
    {
        public IAbpSession _abpSession { get; set; }

 
        public IConfiguration Configuration { get; }
        private readonly IOptions<StorageConnection> _storageConnection;
        //private readonly IOptions<FileValidationService> _fileValidationService;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public FilesManager(
            IConfiguration configuration, 
            IOptions<StorageConnection> storageConnection, 
            //IOptions<FileValidationService> fileValidationService, 
            ITempFileCacheManager tempFileCacheManager             
        )
        {
            Configuration = configuration;
            _storageConnection = storageConnection;
            //_fileValidationService = fileValidationService;
            _tempFileCacheManager = tempFileCacheManager;

        }

        // Needs to be accessed via  an anonymous user
        //[Authorize(Policy = "EditByRecordMatterId")]
        public void SaveFile(SaveFileDto saveFileDto) //FilesDto?
        {
 

            bool IsAuthed = true;

            if (IsAuthed)
            {

                byte[] byteArray;
                var fileBytes = _tempFileCacheManager.GetFile(saveFileDto.File.Token.ToString());

                if (fileBytes == null)
                {
                    throw new UserFriendlyException("There is no such image file with the token: " + saveFileDto.File.Token);
                }
                else
                {

                    if (ValidateFile(fileBytes, saveFileDto.File.Name).Result)
                    {

                        using (var stream = new MemoryStream())
                        {
                            byteArray = fileBytes.ToArray();
                        }

                        // DefaultEndpointsProtocol=https;AccountName=straesanp;AccountKey=aj03kiQFZquxSaoFFRwiON89yVnMBzO4QKVUKFA/yGvnfpFxBnJ3MwLsj8uXYIFvONAvVMY0d0sZ+AStczStiA==;EndpointSuffix=core.windows.net

                        CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storageConnection.Value.ConnectionString);
                        //CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=straesanp;AccountKey=aj03kiQFZquxSaoFFRwiON89yVnMBzO4QKVUKFA/yGvnfpFxBnJ3MwLsj8uXYIFvONAvVMY0d0sZ+AStczStiA==;EndpointSuffix=core.windows.net");

                        string cloudStorageAccountTable = _storageConnection.Value.BlobStorageContainer;

                        CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
                        CloudBlobContainer container = blobClient.GetContainerReference(cloudStorageAccountTable);

                        // New Blob
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference("uploads" + "/" + saveFileDto.GroupId + "/" + saveFileDto.FileId + "/" + saveFileDto.File.Name);
                        blockBlob.UploadFromStream(new MemoryStream(byteArray));
                    }
                    else
                    {
                        throw new UserFriendlyException("Malware scan failed. ");
                    }

                }
            }
            else
            {
                throw new Exception();
            }
        }

        public async Task<bool> ValidateFile(byte[] file, string fname)
        {

            bool result = true;
            //var url = _fileValidationService.Value.Url;

            //if (!string.IsNullOrEmpty(url))
            //{
            //    using (var httpClient = new HttpClient())
            //    {

            //        var OcpApimSubscriptionKey = _fileValidationService.Value.OcpApimSubscriptionKey;
            //        var initiatedby = _fileValidationService.Value.ApiGovtNzInitiatedBy;

            //        using (var request = new HttpRequestMessage(new HttpMethod("POST"), url))
            //        {
            //            request.Headers.TryAddWithoutValidation("Transfer-Encoding", "chunked");
            //            request.Headers.TryAddWithoutValidation("Ocp-Apim-Subscription-Key", OcpApimSubscriptionKey); // rfx
            //            request.Headers.TryAddWithoutValidation("api-govt-nz-InitiatedBy", initiatedby);

            //            var multipartContent = new MultipartFormDataContent();

            //            var filecontent = new ByteArrayContent(file);
            //            multipartContent.Add(filecontent, fname);
            //            request.Content = multipartContent;

            //            var response = await httpClient.SendAsync(request);

            //            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            //            {
            //                result = true;
            //            }
            //            else
            //            {
            //                result = false;
            //            }

            //        }
            //    }
            //}

            return result;

        }
    }
}