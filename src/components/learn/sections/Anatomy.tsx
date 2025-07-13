export default function Anatomy() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">📦 Section 2: The Basic Anatomy of a QTI File</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        Let's walk through a basic multiple-choice question and learn what each part does.
      </p>
      
      <h3 className="text-2xl font-semibold mb-4">Example: A Simple QTI Assessment Item (Multiple Choice)</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
                identifier="item1" title="Example Multiple Choice"
                adaptive="false" timeDependent="false">

  <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
    <correctResponse>
      <value>choiceA</value>
    </correctResponse>
  </responseDeclaration>

  <itemBody>
    <p>What is the capital of France?</p>
    <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
      <simpleChoice identifier="choiceA">Paris</simpleChoice>
      <simpleChoice identifier="choiceB">London</simpleChoice>
      <simpleChoice identifier="choiceC">Rome</simpleChoice>
      <simpleChoice identifier="choiceD">Berlin</simpleChoice>
    </choiceInteraction>
  </itemBody>

  <responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>
</assessmentItem>`}</code>
      </pre>
      
      <p className="text-lg leading-relaxed">
        This XML file defines one item. It includes the question text, answer choices, correct answer, and how to score the item. Let's break it down further in the following sections.
      </p>
    </div>
  );
}