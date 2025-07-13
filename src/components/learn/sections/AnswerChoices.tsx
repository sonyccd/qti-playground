export default function AnswerChoices() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🎯 Section 6: Providing Answer Choices</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        When building a multiple-choice question, you use <code>&lt;choiceInteraction&gt;</code> to present options to the test-taker.
      </p>
      
      <h3 className="text-2xl font-semibold mb-4">Example:</h3>
      
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
        <code>{`<choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
  <simpleChoice identifier="choiceA">Paris</simpleChoice>
  <simpleChoice identifier="choiceB">London</simpleChoice>
  <simpleChoice identifier="choiceC">Rome</simpleChoice>
  <simpleChoice identifier="choiceD">Berlin</simpleChoice>
</choiceInteraction>`}</code>
      </pre>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>shuffle</code>: Set to <code>true</code> if you want the order of choices to randomize each time.</li>
        <li><code>maxChoices</code>: Determines how many choices the user can select. Set to <code>1</code> for single choice.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Each <code>&lt;simpleChoice&gt;</code> has an <code>identifier</code>, which should be unique within the item. This identifier is what gets evaluated against the correct response.
      </p>
      
      <p className="text-lg leading-relaxed">
        You can enhance choices with images, audio, and formatting to improve accessibility and engagement.
      </p>
    </div>
  );
}