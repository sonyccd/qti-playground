export default function ResponseDeclaration() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">✅ Section 4: Defining Correct Answers with &lt;responseDeclaration&gt;</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The &lt;responseDeclaration&gt; element is the part of the QTI item where you declare what kind of response the system should expect and what counts as correct. It's crucial for connecting the user interaction with the backend logic of the item.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This tag lives inside &lt;assessmentItem&gt; and works alongside &lt;itemBody&gt; and &lt;responseProcessing&gt; to define the correct answer(s), expected data format, and cardinality (i.e., whether one or more answers are permitted).
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧾 Purpose of &lt;responseDeclaration&gt;</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        This element acts as a bridge between what the learner sees (the interaction) and how the system scores it. It tells the system:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>What kind of data the learner will provide</li>
        <li>How many values are expected</li>
        <li>What constitutes a correct answer</li>
        <li>(Optionally) How to assign partial credit</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Every interaction must have a corresponding &lt;responseDeclaration&gt; with a matching identifier.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🛠 Key Attributes</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">identifier</h3>
      <p className="text-lg leading-relaxed mb-4">
        A unique label that ties this declaration to the interaction. The value here must match the <code>responseIdentifier</code> on your interaction element (like &lt;choiceInteraction&gt;).
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">cardinality</h3>
      <p className="text-lg leading-relaxed mb-2">
        Specifies how many responses are expected. Common values include:
      </p>
      
      <ul className="text-lg space-y-2 mb-4 list-disc pl-6">
        <li><code>single</code>: Only one value allowed (e.g., one correct choice)</li>
        <li><code>multiple</code>: More than one value allowed (e.g., check-all-that-apply)</li>
        <li><code>ordered</code>: Answers must be in a specific sequence (e.g., ranking questions)</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">baseType</h3>
      <p className="text-lg leading-relaxed mb-2">
        Defines the type of value expected:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>identifier</code>: A symbolic ID like choiceA</li>
        <li><code>string</code>: Free-text input (e.g., names, definitions)</li>
        <li><code>integer, float</code>: For numeric responses</li>
        <li><code>boolean</code>: For true/false or toggle answers</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Defining Correct Responses</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The most common child of &lt;responseDeclaration&gt; is &lt;correctResponse&gt;. It holds one or more &lt;value&gt; elements that define the right answer(s).
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Example (Single Correct Answer):</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
        <code>{`<responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
  <correctResponse>
    <value>choiceA</value>
  </correctResponse>
</responseDeclaration>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-6">
        This tells the system to expect one answer (choiceA) and that the interaction is limited to a single response.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Example (Multiple Correct Answers):</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
        <code>{`<responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
  <correctResponse>
    <value>choiceA</value>
    <value>choiceC</value>
  </correctResponse>
</responseDeclaration>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-6">
        This setup allows the learner to select more than one answer and marks both choiceA and choiceC as correct.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🎚 Partial Credit and Mapping</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        You can assign different weights to answers using a &lt;mapping&gt; element. This is useful for partial credit or scoring multiple correct answers differently.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Example With Mapping:</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
        <code>{`<responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
  <correctResponse>
    <value>choiceA</value>
    <value>choiceC</value>
  </correctResponse>
  <mapping defaultValue="0">
    <mapEntry mapKey="choiceA" mappedValue="0.5"/>
    <mapEntry mapKey="choiceC" mappedValue="0.5"/>
  </mapping>
</responseDeclaration>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-6">
        Here, each correct choice earns 0.5 points, allowing a total score of 1. Incorrect choices will default to 0, as specified by <code>defaultValue</code>.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧠 Advanced Features</h2>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li><code>&lt;areaMapping&gt;</code>: Used with hotspot or graphical interactions, mapping areas to scores.</li>
        <li><code>&lt;interpretation&gt;</code>: Describes the intended meaning of the response for metadata purposes.</li>
        <li><code>&lt;correctResponse&gt;</code> can be combined with <code>&lt;mapping&gt;</code> or <code>&lt;areaMapping&gt;</code> but should not contradict each other.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧭 Authoring Tips</h2>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Always ensure the identifier in &lt;responseDeclaration&gt; matches the responseIdentifier in your interaction.</li>
        <li>Use <code>single</code> cardinality unless the interaction requires multiple responses.</li>
        <li>Validate combinations of <code>baseType</code> and <code>cardinality</code> for logical consistency (e.g., don't use multiple with boolean).</li>
        <li>Use &lt;mapping&gt; when you want to support partial credit or flexible scoring rules.</li>
        <li>Keep things simple for your first items; add complexity gradually as needed.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The &lt;responseDeclaration&gt; defines the expected response type, how many responses can be submitted, and what constitutes a correct answer. It is one of the key building blocks in QTI and must align perfectly with the interaction and scoring logic.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        By mastering this tag, you'll gain the power to:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Validate learner answers accurately</li>
        <li>Support flexible response formats</li>
        <li>Design richer and more varied assessment types</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Next, we'll move on to the &lt;itemBody&gt; tag, which defines the visible content of your question and how the learner interacts with it.
      </p>
    </div>
  );
}