using Abp.Application.Services.Dto;
using Abp.AspNetZeroCore.Net;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Azure.Storage.Blobs;
using Castle.Core.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Strategia;
using Strategia.Dto;
using Strategia.Files.Dtos;
using Strategia.Settings.Dtos.Syntaq.Falcon.Web;
using Strategia.Storage;
using Strategia.UserProfiles;
using Strategia.UserProfiles.Dtos;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;


namespace Syntaq.Falcon.Files
{
    public class Files : StrategiaDomainServiceBase, IFilesAppService
    {
        public IAbpSession _abpSession { get; set; }

        public IConfiguration Configuration { get; }
        private readonly IOptions<StorageConnection> _storageConnection;
        private readonly IOptions<FileValidationService> _fileValidationService;

        private readonly ITempFileCacheManager _tempFileCacheManager;

        public Files(
            IConfiguration configuration,
            IOptions<StorageConnection> storageConnection,
            IOptions<FileValidationService> fileValidationService,
            ITempFileCacheManager tempFileCacheManager
        )
        {
            Configuration = configuration;
            _storageConnection = storageConnection;
            _fileValidationService = fileValidationService;
            _tempFileCacheManager = tempFileCacheManager;
        }

        // Needs to be accessed via  an anonymous user
        //[Authorize(Policy = "EditByRecordMatterId")]
        public void SaveFile(SaveFileDto input) //FilesDto?
        {

            if (true)
            {

                byte[] byteArray;
                var fileBytes = input.File.FileByte; //  _tempFileCacheManager.GetFile(input.File.Token.ToString());

                if (fileBytes == null)
                {
                    throw new UserFriendlyException("There is no such image file with the token: " + input.File.Token);
                }
                else
                {

                    if (true)
                    {
                        //files stored related to groupId, 
                        //groupId = recordmatterId, parsing from form schema, project, recordmatterId=recordmatterId, but for form, rmiId is different from form schema rmiId


                        using (var stream = new MemoryStream())
                        {
                            byteArray = fileBytes.ToArray();
                        }

                        CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(_storageConnection.Value.ConnectionString);
                        string cloudStorageAccountTable = _storageConnection.Value.BlobStorageContainer;

                        CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
                        CloudBlobContainer container = blobClient.GetContainerReference(cloudStorageAccountTable);

                        // New Blob
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference("file-uploads" + "/" + input.GroupId + "/" + input.FileId + "/" + input.File.Name);
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

        public virtual async Task<PagedResultDto<CloudFileDto>> GetCloudFiles(GetCloudFilesInput input)
        {
            try
            {

                // USE INPUT TO CHECK ACESS TO FILES
                //"userprofiles/89aabe61-8f06-4664-402a-08dbba39b6d4/certificates/9ec8a52e-34b5-43c8-a0ce-6d6e0eb533f1"

                var blobServiceClient = new BlobServiceClient(_storageConnection.Value.ConnectionString);
                var container = blobServiceClient.GetBlobContainerClient(_storageConnection.Value.BlobStorageContainer);

                var blobList = new List<CloudFileDto>();
                var blobs = container.GetBlobsAsync(prefix: input.Path);

                await foreach (var blobItem in blobs)
                {
                    var blobClient = container.GetBlobClient(blobItem.Name);
                    var blobProperties = await blobClient.GetPropertiesAsync();

                    blobList.Add(new CloudFileDto
                    {
                        Id = blobItem.Name,
                        Name = blobItem.Name,
                        Url = blobClient.Uri.AbsoluteUri,
                        Size = blobProperties.Value.ContentLength,
                        LastModified = blobProperties.Value.LastModified
                    });
                }

                var totalCount = blobList.Count;

                return new PagedResultDto<CloudFileDto>(totalCount, blobList);
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                throw;
            }
        }

        public async Task<FileDto> DownloadCloudFile(string filepath)
        {
            try
            {
                var blobServiceClient = new BlobServiceClient(_storageConnection.Value.ConnectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient(_storageConnection.Value.BlobStorageContainer);

                // Get a reference to the blob
                var blobClient = containerClient.GetBlobClient(filepath);

                // Check if the blob exists
                if (await blobClient.ExistsAsync())
                {
                    // Get the blob stream
                    var blobDownloadInfo = await blobClient.DownloadAsync();

                    // Determine the content type
                    var contentType = blobDownloadInfo.Value.ContentType;
                    var blobStream = blobDownloadInfo.Value.Content;

                    // Convert the blob stream to a byte array
                    byte[] byteArray;
                    using (var memoryStream = new MemoryStream())
                    {
                        await blobStream.CopyToAsync(memoryStream);
                        byteArray = memoryStream.ToArray();
                    }

                    string filename =System.IO.Path.GetFileName(filepath);
                    // Create file DTO and set the byte array to the cache manager
                    var file = new FileDto(filename, contentType);
                    _tempFileCacheManager.SetFile(file.FileToken, byteArray);

                    return file;
                }
                else
                {
                    // The blob does not exist
                    // Handle the case where the blob is not found, e.g., return null or throw an exception
                }
            }
            catch (Exception ex)
            {
                // Log the exception, return a user-friendly message or rethrow as appropriate
                // Handle exceptions, e.g., log the error and return null or rethrow
            }

            return null;
        }


    }
}