using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace S3.UI.Resources.Configuration;

public class S3RadioButtonListConfigurationEditor : ConfigurationEditor<S3RadioButtonListConfiguration> {

    [Obsolete]
    public S3RadioButtonListConfigurationEditor(IIOHelper ioHelper) : base(ioHelper) {
    }

}
