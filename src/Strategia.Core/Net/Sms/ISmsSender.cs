using System.Threading.Tasks;

namespace Strategia.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}