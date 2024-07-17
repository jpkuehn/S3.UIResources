using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

namespace S3.UIResources.Configuration;

public class S3DropDownListConfigurationEditor : ConfigurationEditor<S3DropDownListConfiguration> {

    [Obsolete]
    public S3DropDownListConfigurationEditor(IIOHelper ioHelper) : base(ioHelper) {
    }

}