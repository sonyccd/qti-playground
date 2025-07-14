import { XmlCodeBlock } from '../XmlCodeBlock';

export default function ResponseProcessing() {
  return (
    <div className="prose prose-slate max-w-none w-full overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 break-words">🧮 Section 7: Scoring with &lt;responseProcessing&gt;</h1>
      
      <p className="text-lg leading-relaxed mb-6">
        The <code>&lt;responseProcessing&gt;</code> element defines how a test-taker's response is evaluated and scored. This is one of the most important parts of a QTI item because it controls how the system decides what is correct, how many points are awarded, and what outcomes are produced.
      </p>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI allows for two main approaches to scoring:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>Template-based scoring:</strong> Use built-in templates for common scenarios.</li>
        <li><strong>Custom logic:</strong> Define detailed rules and conditions using XML elements.</li>
      </ul>
      
      <p className="text-lg leading-relaxed mb-6">
        Both methods can be used for different item types, depending on the complexity of the scoring requirements.
      </p>

      <h2 className="text-3xl font-semibold mb-4">🎯 Template-Based Scoring</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        QTI provides several predefined response processing templates for common scoring situations. These templates dramatically simplify authoring and are recommended when possible.
      </p>

      <h3 className="text-2xl font-semibold mb-4">Most Common Templates:</h3>

      <h4 className="text-xl font-semibold mb-3">1. match_correct</h4>
      <p className="text-lg leading-relaxed mb-4">
        Gives full credit only if the response exactly matches the defined correct response(s).
      </p>

      <XmlCodeBlock code={`<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>`} />

      <h4 className="text-xl font-semibold mb-3">2. map_response</h4>
      <p className="text-lg leading-relaxed mb-4">
        Supports partial credit based on a scoring map defined in the <code>&lt;responseDeclaration&gt;</code>.
      </p>

      <XmlCodeBlock code={`<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"/>`} />

      <h4 className="text-xl font-semibold mb-3">3. match_none</h4>
      <p className="text-lg leading-relaxed mb-4">
        Used for unscored or practice items. No points are awarded regardless of the response.
      </p>

      <XmlCodeBlock code={`<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_none"/>`} />

      <h3 className="text-2xl font-semibold mb-4">Benefits of Templates</h3>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>Easy to use</li>
        <li>Reduce authoring errors</li>
        <li>Widely supported by QTI tools and platforms</li>
        <li>Great for simple and moderate-complexity items</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">⚙️ Custom Response Processing</h2>
      
      <p className="text-lg leading-relaxed mb-6">
        When templates don't meet your needs—for example, when partial credit must depend on logic beyond simple mappings—you can write custom scoring rules using the QTI response processing language.
      </p>

      <h3 className="text-2xl font-semibold mb-4">Core Elements of Custom Logic:</h3>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><code>&lt;responseCondition&gt;</code>: Defines a set of conditions and actions.</li>
        <li><code>&lt;responseIf&gt;</code> / <code>&lt;responseElseIf&gt;</code> / <code>&lt;responseElse&gt;</code>: Branching logic.</li>
        <li><code>&lt;match&gt;</code>, <code>&lt;equal&gt;</code>, <code>&lt;member&gt;</code>, <code>&lt;not&gt;</code>, etc.: Conditions for comparing responses.</li>
        <li><code>&lt;setOutcomeValue&gt;</code>: Assigns a score or outcome.</li>
        <li><code>&lt;variable&gt;</code>: Refers to a response or outcome variable.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🔧 Example: Custom Logic for a Single-Correct Multiple Choice</h2>

      <XmlCodeBlock code={`<responseProcessing>
  <responseCondition>
    <responseIf>
      <match>
        <variable identifier="RESPONSE"/>
        <baseValue baseType="identifier">choiceA</baseValue>
      </match>
      <setOutcomeValue identifier="SCORE">
        <baseValue baseType="integer">1</baseValue>
      </setOutcomeValue>
    </responseIf>
    <responseElse>
      <setOutcomeValue identifier="SCORE">
        <baseValue baseType="integer">0</baseValue>
      </setOutcomeValue>
    </responseElse>
  </responseCondition>
</responseProcessing>`} />

      <p className="text-lg leading-relaxed mb-6">
        In this example:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>If the learner selected choiceA, they get 1 point.</li>
        <li>If not, they get 0 points.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧠 Partial Credit With Custom Logic</h2>

      <XmlCodeBlock code={`<responseProcessing>
  <responseCondition>
    <responseIf>
      <member>
        <baseValue baseType="identifier">choiceA</baseValue>
        <variable identifier="RESPONSE"/>
      </member>
      <setOutcomeValue identifier="SCORE">
        <baseValue baseType="float">0.5</baseValue>
      </setOutcomeValue>
    </responseIf>
  </responseCondition>
</responseProcessing>`} />

      <p className="text-lg leading-relaxed mb-6">
        This rule gives 0.5 points if the learner selects choiceA, even if there are other options selected as well.
      </p>

      <h2 className="text-3xl font-semibold mb-4">📥 Default Score and Outcome Declarations</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        For the scoring to work correctly, you must declare the outcome variable used to track the score. This is usually done with an <code>&lt;outcomeDeclaration&gt;</code> element near the top of your item.
      </p>

      <XmlCodeBlock code={`<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
  <defaultValue>
    <value>0</value>
  </defaultValue>
</outcomeDeclaration>`} />

      <p className="text-lg leading-relaxed mb-4">
        The system uses this variable to store the final score for the item.
      </p>
      
      <p className="text-lg leading-relaxed mb-4">
        Other commonly used outcomes include:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>MAXSCORE:</strong> The maximum score for the item</li>
        <li><strong>FEEDBACK:</strong> For storing feedback messages</li>
        <li><strong>RESPONSE:</strong> The learner's submitted value (automatically generated)</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧭 Best Practices for Response Processing</h2>
      
      <ul className="text-lg space-y-3 mb-6">
        <li><strong>Start with templates:</strong> They're easy, supported, and reduce the chance of mistakes.</li>
        <li><strong>Use custom logic only when needed:</strong> Overcomplicating items makes them harder to maintain.</li>
        <li><strong>Keep logic consistent:</strong> Use the same approach for similar item types.</li>
        <li><strong>Always declare your outcomes:</strong> Use <code>&lt;outcomeDeclaration&gt;</code> properly to avoid runtime errors.</li>
        <li><strong>Use indentation:</strong> Make custom XML logic easier to read.</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4">🧪 Testing Your Logic</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        To ensure your response processing is working correctly:
      </p>
      
      <ul className="text-lg space-y-3 mb-6">
        <li>Use a QTI validator like QTIWorks</li>
        <li>Preview items in your delivery system</li>
        <li>Manually test different responses and verify expected scores</li>
      </ul>

      <h2 className="text-3xl font-semibold mb-4 text-green-600">✅ Summary</h2>
      
      <p className="text-lg leading-relaxed mb-4">
        Scoring in QTI is handled through <code>&lt;responseProcessing&gt;</code>, which defines how the system interprets user responses and assigns scores. You can:
      </p>
      
      <ul className="text-lg space-y-3 mb-4">
        <li>Use templates for fast, standardized scoring</li>
        <li>Write custom XML logic for advanced or flexible rules</li>
        <li>Declare outcome variables to store scores and results</li>
      </ul>
      
      <p className="text-lg leading-relaxed">
        Mastering this section will allow you to build not just accurate assessments, but also adaptive, personalized, or creative scoring scenarios that elevate your test design.
      </p>
    </div>
  );
}