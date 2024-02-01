using Microsoft.AspNetCore.Mvc;
using Strategia.Web.Controllers;

namespace Strategia.Web.Public.Controllers
{
    public class AboutController : StrategiaControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}