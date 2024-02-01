using System.Threading.Tasks;
using Abp.Dependency;

namespace Strategia.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}