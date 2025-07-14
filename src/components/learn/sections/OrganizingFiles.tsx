import { XmlCodeBlock } from '../XmlCodeBlock';

export default function OrganizingFiles() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">📂 Section 9: Organizing Files</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Creating a QTI assessment involves not just writing well-structured XML files, but also organizing those files in a way that makes them easy to maintain, share, and deploy. A properly organized QTI package ensures compatibility with delivery platforms, simplifies troubleshooting, and makes collaboration between team members easier.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This section provides guidelines for organizing your files and folders, explains the importance of the manifest file, and gives an overview of how to bundle your assessment into a portable package.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧱 Core File Types in a QTI Assessment</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Here's an overview of the types of files typically included in a QTI project:
      </p>
      
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">File Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>assessmentTest.xml</code></td>
              <td className="border border-gray-300 px-4 py-2">Defines the overall test structure, sections, navigation, and item refs</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>itemX.xml</code></td>
              <td className="border border-gray-300 px-4 py-2">Individual question files, each representing one &lt;assessmentItem&gt;</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Media files</td>
              <td className="border border-gray-300 px-4 py-2">Images, audio, video referenced in questions</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>qti_manifest.xml</code></td>
              <td className="border border-gray-300 px-4 py-2">Lists and categorizes all resources in the package (strongly recommended)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Stylesheets (optional)</td>
              <td className="border border-gray-300 px-4 py-2">CSS files for styling, if the platform supports it</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Metadata files</td>
              <td className="border border-gray-300 px-4 py-2">Additional documentation or tagging info for items/tests</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-semibold mb-4">📁 Example Directory Structure</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        A clean and modular project layout may look like this:
      </p>

      <XmlCodeBlock code={`/my_qti_assessment/
├── test.xml                     # The assessmentTest file
├── item1.xml                    # First question
├── item2.xml                    # Second question
├── item3.xml                    # Third question
├── qti_manifest.xml             # Optional manifest file
├── /media/                      # Images, audio, videos
│   ├── passage1.png
│   └── clip1.mp3
└── /metadata/                   # Optional metadata per item
    └── item1_meta.xml`} />

      <p className="text-lg leading-relaxed mb-6">
        You can group large assessments into subfolders, like <code>/items/reading/item1.xml</code> if helpful. The href in your item references should use relative paths.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🗃 The Manifest File: qti_manifest.xml</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        While technically optional in some environments, a manifest is often required by delivery platforms, especially those using IMS Content Packaging.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">
        The manifest:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Declares every file used in your test</li>
        <li>Categorizes files by type (item, test, media, metadata)</li>
        <li>Associates identifiers with actual file paths</li>
        <li>Defines dependencies between resources</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4">Simplified Example:</h3>

      <XmlCodeBlock code={`<manifest identifier="qti-package"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:imsqti="http://www.imsglobal.org/xsd/imsqti_v2p2">
  <resources>
    <resource identifier="test1" type="imsqti.test" href="test.xml">
      <file href="test.xml"/>
      <dependency identifierref="item1"/>
      <dependency identifierref="item2"/>
    </resource>
    <resource identifier="item1" type="imsqti.item" href="item1.xml">
      <file href="item1.xml"/>
    </resource>
    <resource identifier="item2" type="imsqti.item" href="item2.xml">
      <file href="item2.xml"/>
    </resource>
  </resources>
</manifest>`} />

      <h2 className="text-3xl font-semibold mb-4">🧳 Packaging for Delivery</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        When you're ready to deliver your QTI assessment, it should be zipped into a QTI-compliant package that includes:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>All item files</li>
        <li>The test file</li>
        <li>Media assets (in subfolders)</li>
        <li>Manifest file</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4">Naming Tips:</h3>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Use clear, lowercase, dash-separated names: <code>reading-part1.xml</code>, <code>item-001.xml</code>, etc.</li>
        <li>Avoid spaces and special characters to improve cross-platform compatibility.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Many tools, such as TAO and Moodle, expect a ZIP file with a proper manifest. Double-check your packaging guidelines before upload.
      </p>

      <h2 className="text-3xl font-semibold mb-4">💡 Tips for Team Collaboration</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        If you're working in a team:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>Use version control (e.g., Git) to manage XML changes</li>
        <li>Store each item in its own file for easy review</li>
        <li>Keep naming conventions consistent</li>
        <li>Separate finalized content from drafts (e.g., <code>/drafts/</code>, <code>/approved/</code> folders)</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧠 Best Practices for File Organization</h2>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>🔍 Keep items modular:</strong> Each item should live in its own file so it can be reused.</li>
        <li><strong>📁 Group by section or part:</strong> Organize folders by test part (e.g., <code>/listening/</code>, <code>/writing/</code>).</li>
        <li><strong>🔗 Use relative paths:</strong> Always refer to media and item files with relative paths (e.g., <code>../media/image1.png</code>).</li>
        <li><strong>📦 Include a manifest:</strong> Even if not required, it's best to include <code>qti_manifest.xml</code> for future portability.</li>
        <li><strong>🧾 Document dependencies:</strong> If an item requires audio or a passage, include a comment or metadata file describing this.</li>
        <li><strong>✅ Validate before upload:</strong> Use a QTI validation tool (like QTIWorks) to ensure your file structure is complete and well-formed.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4 text-green-600">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        How you organize your QTI files can make or break the success of your test delivery. A well-organized assessment:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Is easier to debug and maintain</li>
        <li>Promotes reusability across multiple tests</li>
        <li>Is more likely to be accepted by delivery platforms</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Always treat your assessment like a software project: keep things modular, use clear naming, and include all dependencies. A clean file structure is the foundation of a scalable assessment ecosystem.
      </p>
    </div>
  );
}