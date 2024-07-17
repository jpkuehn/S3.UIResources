using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Core.PropertyEditors;

namespace S3.UIResources.Startup;

///<summary>
/// Notes: In a Razor Class Library, the package.manifest file is not picked up by Umbraco. One of 2 options to deal with this:
/// 1. Read package.manifest with Stream. See:
///     https://dev.to/kevinjump/umbraco-10-razor-class-library-packages-pt1-3nfa
///     https://github.com/JasonElkin/Umbraco-Together-RCL-Demo-Package/tree/main/src/FontAwesome5Picker/Startup
/// 2. Create package.manifest programmatically. We're taking this approach below. See:
///     https://docs.umbraco.com/umbraco-cms/extending/property-editors/package-manifest#sample-manifest-with-csharp
///     https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-property-editor#setting-up-a-property-editor-with-csharp
///     https://dev.to/kevinjump/umbraco-10-razor-class-library-packages-pt1-3nfa

public class ManifestFilter : IManifestFilter {
    //private const string version = "1.0.0";

    private readonly IDataValueEditorFactory _dataValueEditorFactory;

    public ManifestFilter(IDataValueEditorFactory dataValueEditorFactory) {
        _dataValueEditorFactory = dataValueEditorFactory;
    }

    public void Filter(List<PackageManifest> manifests) {
        string ver = typeof(ManifestFilter).Assembly.GetName().Version.ToString(3);
        //string ver = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? version;

        manifests.Add(new PackageManifest {
            PackageName = "S3 DropDownList",
            PackageId = "S3DropDownList",
            Scripts = new[] {
                    "/App_Plugins/S3DropDownList/s3dropdownlist.controller.js"
                },
            Version = ver
        });

        manifests.Add(new PackageManifest {
            PackageName = "S3 RadioButtonList",
            PackageId = "S3RadioButtonList",
            Scripts = new[] {
                    "/App_Plugins/S3RadioButtonList/s3radiobuttonlist.controller.js"
                },
            Version = ver
        });
    }
}