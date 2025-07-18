import { XmlCodeBlock } from '../XmlCodeBlock';
import { DualFormatCodeBlock } from '../DualFormatCodeBlock';

export default function AssessmentItem() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">📟 Section 3: The &lt;assessmentItem&gt; Tag</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The &lt;assessmentItem&gt; element is the top-level container for a single assessment question within the QTI framework. This tag acts as the foundational wrapper for the rest of the question's structure—including the content the learner sees, the interactions for responses, and the logic to score and evaluate those responses.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        Understanding the attributes and expected sub-elements within &lt;assessmentItem&gt; is essential for creating valid, interoperable items that can be rendered and scored consistently across platforms.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧷 Purpose and Function</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        At a high level, &lt;assessmentItem&gt; defines a single, self-contained question. This is the building block of all QTI assessments. An item can be simple (e.g., a multiple-choice question) or complex (e.g., a multipart question with audio and rubric-based scoring). Each item lives in its own XML file and can be referenced by tests or item banks.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This wrapper is not just a technical requirement—it also gives you a place to set metadata about the item and define how it behaves.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🛠 Key Attributes</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">identifier</h3>
      <p className="text-lg leading-relaxed mb-4">
        A globally unique ID for the item. This must be unique within your assessment system and is used to reference this item from other documents (e.g., within &lt;assessmentTest&gt;).
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">title</h3>
      <p className="text-lg leading-relaxed mb-4">
        This is a label used by authoring tools and management systems. It does not appear to test takers but helps humans understand what the item is about.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">adaptive</h3>
      <p className="text-lg leading-relaxed mb-4">
        Set to true if the item contains adaptive logic (i.e., changes based on learner behavior). This is typically false unless you're building a dynamic item.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">timeDependent</h3>
      <p className="text-lg leading-relaxed mb-6">
        Indicates whether this item is individually timed. If true, delivery platforms may enforce a time limit specific to this question.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">📎 Required Sub-elements</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The &lt;assessmentItem&gt; must include the following core sub-elements:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>&lt;responseDeclaration&gt;</code>: Declares expected responses and correct answers.</li>
        <li><code>&lt;itemBody&gt;</code>: Contains the question content and learner-facing interactions.</li>
        <li><code>&lt;responseProcessing&gt;</code>: Explains how to score the response.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        These three together form the complete logic and structure of the question. Without one of these, the item is incomplete and will likely fail validation.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧱 Optional Elements</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Depending on your needs, you might also include:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>&lt;outcomeDeclaration&gt;</code>: Defines additional scoring metrics like partial scores, confidence scores, or rubric-based outcomes.</li>
        <li><code>&lt;rubricBlock&gt;</code>: Displays guidelines or scoring rubrics to test-takers (typically visible in practice or instructional contexts).</li>
        <li><code>&lt;modalFeedback&gt;</code>: Provides feedback after a response is submitted, based on correctness or other conditions.</li>
        <li><code>&lt;stylesheet&gt;</code>: Allows for basic presentation customization (though many platforms do not support or allow this for security reasons).</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧮 Complete Assessment Item Example</h2>
      
      <DualFormatCodeBlock
        title="Capital Cities Question - Complete Structure"
        xmlCode={`<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"
                identifier="item1" title="Capital Cities Question"
                adaptive="false" timeDependent="false">

  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>choiceA</value>
    </correctResponse>
  </responseDeclaration>

  <itemBody>
    <p>What is the capital of France?</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
      <simpleChoice identifier="choiceA">Paris</simpleChoice>
      <simpleChoice identifier="choiceB">London</simpleChoice>
      <simpleChoice identifier="choiceC">Berlin</simpleChoice>
      <simpleChoice identifier="choiceD">Rome</simpleChoice>
    </choiceInteraction>
  </itemBody>

  <responseProcessing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>
</assessmentItem>`}
        jsonCode={`{
  "@type": "assessmentItem",
  "identifier": "item1",
  "title": "Capital Cities Question",
  "adaptive": false,
  "timeDependent": false,
  "responseDeclaration": {
    "identifier": "RESPONSE",
    "cardinality": "single",
    "baseType": "identifier",
    "correctResponse": {
      "value": "choiceA"
    }
  },
  "itemBody": {
    "content": [
      {
        "@type": "paragraph",
        "text": "What is the capital of France?"
      },
      {
        "@type": "choiceInteraction",
        "responseIdentifier": "RESPONSE",
        "shuffle": true,
        "maxChoices": 1,
        "choices": [
          {
            "identifier": "choiceA",
            "text": "Paris"
          },
          {
            "identifier": "choiceB",
            "text": "London"
          },
          {
            "identifier": "choiceC",
            "text": "Berlin"
          },
          {
            "identifier": "choiceD",
            "text": "Rome"
          }
        ]
      }
    ]
  },
  "responseProcessing": {
    "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
  }
}`}
      />
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧭 Authoring Tips</h2>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Choose clear and consistent identifiers for reuse and debugging.</li>
        <li>Only set <code>adaptive="true"</code> if you're implementing item-level logic that changes based on user input.</li>
        <li>Use the <code>title</code> attribute to describe the content meaningfully for internal teams.</li>
        <li>Keep your structure minimal when learning—start with just the required fields.</li>
        <li>Validate early using a QTI-compliant tool to avoid headaches down the line.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The &lt;assessmentItem&gt; tag provides the container that holds everything else in your question. It's not just a technical necessity—it's where all the logic, presentation, and metadata of your item come together.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Understanding this container fully ensures you can:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Design valid questions</li>
        <li>Reuse items across assessments</li>
        <li>Maintain clear structure as your item bank grows</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Now that you've learned about the root container, the following sections will dive deeper into the specifics of answer expectations and content display.
      </p>
    </div>
  );
}