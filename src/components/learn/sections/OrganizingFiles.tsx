export default function OrganizingFiles() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📂 Section 9: Organizing Files</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        A typical QTI package includes several XML files, often delivered in a ZIP bundle. Here's a common file structure:
      </p>
      
      <pre className="bg-muted p-4 rounded-lg text-sm mb-6">
        <code>{`/test.xml                 → Main test structure
/item1.xml                → Individual question 1
/item2.xml                → Individual question 2
/qti_manifest.xml         → Lists and categorizes files (optional but recommended)
/images/                  → Media used in questions`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed">
        The <code>manifest</code> file helps systems know how to ingest and interpret the package. Some platforms require it for proper import.
      </p>
    </div>
  );
}