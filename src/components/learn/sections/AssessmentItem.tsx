export default function AssessmentItem() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📟 Section 3: The `&lt;assessmentItem&gt;` Tag</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;assessmentItem&gt;</code> is the outermost tag for an individual question. You can think of this as a container for everything else. It includes metadata about the item such as:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>identifier</code>: A unique name for the item. Keep these consistent across your content.</li>
        <li><code>title</code>: A human-readable name for the item, typically shown in authoring tools.</li>
        <li><code>adaptive</code>: Indicates whether the question adapts based on responses (usually false).</li>
        <li><code>timeDependent</code>: Whether the item is timed on its own.</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        All other elements like question text, responses, and scoring live inside this wrapper.
      </p>
    </div>
  );
}