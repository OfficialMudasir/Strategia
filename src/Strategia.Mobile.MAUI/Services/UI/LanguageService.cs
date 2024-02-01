using Abp.Dependency;

namespace Strategia.Mobile.MAUI.Services.UI
{
    public class LanguageService : ISingletonDependency
    {
        public event EventHandler OnLanguageChanged;

        public void ChangeLanguage()
        {
            OnLanguageChanged?.Invoke(this, EventArgs.Empty);
        }
    }
}
