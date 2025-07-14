export default function Structure() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">📊 Section 1: Understanding QTI Assessment Structure</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Before diving into code, it's essential to grasp the overall structure and hierarchy that QTI XML is based on. Think of QTI as a framework for describing digital assessments that can be interpreted by any QTI-compliant system. These systems include learning management systems, test delivery platforms, and analytics tools. The format is designed to separate content from presentation and logic, making it highly portable and reusable.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        At its core, QTI represents an assessment in a modular, layered way. Each layer builds on the previous to define:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>What the test is (overall structure)</li>
        <li>How the test is organized (sections and parts)</li>
        <li>What questions are asked (individual items)</li>
        <li>How responses are collected (interactions)</li>
        <li>How responses are evaluated (scoring and feedback)</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Let's break down each major building block of a QTI assessment:
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Assessment Test (&lt;assessmentTest&gt;)</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        This is the top-level container and represents the entire test. It doesn't hold content directly—it links to sections and items. It can define global behaviors like navigation, submission rules, timing, and outcome reporting.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        Think of this as the "table of contents" or controller that references all other parts of the test. You can create one test file that includes many items, split across multiple sections, with defined flow logic if needed.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">2. Test Part (&lt;testPart&gt;) and Assessment Section (&lt;assessmentSection&gt;)</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Each test can be divided into one or more parts. A part is a major segment of the test (e.g., Reading, Listening). Within each part, you can organize questions using sections. This makes it easier to manage navigation rules (e.g., whether users can skip questions or go back).
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Sections can also be used to:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Group items by topic or skill</li>
        <li>Add section-level time limits or metadata</li>
        <li>Randomize item order within the section</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        A section does not contain question content directly—it references &lt;assessmentItemRef&gt; elements that point to the actual items.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">3. Assessment Item (&lt;assessmentItem&gt;)</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This is where the question lives. An assessment item includes everything needed for a single question: the prompt, the interaction (e.g., multiple choice, essay), the correct answer(s), and how to score the response.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Each item can include:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>One or more interactions, like multiple choice, text input, matching</li>
        <li>Stimulus materials, like passages, images, audio</li>
        <li>Response declarations to define expected answers</li>
        <li>Scoring logic using templates or custom rules</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Items are typically stored in their own XML files for reuse and modularity.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">4. Item Body (&lt;itemBody&gt;) and Interactions</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The body of the item defines the actual content shown to the user. This includes the question text, formatting, and any embedded media. Most importantly, it contains the interaction type, which defines how the user can respond.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Examples of interaction types:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>choiceInteraction</code> for multiple-choice and single-answer</li>
        <li><code>textEntryInteraction</code> for short-answer text input</li>
        <li><code>matchInteraction</code> for drag-and-drop or pair-matching</li>
        <li><code>extendedTextInteraction</code> for essays or long answers</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Every interaction has an associated <code>responseIdentifier</code>, which links it to the scoring logic in the response declaration.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">5. Response Declaration (&lt;responseDeclaration&gt;)</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        This defines what kind of response the system expects and what the correct answer is. It includes the cardinality (e.g., one answer, multiple answers) and the baseType (e.g., identifier, string, float).
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        It also contains the &lt;correctResponse&gt; tag, which provides the correct answer(s) and optionally a &lt;mapping&gt; for partial credit scoring.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">6. Response Processing (&lt;responseProcessing&gt;)</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This tells the system how to score the user's response. QTI supports both simple scoring templates and detailed custom logic using &lt;responseCondition&gt; and branching structures.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Built-in templates make it easy to define right/wrong scoring without needing to write complex XML. For example:
      </p>
      
      <pre className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
        <code>&lt;responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/&gt;</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-6">
        Custom scoring logic is helpful for advanced scenarios such as multiple-correct answers, conditional feedback, or rubric-based scoring.
      </p>
      
      <p className="text-lg leading-relaxed">
        When you understand these six core elements, you can begin assembling assessments that are interoperable, scalable, and flexible. QTI encourages separating logic from content, which promotes better testing design and easier maintenance over time.
      </p>
    </div>
  );
}