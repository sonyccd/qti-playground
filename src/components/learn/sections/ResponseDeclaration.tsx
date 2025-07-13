export default function ResponseDeclaration() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">✅ Section 4: Defining Correct Answers with `&lt;responseDeclaration&gt;`</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;responseDeclaration&gt;</code> tells the system what kind of answer to expect and which response is considered correct. This is where you define the logic behind the interaction.
      </p>
      
      <h3 className="text-2xl font-semibold mb-4">Key Attributes:</h3>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>identifier</code>: This links the answer to the interaction. It must match the <code>responseIdentifier</code> on the question.</li>
        <li><code>cardinality</code>: Specifies how many answers a user can provide (<code>single</code>, <code>multiple</code>, <code>ordered</code>).</li>
        <li><code>baseType</code>: Declares the type of value expected (<code>identifier</code>, <code>string</code>, <code>float</code>, etc.).</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Inside this declaration, you define correct responses using <code>&lt;correctResponse&gt;</code> and <code>&lt;value&gt;</code> tags. For example, <code>choiceA</code> means the system will mark "Paris" as the correct answer.
      </p>
      
      <p className="text-lg leading-relaxed">
        You can also include additional response properties like mapping values for partial credit, feedback for wrong answers, and more.
      </p>
    </div>
  );
}