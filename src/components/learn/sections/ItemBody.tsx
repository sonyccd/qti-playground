export default function ItemBody() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">✍️ Section 5: Writing the Question with `&lt;itemBody&gt;`</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;itemBody&gt;</code> contains the actual content of the question. It can include text, images, audio, video, and interactions like answer fields or choices. It's written using XHTML-compliant elements.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">Typical interactive elements include:</p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>&lt;choiceInteraction&gt;</code>: Used for multiple choice and single-select.</li>
        <li><code>&lt;textEntryInteraction&gt;</code>: Allows text input (e.g., short answer).</li>
        <li><code>&lt;extendedTextInteraction&gt;</code>: Used for essay responses.</li>
        <li><code>&lt;matchInteraction&gt;</code>: Matches prompts with answers (e.g., drag-and-drop).</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Each interactive element needs a <code>responseIdentifier</code>, which must match the identifier used in <code>&lt;responseDeclaration&gt;</code> so that the system knows how to link the question to the scoring.
      </p>
    </div>
  );
}