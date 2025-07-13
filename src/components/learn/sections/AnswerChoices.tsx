import { XmlCodeBlock } from '../XmlCodeBlock';

export default function AnswerChoices() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-4xl font-bold mb-6">🎯 Section 6: Providing Answer Choices</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;choiceInteraction&gt;</code> element is one of the most widely used interaction types in QTI and is the standard way to build multiple-choice or multiple-response questions. It allows test-takers to choose from a set of predefined options—usually presented as radio buttons or checkboxes.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        This section explains how to use <code>&lt;choiceInteraction&gt;</code> and its child element <code>&lt;simpleChoice&gt;</code> to define these options, control their behavior, and enhance them with multimedia.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧱 Structure of &lt;choiceInteraction&gt;</h2>

      <p className="text-lg leading-relaxed mb-4">
        The <code>&lt;choiceInteraction&gt;</code> element defines a container for a set of choices. It must include a responseIdentifier attribute that matches a <code>&lt;responseDeclaration&gt;</code> and should contain one or more <code>&lt;simpleChoice&gt;</code> elements.
      </p>

      <XmlCodeBlock code={`<choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="1">
  <simpleChoice identifier="choiceA">Option A</simpleChoice>
  <simpleChoice identifier="choiceB">Option B</simpleChoice>
</choiceInteraction>`} />

      <p className="text-lg leading-relaxed mb-4">
        <strong>Key Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>responseIdentifier:</strong> Connects this interaction to the correct scoring declaration.</li>
        <li><strong>shuffle:</strong> Boolean attribute that determines whether to randomize the order of choices each time the question is delivered.</li>
        <li><strong>maxChoices:</strong> Sets the maximum number of choices a test-taker may select. Use 1 for single-answer questions and a higher number for multiple-response.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧩 &lt;simpleChoice&gt; Elements</h2>

      <p className="text-lg leading-relaxed mb-4">
        Each <code>&lt;simpleChoice&gt;</code> represents one option. These elements are nested inside <code>&lt;choiceInteraction&gt;</code>.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        <strong>Attributes:</strong>
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li><strong>identifier:</strong> A unique ID used to score the answer.</li>
        <li><strong>fixed:</strong> Optional boolean to exclude a choice from shuffling.</li>
      </ul>

      <p className="text-lg leading-relaxed mb-4">
        <strong>Content:</strong> Text, or optionally, rich media such as images, audio, or video.
      </p>

      <h3 className="text-2xl font-semibold mb-4">Example:</h3>

      <XmlCodeBlock code={`<simpleChoice identifier="choiceA">Paris</simpleChoice>
<simpleChoice identifier="choiceB">London</simpleChoice>
<simpleChoice identifier="choiceC">Berlin</simpleChoice>
<simpleChoice identifier="choiceD">Rome</simpleChoice>`} />

      <p className="text-lg leading-relaxed mb-4">You can enhance each choice with media:</p>

      <XmlCodeBlock code={`<simpleChoice identifier="choiceA">
  <img src="img/paris.jpg" alt="Photo of Paris"/>
  Paris
</simpleChoice>`} />

      <h2 className="text-3xl font-semibold mb-4">🔄 Shuffling Behavior</h2>

      <p className="text-lg leading-relaxed mb-4">
        By default, all <code>&lt;simpleChoice&gt;</code> elements are shuffled if <code>shuffle="true"</code>. However, you can exclude certain options using the <code>fixed="true"</code> attribute. This is useful for placing "None of the above" or "All of the above" consistently at the end.
      </p>

      <XmlCodeBlock code={`<simpleChoice identifier="choiceZ" fixed="true">None of the above</simpleChoice>`} />

      <h2 className="text-3xl font-semibold mb-4">🎚 Controlling Number of Choices</h2>

      <p className="text-lg leading-relaxed mb-4">
        Use the maxChoices attribute to control how many selections the learner can make:
      </p>

      <ul className="text-lg space-y-3 mb-4">
        <li><strong>maxChoices="1"</strong> for radio-button behavior (one answer)</li>
        <li><strong>maxChoices="2"</strong> or more for checkbox-style questions</li>
      </ul>

      <p className="text-lg leading-relaxed mb-6">
        To require a minimum number of choices, some platforms support minChoices as a non-standard attribute—but check compatibility first.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🧠 Semantic and Accessibility Considerations</h2>

      <ul className="text-lg space-y-3 mb-6">
        <li>Provide meaningful alt text for images.</li>
        <li>Use clear, concise wording for options.</li>
        <li>Avoid options like "All of the above" unless carefully designed.</li>
        <li>Ensure that the correct answer(s) are defined in the <code>&lt;responseDeclaration&gt;</code> using identifiers that match those in <code>&lt;simpleChoice&gt;</code>.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4 text-red-600">⚠️ Common Pitfalls</h2>

      <ul className="text-lg space-y-3 mb-6">
        <li>Using non-unique identifiers across choices</li>
        <li>Forgetting to match responseIdentifier with the declaration</li>
        <li>Omitting required maxChoices attribute (can lead to unpredictable platform behavior)</li>
        <li>Overusing shuffling when some order is pedagogically important</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4 text-green-600">✅ Summary</h2>

      <p className="text-lg leading-relaxed mb-4">
        The <code>&lt;choiceInteraction&gt;</code> and <code>&lt;simpleChoice&gt;</code> tags form the backbone of multiple-choice questions in QTI. With proper structure, shuffling control, and accessibility considerations, these tags enable:
      </p>

      <ul className="text-lg space-y-3 mb-4">
        <li>Clear and interactive answer selection</li>
        <li>Flexible scoring with multiple correct answers</li>
        <li>Enhanced visual or audio-based choices</li>
      </ul>

      <p className="text-lg leading-relaxed">
        In the next section, you'll learn how to score these interactions using <code>&lt;responseProcessing&gt;</code> and templates or custom logic.
      </p>
    </div>
  );
}