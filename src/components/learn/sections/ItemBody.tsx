export default function ItemBody() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">✍️ Section 5: Writing the Question with &lt;itemBody&gt;</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The &lt;itemBody&gt; element is where you define the actual content that the learner sees. It is essentially the presentation layer of a QTI item. This element includes all visible content such as the question prompt, any multimedia resources, and the interactive controls (like multiple-choice options or text input boxes) the test-taker will use to respond.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI uses an XHTML-compatible syntax within &lt;itemBody&gt;, which means you can structure content using familiar HTML-like tags such as &lt;p&gt;, &lt;div&gt;, &lt;table&gt;, &lt;img&gt;, and more. This makes it easier to format questions and include rich media when needed.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        Unlike &lt;responseDeclaration&gt;, which defines the backend expectations, &lt;itemBody&gt; is strictly focused on user-facing content. It's where clarity, accessibility, and layout matter most.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧾 General Structure of &lt;itemBody&gt;</h2>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<itemBody>
  <p>Your question prompt goes here.</p>
  <choiceInteraction responseIdentifier="RESPONSE" maxChoices="1" shuffle="false">
    <simpleChoice identifier="A">Option A</simpleChoice>
    <simpleChoice identifier="B">Option B</simpleChoice>
    <simpleChoice identifier="C">Option C</simpleChoice>
    <simpleChoice identifier="D">Option D</simpleChoice>
  </choiceInteraction>
</itemBody>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed mb-2">
        The structure typically includes:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Content elements like &lt;p&gt;, &lt;div&gt;, or &lt;img&gt;</li>
        <li>One or more interaction elements that allow user input</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🎛 Common QTI Interaction Types</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI supports several interaction types, each corresponding to a different kind of user response mechanism. Each interaction type must include a <code>responseIdentifier</code> that links it to a corresponding &lt;responseDeclaration&gt;.
      </p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">1. choiceInteraction</h3>
      <p className="text-lg leading-relaxed mb-4">
        Used for multiple-choice or single-select items.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
  <simpleChoice identifier="A">Apple</simpleChoice>
  <simpleChoice identifier="B">Banana</simpleChoice>
</choiceInteraction>`}</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">2. textEntryInteraction</h3>
      <p className="text-lg leading-relaxed mb-4">
        Used for short answers where learners type a brief response.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<p>What is 2 + 2? <textEntryInteraction responseIdentifier="RESPONSE" expectedLength="4"/></p>`}</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">3. extendedTextInteraction</h3>
      <p className="text-lg leading-relaxed mb-4">
        Used for essays or longer written responses.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<p>Explain the difference between weather and climate:</p>
<extendedTextInteraction responseIdentifier="RESPONSE" expectedLines="5"/>`}</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">4. matchInteraction</h3>
      <p className="text-lg leading-relaxed mb-4">
        Used for drag-and-drop or matching tasks.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<matchInteraction responseIdentifier="RESPONSE">
  <simpleMatchSet>
    <simpleAssociableChoice identifier="A">Dog</simpleAssociableChoice>
    <simpleAssociableChoice identifier="B">Cat</simpleAssociableChoice>
  </simpleMatchSet>
  <simpleMatchSet>
    <simpleAssociableChoice identifier="1">Barks</simpleAssociableChoice>
    <simpleAssociableChoice identifier="2">Meows</simpleAssociableChoice>
  </simpleMatchSet>
</matchInteraction>`}</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">5. hotspotInteraction</h3>
      <p className="text-lg leading-relaxed mb-4">
        Used for image-based selections, such as identifying parts of a diagram.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<hotspotInteraction responseIdentifier="RESPONSE" maxChoices="1">
  <hotspotChoice identifier="A" shape="circle" coords="100,150,30"/>
</hotspotInteraction>`}</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🖼 Enhancing Questions with Multimedia</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Because &lt;itemBody&gt; uses XHTML-compatible markup, you can include:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>&lt;img&gt; for images</li>
        <li>&lt;audio&gt; and &lt;video&gt; for rich media</li>
        <li>&lt;object&gt; for embedded content (SVGs, PDFs)</li>
        <li>&lt;table&gt; for layout of tabular data</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Example:</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<itemBody>
  <p>Listen to the audio clip and choose the correct answer.</p>
  <audio controls>
    <source src="media/clip.mp3" type="audio/mpeg"/>
  </audio>
  <choiceInteraction responseIdentifier="RESPONSE" maxChoices="1">
    <simpleChoice identifier="A">Option A</simpleChoice>
    <simpleChoice identifier="B">Option B</simpleChoice>
  </choiceInteraction>
</itemBody>`}</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">🧭 Authoring Tips</h2>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Use semantic HTML (&lt;p&gt;, &lt;h1&gt;, etc.) for clarity and accessibility.</li>
        <li>Avoid deeply nested elements unless necessary.</li>
        <li>Keep prompts simple and easy to understand.</li>
        <li>Test your &lt;itemBody&gt; visually using QTI preview tools to verify layout and accessibility.</li>
        <li>Make sure all <code>responseIdentifier</code> values are unique within the item and correctly match &lt;responseDeclaration&gt; entries.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">⚠️ Common Pitfalls</h2>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Forgetting to include a matching <code>responseIdentifier</code></li>
        <li>Mismatched or duplicated identifiers across interactions</li>
        <li>Using non-compliant XHTML elements or invalid XML syntax</li>
        <li>Relying on CSS stylesheets, which are not always supported</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        The &lt;itemBody&gt; is where you create the learner's experience. It's your canvas for combining instructions, media, and interactions into a cohesive question.
      </p>
      
      <p className="text-lg leading-relaxed mb-2">
        Mastering this section allows you to:
      </p>
      
      <ul className="text-lg space-y-2 mb-6 list-disc pl-6">
        <li>Create more engaging and accessible assessments</li>
        <li>Support a wide variety of question types and input methods</li>
        <li>Control the presentation and structure of your items</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Next, we'll look more closely at how to configure answer choices using &lt;choiceInteraction&gt; and &lt;simpleChoice&gt; elements.
      </p>
    </div>
  );
}