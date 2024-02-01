//using Abp.Domain.Repositories;
//using Abp.Runtime.Session;
//using Abp.UI;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Options;
//using Microsoft.WindowsAzure.Storage;
//using Microsoft.WindowsAzure.Storage.Blob;
//using Strategia;
//using Strategia.Files.Dtos;
//using Strategia.Settings.Dtos.Syntaq.Falcon.Web;
//using Strategia.Storage;
//using System;
//using System.Diagnostics;
//using System.IO;
//using System.Linq;
//using System.Net.Http;
//using System.Threading.Tasks;

//namespace Syntaq.Falcon.Files
//{
//    public class FilesManager : StrategiaDomainServiceBase
//    {
//        public IAbpSession _abpSession { get; set; }

//        public IConfiguration Configuration { get; }
//        private readonly IOptions<StorageConnection> _storageConnection;
//        private readonly IOptions<FileValidationService> _fileValidationService;
//        private readonly ITempFileCacheManager _tempFileCacheManager;

//        public FilesManager(
//            IConfiguration configuration, 
//            IOptions<StorageConnection> storageConnection, 
//            IOptions<FileValidationService> fileValidationService, 
//            ITempFileCacheManager tempFileCacheManager
//        )
//        {
//            Configuration = configuration;
//            _storageConnection = storageConnection;
//            _fileValidationService = fileValidationService;
//            _tempFileCacheManager = tempFileCacheManager;
//        }

//        // Needs to be accessed via  an anonymous user
//        //[Authorize(Policy = "EditByRecordMatterId")]
//        public void SaveFile(SaveFileDto input) //FilesDto?
//        {
 
//            if (true)
//            {

//                byte[] byteArray;
//                var fileBytes = input.File.FileByte; //  _tempFileCacheManager.GetFile(input.File.Token.ToString());

//                if (fileBytes == null)
//                {
//                    throw new UserFriendlyException("There is no such image file with the token: " + input.File.Token);
//                }
//                else
//                {

//                    if (true)
//                    {
//                        //files stored related to groupId, 
//                        //groupId = recordmatterId, parsing from form schema, project, recordmatterId=recordmatterId, but for form, rmiId is different from form schema rmiId
 
 
//                        using (var stream = new MemoryStream())
//                        {
//                            byteArray = fileBytes.ToArray();
//                        }

//                        CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storageConnection.Value.ConnectionString);
//                        string cloudStorageAccountTable = _storageConnection.Value.BlobStorageContainer;

//                        CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
//                        CloudBlobContainer container = blobClient.GetContainerReference(cloudStorageAccountTable);

//                        // New Blob
//                        CloudBlockBlob blockBlob = container.GetBlockBlobReference("file-uploads" + "/" + input.GroupId + "/" + input.FileId + "/" + input.File.Name);
//                        blockBlob.UploadFromStream(new MemoryStream(byteArray));
//                    }
//                    else
//                    {
//                        throw new UserFriendlyException("Malware scan failed. ");
//                    }

//                }
//            }
//            else
//            {
//                throw new Exception();
//            }
//        }
 
//    }
//}