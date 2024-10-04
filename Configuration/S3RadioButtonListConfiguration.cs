using Umbraco.Cms.Core.PropertyEditors;

namespace S3.UI.Resources.Configuration; 

public class S3RadioButtonListConfiguration {
    [ConfigurationField(
        "textKeys",
        "Text;Key Mapping",
        "textarea",
        Description = "Enter text;key items, each on a new line.<br />Example: <br />Select One;[blank]<br />Blue;blue<br />Blue Green;bluegreen")]
    public string? TextKeyMapping { get; set; }

    [ConfigurationField(
        "layoutDirection",
        "Layout Direction",
        "/_content/S3.UI.Resources/App_Plugins/S3RadioButtonList/layoutdirection.html",
        Description = "The layout direction")]
    public string? LayoutDirection { get; set; }
}
