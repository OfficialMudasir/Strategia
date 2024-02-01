using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using Strategia.Dto;

namespace Strategia.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
