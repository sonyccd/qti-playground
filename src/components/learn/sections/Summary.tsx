export default function Summary() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📘 Summary</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI XML provides a robust, extensible format for building portable, platform-independent assessments. By learning the basics of QTI's structure—<code>assessmentItem</code>, <code>responseDeclaration</code>, <code>itemBody</code>, <code>responseProcessing</code>, and <code>assessmentTest</code>—you'll be equipped to create both simple and complex assessments.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        Once comfortable, you can expand into features like adaptive testing, custom scoring, metadata tagging, and rich media inclusion. Whether you're authoring by hand or using a tool, QTI gives you a powerful foundation for assessment creation.
      </p>
      
      <p className="text-lg leading-relaxed">
        Continue experimenting and validating your files as you go. With practice, QTI can become a reliable and reusable format that scales with your testing needs.
      </p>
    </div>
  );
}