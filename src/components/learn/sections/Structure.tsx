export default function Structure() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📊 Section 1: Understanding QTI Assessment Structure</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        A QTI assessment is composed of several major building blocks. Think of these like the architecture of a test, each layer building on the one before it:
      </p>
      
      <ol className="text-lg space-y-4 mb-6">
        <li><strong>Assessment Test</strong>: The overall exam or test structure. It defines sections and which questions go where.</li>
        <li><strong>Assessment Section</strong>: Groups questions together. This is useful for organizing a test into parts like "Reading" or "Math."</li>
        <li><strong>Assessment Item</strong>: A single question. This could be multiple choice, essay, numeric entry, etc.</li>
        <li><strong>Item Body</strong>: The main content of the question, including instructions, stimulus, and interactive elements.</li>
        <li><strong>Response Declaration</strong>: Specifies what kind of response is expected from the user and what the correct answer is.</li>
        <li><strong>Response Processing</strong>: Tells the system how to evaluate the user's answer and assign scores.</li>
      </ol>
      
      <p className="text-lg leading-relaxed">
        All of these components are encoded using XML tags. When you build a QTI file, you're assembling these layers into a complete, interactive assessment.
      </p>
    </div>
  );
}