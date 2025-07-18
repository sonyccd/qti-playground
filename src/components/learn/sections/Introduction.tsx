export default function Introduction() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">📘 Introduction to QTI Format</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        <strong>QTI</strong> (Question and Test Interoperability) is a standard for defining and exchanging digital assessment content. It allows different platforms and tools to create, share, and deliver assessments in a consistent way. QTI enables you to define questions, tests, scoring rules, and metadata all within a structured format that ensures interoperability across systems.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This documentation focuses on <strong>QTI 3.0</strong>, the latest version of the standard, which includes enhanced features, improved accessibility support, and better compatibility with modern learning environments. <strong>QTI 3.0 supports both XML and JSON formats</strong>, giving you flexibility in how you structure your assessment content.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        <strong>Format Options:</strong>
      </p>
      <ul className="text-lg space-y-2 mb-6">
        <li><strong>XML Format:</strong> The traditional format, compatible with all QTI versions and widely supported across platforms.</li>
        <li><strong>JSON Format:</strong> A modern alternative available in QTI 3.0, offering a more compact and developer-friendly structure.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI was developed by the IMS Global Learning Consortium and is widely used in education, certification, and training environments. Whether you're creating a single quiz question or an entire exam with branching logic and scoring conditions, QTI provides a flexible framework for defining it.
      </p>
      
      <p className="text-lg leading-relaxed">
        This documentation is designed to help you understand the structure and usage of QTI files in both XML and JSON formats. You'll learn how to build your own assessments, interpret existing files, and begin creating portable and reusable content. Throughout this guide, you'll see examples in both formats to help you choose the one that best fits your needs.
      </p>
    </div>
  );
}