using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.IO;
using S3.UIResources.Configuration;

namespace S3.UIResources.DataEditors;

[DataEditor(
    alias: "S3.DropDownList",
    name: "S3 DropDownList",
    view: "/App_Plugins/S3DropDownList/s3dropdownlist.html",
    Group = "Lists",
    Icon = "icon-indent")]
public class S3DropDownList : DataEditor
{

    private readonly IIOHelper _ioHelper;

    public S3DropDownList(
        IDataValueEditorFactory dataValueEditorFactory,
        IIOHelper ioHelper) : base(dataValueEditorFactory)
    {
        _ioHelper = ioHelper;
    }

    protected override IConfigurationEditor CreateConfigurationEditor() => new S3DropDownListConfigurationEditor(_ioHelper);

}
