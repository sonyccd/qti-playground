export default function AssessmentTest() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🧪 Section 8: Creating an Entire Test with `&lt;assessmentTest&gt;`</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Once you've authored your individual items, you can assemble them into a test using <code>&lt;assessmentTest&gt;</code>.
      </p>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<assessmentTest xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
                identifier="test1" title="Sample Test">

  <testPart identifier="part1" navigationMode="nonlinear" submissionMode="individual">
    <assessmentSection identifier="section1" title="Section 1">
      <assessmentItemRef identifier="item1" href="item1.xml"/>
      <assessmentItemRef identifier="item2" href="item2.xml"/>
    </assessmentSection>
  </testPart>
</assessmentTest>`}</code>
      </pre>
      
      <h3 className="text-2xl font-semibold mb-4">Key Concepts:</h3>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>Test Part</strong>: Allows for multi-part tests with different navigation modes.</li>
        <li><strong>Assessment Section</strong>: Logical groupings of items. Can include instructions.</li>
        <li><strong>Assessment Item Ref</strong>: Points to the file containing each question.</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        You can define constraints like timing, navigation mode (<code>linear</code> or <code>nonlinear</code>), and feedback behavior.
      </p>
    </div>
  );
}