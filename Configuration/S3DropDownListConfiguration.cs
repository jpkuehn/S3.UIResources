using System.ComponentModel.DataAnnotations;
using Umbraco.Cms.Core.PropertyEditors;

namespace S3.UIResources.Configuration;

public class S3DropDownListConfiguration {
    [ConfigurationField(
        "textKeys",
        "Text;Key Mapping",
        "textarea",
        Description = "Enter text;key items, each on a new line.<br />Example: <br />Select One;[blank]<br />Blue;blue<br />Blue Green;bluegreen")]
    public string? TextKeyMapping { get; set; }
}
