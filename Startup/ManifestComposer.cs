using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace S3.UI.Resources.Startup; 
public class ManifestComposer : IComposer {
    public void Compose(IUmbracoBuilder builder) {
        builder.ManifestFilters().Append<ManifestFilter>();
    }
}
