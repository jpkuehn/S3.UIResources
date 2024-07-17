using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace S3.UIResources.Startup; 
public class ManifestComposer : IComposer {
    public void Compose(IUmbracoBuilder builder) {
        builder.ManifestFilters().Append<ManifestFilter>();
    }
}
