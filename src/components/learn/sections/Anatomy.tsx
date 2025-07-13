import { XmlCodeBlock } from '../XmlCodeBlock';

export default function Anatomy() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📦 Section 2: The Basic Anatomy of a QTI File</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Understanding the structure of a QTI XML file is critical for reading and authoring assessment items. In this section, we'll walk through a simple example and then dissect it to understand what each part does. This knowledge forms the foundation for building your own QTI-compliant content.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI XML is structured hierarchically. Every element in a QTI file serves a distinct purpose and must follow specific rules. However, once you understand the main elements and how they relate to one another, creating a basic item becomes straightforward.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        Let's start with a common use case: a single multiple-choice question. This is one of the simplest types of items in QTI and a great starting point for learning.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧾 Full XML Example: A Simple Multiple-Choice Item</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Here's a complete XML file for a single assessment item:
      </p>
      
      <XmlCodeBlock code={`<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
                identifier="item1" title="Example Multiple Choice"
                adaptive="false" timeDependent="false">

  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>choiceA</value>
    </correctResponse>
  </responseDeclaration>

  <itemBody>
    <p>What is the capital of France?</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
      <simpleChoice identifier="choiceA">Paris</simpleChoice>
      <simpleChoice identifier="choiceB">London</simpleChoice>
      <simpleChoice identifier="choiceC">Rome</simpleChoice>
      <simpleChoice identifier="choiceD">Berlin</simpleChoice>
    </choiceInteraction>
  </itemBody>

  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
</assessmentItem>`} />
      
      <p className="text-lg leading-relaxed mb-6">
        This is a fully functional assessment item. Let's break it down into its core components and understand their purpose in more detail.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🔲 1. &lt;assessmentItem&gt; — The Container</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This is the root element of a QTI item. It acts as a container that holds everything: metadata, content, interactions, and scoring rules.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>identifier</code>: A unique ID for the item, often referenced from a test or section.</li>
        <li><code>title</code>: A display name used by authoring tools or platforms.</li>
        <li><code>adaptive</code>: Indicates whether the item changes based on learner responses (rarely used).</li>
        <li><code>timeDependent</code>: Whether the question has its own timer (usually false).</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        You'll use this tag to wrap your entire item definition.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧠 2. &lt;responseDeclaration&gt; — Defining the Answer</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This part defines what kind of answer you expect from the user and what qualifies as a correct response.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        <strong>Key Sub-elements:</strong>
      </p>
      
      <ul className="text-lg space-y-2 mb-4 list-disc pl-6">
        <li><code>&lt;correctResponse&gt;</code>: The correct answer(s) are listed here.</li>
        <li><code>&lt;value&gt;</code>: One or more values that represent the correct answer(s). These values must match the identifier of a choice in the interaction.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-2">
        <strong>Common Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>identifier</code>: Connects the response to the question.</li>
        <li><code>cardinality</code>: Defines if the user can give a single, multiple, or ordered response.</li>
        <li><code>baseType</code>: The data type of the response (e.g., identifier, string, float).</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        You can also add <code>&lt;mapping&gt;</code> elements here to assign weights or allow partial credit.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">📝 3. &lt;itemBody&gt; — Displaying the Content</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        This element holds everything the learner will see on screen, including instructions, media, and interactions.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        The body uses HTML-like syntax (such as <code>&lt;p&gt;</code> and <code>&lt;div&gt;</code>) to format text and includes one or more interactions that define how the learner responds.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🎛 4. &lt;choiceInteraction&gt; — Presenting Choices</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This interaction defines a list of choices from which the user selects one or more options. It's the most common interaction in QTI.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-2 mb-4 list-disc pl-6">
        <li><code>responseIdentifier</code>: Must match the identifier in the <code>&lt;responseDeclaration&gt;</code>.</li>
        <li><code>shuffle</code>: If true, choices are randomized.</li>
        <li><code>maxChoices</code>: Limits how many options the learner can select.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-2">
        <strong>Children:</strong>
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>&lt;simpleChoice&gt;</code>: A possible answer. Each must have a unique identifier and display text.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        You can nest media (like images or audio) inside each <code>&lt;simpleChoice&gt;</code> to enhance interactivity.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧮 5. &lt;responseProcessing&gt; — Scoring the Response</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This element tells the system how to score the learner's answer.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        The simplest approach is to use a predefined template. These are URLs that point to standard scoring logic. In our example:
      </p>
      
      <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
        <code>&lt;responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/&gt;</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-6">
        This template gives full credit if the learner's response matches the correct value.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        If you need more complex scoring (e.g., partial credit, penalties), you can replace the template with custom XML using <code>&lt;responseCondition&gt;</code>, <code>&lt;setOutcomeValue&gt;</code>, and related tags.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧰 Summary: What You Should Remember</h2>
      
      <p className="text-lg leading-relaxed mb-2">
        Every QTI item starts with <code>&lt;assessmentItem&gt;</code> and must include at least:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>A <code>&lt;responseDeclaration&gt;</code> to define expected answers</li>
        <li>An <code>&lt;itemBody&gt;</code> that includes an interaction</li>
        <li>A <code>&lt;responseProcessing&gt;</code> block for scoring</li>
      </ul>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><strong>Keep identifiers consistent:</strong> The responseIdentifier used in your interaction must match the one in responseDeclaration.</li>
        <li><strong>Use match_correct</strong> to simplify right/wrong scoring while you're learning.</li>
        <li><strong>Don't forget that XML is strict.</strong> All tags must be properly closed and nested.</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        In the next sections, we'll go deeper into each component. But this overview should help you start reading and writing basic QTI assessment items confidently.
      </p>
    </div>
  );
}