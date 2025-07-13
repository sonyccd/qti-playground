export default function ResponseProcessing() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🧮 Section 7: Scoring with `&lt;responseProcessing&gt;`</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        This section determines how responses are scored. For most use cases, you can rely on built-in scoring templates provided by IMS.
      </p>
      
      <h3 className="text-2xl font-semibold mb-4">Common Templates:</h3>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>match_correct</code>: Full credit for matching the correct answer.</li>
        <li><code>map_response</code>: Allows for partial credit by assigning scores to individual choices.</li>
        <li><code>match_none</code>: No scoring; used for practice or ungraded items.</li>
      </ul>
      
      <h3 className="text-2xl font-semibold mb-4">Example:</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed">
        More advanced scoring can be handled with custom <code>&lt;responseCondition&gt;</code> blocks that include branching logic, weighted scores, and conditions.
      </p>
    </div>
  );
}