using Microsoft.AspNetCore.Mvc;
using Strategia.Web.Controllers;

namespace Strategia.Web.Public.Controllers
{
    public class HomeController : StrategiaControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}