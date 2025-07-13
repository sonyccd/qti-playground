export default function BestPractices() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🔍 Section 11: Best Practices</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Here are some guidelines to help you get the most out of QTI:
      </p>
      
      <ul className="text-lg space-y-4 mb-6">
        <li><strong>Start Small</strong>: Begin with a few simple items and gradually introduce complexity.</li>
        <li><strong>Use Meaningful IDs</strong>: Name identifiers clearly (e.g., <code>q1_reading_vocab</code> instead of <code>item1</code>).</li>
        <li><strong>Validate Early and Often</strong>: Use XML validators or QTI test tools to catch errors quickly.</li>
        <li><strong>Reuse Templates</strong>: Stick with <code>match_correct</code> or <code>map_response</code> where possible to keep scoring consistent.</li>
        <li><strong>Document and Comment</strong>: Leave comments in your XML files to explain custom logic or unusual decisions.</li>
        <li><strong>Stay Within Supported Features</strong>: Not every platform supports every QTI tag. Test compatibility.</li>
      </ul>
    </div>
  );
}