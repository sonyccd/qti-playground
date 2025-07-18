export default function Introduction() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">📘 Introduction to QTI XML Format</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        <strong>QTI</strong> (Question and Test Interoperability) is an XML-based standard for defining and exchanging digital assessment content. It allows different platforms and tools to create, share, and deliver assessments in a consistent way. QTI enables you to define questions, tests, scoring rules, and metadata all within a structured format that ensures interoperability across systems.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This documentation focuses on <strong>QTI 3.0</strong>, the latest version of the standard, which includes enhanced features, improved accessibility support, and better compatibility with modern learning environments.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI was developed by the IMS Global Learning Consortium and is widely used in education, certification, and training environments. Whether you're creating a single quiz question or an entire exam with branching logic and scoring conditions, QTI provides a flexible framework for defining it.
      </p>
      
      <p className="text-lg leading-relaxed">
        This documentation is designed to help you understand the structure and usage of QTI XML files. You'll learn how to build your own assessments, interpret existing files, and begin creating portable and reusable content. It focuses on practical understanding rather than technical specifications.
      </p>
    </div>
  );
}