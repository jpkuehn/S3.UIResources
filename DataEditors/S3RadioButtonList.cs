using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using S3.UI.Resources.Configuration;

namespace S3.UI.Resources.DataEditors;

[DataEditor(
    alias: "S3.RadioButtonList",
    name: "S3 RadioButtonList",
    view: "/_content/S3.UI.Resources/App_Plugins/S3RadioButtonList/s3radiobuttonlist.html",
    Group = "Lists",
    Icon = "icon-target")]
public class S3RadioButtonList : DataEditor
{

    private readonly IIOHelper _ioHelper;

    public S3RadioButtonList(
        IDataValueEditorFactory dataValueEditorFactory,
        IIOHelper ioHelper) : base(dataValueEditorFactory)
    {
        _ioHelper = ioHelper;
    }

    protected override IConfigurationEditor CreateConfigurationEditor() => new S3RadioButtonListConfigurationEditor(_ioHelper);
}
