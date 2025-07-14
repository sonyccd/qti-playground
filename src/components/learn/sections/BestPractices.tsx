export default function BestPractices() {
  return <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">🔍 Section 10: Best Practices</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Writing QTI-compliant assessment content is more than just following XML rules. It requires discipline, planning, and a good understanding of both technical constraints and instructional design principles. Whether you're creating a few items or scaling to thousands, these best practices will help you build robust, reusable, and learner-friendly QTI assessments.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧱 1. Structure Your Content Modularly</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>One item per file:</strong> Always author each <code>&lt;assessmentItem&gt;</code> in its own XML file.</li>
        <li><strong>Reuse items across tests:</strong> By referencing items using <code>&lt;assessmentItemRef&gt;</code>, you can use the same questions in multiple tests.</li>
        <li><strong>Keep media in separate folders:</strong> Organize <code>/media/images</code>, <code>/media/audio</code>, etc., so they're easy to maintain and reference.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> It improves clarity, enables content reuse, and reduces the chance of accidental changes.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🆔 2. Use Consistent Naming Conventions</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>Use lowercase with dashes or underscores:</strong> <code>reading-item-001.xml</code></li>
        <li><strong>Prefix by section if applicable:</strong> <code>listen_q1</code>, <code>math_q12</code></li>
        <li><strong>Media files should match the item ID when possible:</strong> <code>item12-diagram.png</code></li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Clean and predictable naming helps with automation, debugging, and team collaboration.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🔐 3. Ensure ID Matching and Linking</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Your <code>responseIdentifier</code> in the interaction must match the <code>identifier</code> in the <code>&lt;responseDeclaration&gt;</code>.</li>
        <li>Outcome variables used in <code>&lt;responseProcessing&gt;</code> must match declarations in <code>&lt;outcomeDeclaration&gt;</code>.</li>
        <li>All media <code>src</code> values must point to valid, existing files using relative paths.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Mismatched or broken references are one of the most common QTI errors and lead to delivery failures.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🧪 4. Validate Early and Often</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Use tools like QTIWorks, IMS validators, or your delivery platform's preview tools to catch errors early.</li>
        <li>Don't wait until everything is written—test incrementally.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> A single syntax error can prevent a whole package from loading. Catching issues early saves time and rework.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">📊 5. Start Simple, Then Layer in Complexity</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Begin with <code>match_correct</code> templates before jumping into custom scoring logic.</li>
        <li>Add media or advanced interaction types only after verifying your base logic works.</li>
        <li>Avoid premature optimization—get basic functionality working first.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Complex scoring logic or branching can introduce hard-to-debug problems. Build confidence with simple items.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🧠 6. Design for Accessibility</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Always provide alt text for images and transcripts for audio/video.</li>
        <li>Use semantic HTML tags (e.g., <code>&lt;p&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;table&gt;</code>) to create structured, screen-reader-friendly content.</li>
        <li>Avoid relying solely on color or images to convey meaning.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Accessible assessments ensure that all learners—including those using assistive technologies—can participate fully.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">📜 7. Comment and Document</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Use XML comments <code>&lt;!-- like this --&gt;</code> to explain complex logic, mappings, or deviations.</li>
        <li>Keep a README or documentation file with:
          <ul className="ml-6 mt-2 space-y-2">
            <li>An overview of the test</li>
            <li>How to validate or preview items</li>
            <li>Platform-specific caveats</li>
          </ul>
        </li>
        <li>Document authoring decisions (e.g., partial credit logic or scoring rubrics).</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> This makes onboarding new authors easier and protects your content from becoming a mystery six months from now.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🧠 8. Write with Clarity and Purpose</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Keep prompts concise and unambiguous.</li>
        <li>Align content with learning objectives and test blueprints.</li>
        <li>Use plain language unless technical vocabulary is required.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Clear and aligned questions yield better assessment validity and reduce student confusion.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🔄 9. Plan for Maintenance and Versioning</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Use version numbers in filenames or metadata (<code>item001_v2.xml</code>).</li>
        <li>Store older versions in an <code>archive/</code> folder or use version control (e.g., Git).</li>
        <li>Track change history for each item or test part.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Helps with audits, error tracing, and updating outdated content.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🔧 10. Know Platform Limitations</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Not all QTI delivery engines support every QTI feature (e.g., <code>hotspotInteraction</code>, advanced branching).</li>
        <li>Stick with widely-supported interaction types for maximum compatibility.</li>
        <li>Test your items in the target platform, not just a generic validator.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Valid QTI ≠ Deliverable QTI. Platform quirks matter more than spec compliance in practice.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🧬 11. Plan Scoring Consistency Across Items</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Decide on consistent scoring weights (e.g., each item worth 1 point).</li>
        <li>Use either template scoring or mapped scoring consistently within a section.</li>
        <li>Use outcome variables (<code>SCORE</code>, <code>TOTAL_SCORE</code>) intentionally and consistently.</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Inconsistent scoring leads to confusing results for test-takers and harder analysis for you.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">🛠 12. Use Tools to Your Advantage</h2>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>Authoring tools:</strong> TAO, Respondus, Moodle's QTI export</li>
        <li><strong>Validation tools:</strong> QTIWorks, IMS validator</li>
        <li><strong>Scripting:</strong> Use Python/Java/XML libraries to batch-generate, transform, or validate content</li>
        <li><strong>Spreadsheet-to-QTI converters</strong> for item generation</li>
      </ul>
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-lg">
          <strong>✅ Why it matters:</strong> Manually editing dozens of XML files can be tedious and error-prone. Automation saves time and ensures consistency.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4 text-green-600">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Mastering QTI means more than understanding XML tags—it's about designing assessments that are valid, fair, reusable, and compatible across platforms. By following best practices around structure, naming, scoring, accessibility, and validation, you'll be well-positioned to build high-quality assessments that scale.
      </p>
      
      <p className="text-lg leading-relaxed">
        You'll also save yourself (and your team) time, frustration, and support tickets down the road.
      </p>
    </div>;
}