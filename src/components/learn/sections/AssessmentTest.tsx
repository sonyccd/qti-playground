import { XmlCodeBlock } from '../XmlCodeBlock';

export default function AssessmentTest() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🧪 Section 8: Creating an Entire Test with &lt;assessmentTest&gt;</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        While individual QTI items are powerful on their own, real-world assessments usually consist of many items organized into sections and governed by test-level rules. That's where the <code>&lt;assessmentTest&gt;</code> element comes in.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;assessmentTest&gt;</code> structure enables you to:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>Organize multiple items into a coherent exam</li>
        <li>Apply navigation rules (linear vs. nonlinear)</li>
        <li>Group items by sections (e.g., Reading, Listening)</li>
        <li>Control timing, submission behavior, and outcome reporting</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        This section explains how to create a full test using QTI XML and how each of its components fits together.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧱 Basic Structure of &lt;assessmentTest&gt;</h2>

      <XmlCodeBlock code={`<assessmentTest xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
                identifier="sampleTest" title="Sample Test">

  <testPart identifier="part1" navigationMode="nonlinear" submissionMode="individual">
    <assessmentSection identifier="section1" title="Reading Section">
      <assessmentItemRef identifier="item1" href="item1.xml"/>
      <assessmentItemRef identifier="item2" href="item2.xml"/>
    </assessmentSection>
  </testPart>

</assessmentTest>`} />

      <p className="text-lg leading-relaxed mb-6">
        At a glance:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>The root is <code>&lt;assessmentTest&gt;</code>.</li>
        <li>It contains one or more <code>&lt;testPart&gt;</code> elements.</li>
        <li>Each part contains <code>&lt;assessmentSection&gt;</code> elements.</li>
        <li>Each section references individual items using <code>&lt;assessmentItemRef&gt;</code>.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🔍 Element-by-Element Breakdown</h2>

      <h3 className="text-2xl font-semibold mb-4">1. &lt;assessmentTest&gt;</h3>
      
      <p className="text-lg leading-relaxed mb-4">
        This is the outermost wrapper of the test. Like <code>&lt;assessmentItem&gt;</code>, it has metadata and acts as a container.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>identifier:</strong> Unique ID for the test</li>
        <li><strong>title:</strong> Human-readable name (not shown to users)</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        It may also contain:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>&lt;outcomeDeclaration&gt;</code>: For test-level scoring or reporting</li>
        <li><code>&lt;stylesheet&gt;</code>: Optional styles for appearance</li>
        <li><code>&lt;rubricBlock&gt;</code>: Global instructions for the entire test</li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4">2. &lt;testPart&gt;</h3>
      
      <p className="text-lg leading-relaxed mb-4">
        Each test can be broken into one or more test parts. For example:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Part 1: Listening</li>
        <li>Part 2: Reading</li>
        <li>Part 3: Writing</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-4">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>identifier:</strong> Unique ID for the part</li>
        <li><strong>navigationMode:</strong> Can be:
          <ul className="ml-6 mt-2 space-y-2">
            <li><code>linear</code>: Test-taker must move forward without going back</li>
            <li><code>nonlinear</code>: Test-taker can freely navigate between items</li>
          </ul>
        </li>
        <li><strong>submissionMode:</strong> Can be:
          <ul className="ml-6 mt-2 space-y-2">
            <li><code>individual</code>: Each item is submitted when answered</li>
            <li><code>simultaneous</code>: All items are submitted together</li>
          </ul>
        </li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        You can also define part-level timing and instructions.
      </p>

      <h3 className="text-2xl font-semibold mb-4">3. &lt;assessmentSection&gt;</h3>
      
      <p className="text-lg leading-relaxed mb-4">
        A test part can contain one or more sections, which are useful for grouping related items.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>identifier:</strong> Unique section ID</li>
        <li><strong>title:</strong> Display title (e.g., "Grammar", "Vocabulary")</li>
        <li><strong>visible:</strong> Whether the section title and content should be shown</li>
        <li><strong>shuffle:</strong> Randomize order of referenced items</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        You can nest sections for hierarchy and organization (e.g., "Part A" and "Part B" within "Reading").
      </p>

      <h3 className="text-2xl font-semibold mb-4">4. &lt;assessmentItemRef&gt;</h3>
      
      <p className="text-lg leading-relaxed mb-4">
        This tag references an external item file. The referenced file should contain a complete <code>&lt;assessmentItem&gt;</code>.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>identifier:</strong> Unique label for the reference (not the item itself)</li>
        <li><strong>href:</strong> Relative path to the item file</li>
        <li><strong>required:</strong> Optional flag to mark whether the item must be delivered</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Each item should live in its own .xml file (e.g., item1.xml, item2.xml), usually stored alongside the test file or in a folder.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧭 Navigation Modes</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Choosing the right navigationMode and submissionMode is critical for test behavior.
      </p>
      
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Navigation Mode</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>linear</code></td>
              <td className="border border-gray-300 px-4 py-2">Test-taker cannot go back to previous items</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>nonlinear</code></td>
              <td className="border border-gray-300 px-4 py-2">Allows jumping between items freely</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Submission Mode</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>individual</code></td>
              <td className="border border-gray-300 px-4 py-2">Each item is submitted as it's completed</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>simultaneous</code></td>
              <td className="border border-gray-300 px-4 py-2">All responses submitted at once at end of test</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="text-lg">
          <strong>💡 Tip:</strong> Use linear + individual for strict, time-pressured exams. Use nonlinear + simultaneous for flexible, reviewable tests.
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">⏱ Timing and Control</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        You can control timing at different levels:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>Test-level timing:</strong> Total duration for the whole test</li>
        <li><strong>Section-level timing:</strong> Per-section time limits</li>
        <li><strong>Item-level timing:</strong> Per-question timers (set in the item file)</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-4">
        Timing is usually enforced by the delivery platform, but you must declare it in your QTI XML for compatibility.
      </p>

      <XmlCodeBlock code={`<timeLimits maxTime="1800"/> <!-- 30 minutes -->`} />

      <p className="text-lg leading-relaxed mb-6">
        This tag can be added inside <code>&lt;assessmentTest&gt;</code>, <code>&lt;testPart&gt;</code>, or <code>&lt;assessmentSection&gt;</code>.
      </p>

      <h2 className="text-3xl font-semibold mb-4">📋 Declaring Outcomes at the Test Level</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        You may also include outcome declarations at the test level (like total scores, pass/fail status, or custom outcomes).
      </p>

      <XmlCodeBlock code={`<outcomeDeclaration identifier="TOTAL_SCORE" baseType="float" cardinality="single">
  <defaultValue><value>0</value></defaultValue>
</outcomeDeclaration>`} />

      <p className="text-lg leading-relaxed mb-6">
        These outcomes can be set based on scoring rules and referenced in result reporting.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧠 Advanced Features</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        QTI tests support advanced capabilities like:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>Branching logic:</strong> Show or hide sections based on previous answers (complex but powerful)</li>
        <li><strong>Test feedback:</strong> Provide conditional feedback at the end of a section or the entire test</li>
        <li><strong>Randomized item selection:</strong> Pull items from a pool using <code>&lt;assessmentSection&gt;</code> with a selection mechanism</li>
        <li><strong>Adaptive parts:</strong> Switch content dynamically based on performance (rare and advanced)</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">📁 File Structure Best Practices</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Here's an example of a clean QTI test package structure:
      </p>

      <XmlCodeBlock code={`/my_test/
├── test.xml
├── item1.xml
├── item2.xml
├── images/
│   └── passage1.png
├── audio/
│   └── clip1.mp3
└── qti_manifest.xml`} />

      <ul className="text-lg space-y-3 mb-6">
        <li>Keep all item files modular and reusable.</li>
        <li>Reference resources using relative paths.</li>
        <li>Include a manifest (qti_manifest.xml) for LMS/platform compatibility.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧭 Authoring and Maintenance Tips</h2>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>Give clear, consistent identifier values for parts and sections.</li>
        <li>Test your navigation behavior in a QTI-compatible player (like TAO or QTIWorks).</li>
        <li>Consider splitting long tests into multiple parts for ease of scoring and review.</li>
        <li>Document timing, scoring, and navigation rules in comments or metadata.</li>
        <li>Reuse item files across different tests by referencing them in different contexts.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4 text-green-600">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The <code>&lt;assessmentTest&gt;</code> element is what ties your individual questions together into a structured, deliverable exam. It lets you define:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Navigation and submission rules</li>
        <li>Timing constraints</li>
        <li>Section organization</li>
        <li>How items are presented and scored</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        By mastering test assembly, you unlock the full power of QTI—not just for single questions, but for entire exams that are portable, adaptive, and standards-compliant.
      </p>
    </div>
  );
}