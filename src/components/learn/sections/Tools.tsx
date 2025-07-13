export default function Tools() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🛠 Section 10: Tools for Working with QTI</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Working with raw XML can be difficult. Thankfully, there are several tools to make authoring and testing easier:
      </p>
      
      <ul className="text-lg space-y-4 mb-6">
        <li><strong>TAO</strong> – A full-featured open-source platform for authoring and delivering QTI-compliant tests.</li>
        <li><strong>QTIWorks</strong> – A tool for previewing, debugging, and testing QTI packages.</li>
        <li><strong>Respondus / ExamView</strong> – Software for building assessments that can export to QTI format.</li>
        <li><strong>Custom Scripts</strong> – Organizations often build internal tools in Python, Java, or JavaScript to generate QTI.</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Using tools can help reduce syntax errors, streamline workflows, and provide visual interfaces for content creators.
      </p>
    </div>
  );
}