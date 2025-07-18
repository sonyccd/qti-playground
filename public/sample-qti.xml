<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest xmlns="http://www.imsglobal.org/xsd/imsqti_v3p0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd"
                identifier="comprehensive_assessment_test"
                title="Comprehensive QTI 3.0 Assessment with Advanced Scoring">

    <!-- Test-level outcome declarations -->
    <outcomeDeclaration identifier="TOTAL_SCORE" cardinality="single" baseType="float">
        <defaultValue>
            <value>0.0</value>
        </defaultValue>
    </outcomeDeclaration>

    <outcomeDeclaration identifier="SECTION_SCORE" cardinality="single" baseType="float">
        <defaultValue>
            <value>0.0</value>
        </defaultValue>
    </outcomeDeclaration>

    <outcomeDeclaration identifier="PASS_FAIL" cardinality="single" baseType="identifier">
        <defaultValue>
            <value>fail</value>
        </defaultValue>
    </outcomeDeclaration>

    <testPart identifier="main_test_part" 
              navigationMode="linear" 
              submissionMode="individual" 
              scoreAggregation="sum">

        <!-- Section 1: Multiple Choice Questions -->
        <assessmentSection identifier="multiple_choice_section" 
                          title="Multiple Choice Questions" 
                          visible="true">

            <!-- Question 1: Single Choice with Template Response Processing -->
            <assessmentItem identifier="geography_q1" 
                           title="World Geography" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
                    <correctResponse>
                        <value>paris</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>What is the capital of France?</p>
                        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
                            <prompt>Select the correct answer:</prompt>
                            <simpleChoice identifier="london">London</simpleChoice>
                            <simpleChoice identifier="berlin">Berlin</simpleChoice>
                            <simpleChoice identifier="paris">Paris</simpleChoice>
                            <simpleChoice identifier="madrid">Madrid</simpleChoice>
                        </choiceInteraction>
                    </div>
                </itemBody>

                <responseProcessing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"/>
            </assessmentItem>

            <!-- Question 2: Multiple Response with Custom Response Processing -->
            <assessmentItem identifier="programming_q2" 
                           title="Programming Languages" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
                    <correctResponse>
                        <value>python</value>
                        <value>javascript</value>
                        <value>java</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>Which of the following are programming languages? (Select all that apply)</p>
                        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="5">
                            <prompt>Select all correct answers:</prompt>
                            <simpleChoice identifier="python">Python</simpleChoice>
                            <simpleChoice identifier="html">HTML</simpleChoice>
                            <simpleChoice identifier="javascript">JavaScript</simpleChoice>
                            <simpleChoice identifier="java">Java</simpleChoice>
                            <simpleChoice identifier="css">CSS</simpleChoice>
                        </choiceInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <match>
                                <variable identifier="RESPONSE"/>
                                <correct identifier="RESPONSE"/>
                            </match>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">2.0</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElseIf>
                            <and>
                                <member>
                                    <baseValue baseType="identifier">python</baseValue>
                                    <variable identifier="RESPONSE"/>
                                </member>
                                <member>
                                    <baseValue baseType="identifier">javascript</baseValue>
                                    <variable identifier="RESPONSE"/>
                                </member>
                            </and>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.0</baseValue>
                            </setOutcomeValue>
                        </responseElseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

            <!-- Question 3: Choice with Mapping -->
            <assessmentItem identifier="science_q3" 
                           title="Basic Science" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
                    <correctResponse>
                        <value>oxygen</value>
                    </correctResponse>
                    <mapping defaultValue="0">
                        <mapEntry mapKey="oxygen" mappedValue="3.0"/>
                        <mapEntry mapKey="carbon" mappedValue="1.0"/>
                        <mapEntry mapKey="hydrogen" mappedValue="1.0"/>
                        <mapEntry mapKey="nitrogen" mappedValue="0.5"/>
                    </mapping>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>Which gas is essential for human respiration?</p>
                        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
                            <prompt>Select the best answer:</prompt>
                            <simpleChoice identifier="oxygen">Oxygen</simpleChoice>
                            <simpleChoice identifier="carbon">Carbon Dioxide</simpleChoice>
                            <simpleChoice identifier="hydrogen">Hydrogen</simpleChoice>
                            <simpleChoice identifier="nitrogen">Nitrogen</simpleChoice>
                        </choiceInteraction>
                    </div>
                </itemBody>

                <responseProcessing template="http://www.imsglobal.org/question/qti_v3p0/rptemplates/map_response"/>
            </assessmentItem>

        </assessmentSection>

        <!-- Section 2: Interactive Question Types -->
        <assessmentSection identifier="interactive_section" 
                          title="Interactive Questions" 
                          visible="true">

            <!-- Question 4: Slider with Range Scoring -->
            <assessmentItem identifier="slider_q4" 
                           title="Temperature Assessment" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="float">
                    <correctResponse>
                        <value>100.0</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>At what temperature (°C) does water boil at sea level?</p>
                        <sliderInteraction responseIdentifier="RESPONSE" 
                                         lowerBound="90" 
                                         upperBound="110" 
                                         step="1" 
                                         orientation="horizontal">
                            <prompt>Move the slider to select the temperature:</prompt>
                        </sliderInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <equal>
                                <variable identifier="RESPONSE"/>
                                <baseValue baseType="float">100.0</baseValue>
                            </equal>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">2.0</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElseIf>
                            <and>
                                <gte>
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="float">98.0</baseValue>
                                </gte>
                                <lte>
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="float">102.0</baseValue>
                                </lte>
                            </and>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.5</baseValue>
                            </setOutcomeValue>
                        </responseElseIf>
                        <responseElseIf>
                            <and>
                                <gte>
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="float">95.0</baseValue>
                                </gte>
                                <lte>
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="float">105.0</baseValue>
                                </lte>
                            </and>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.0</baseValue>
                            </setOutcomeValue>
                        </responseElseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

            <!-- Question 5: Text Entry with Case-Insensitive Scoring -->
            <assessmentItem identifier="text_q5" 
                           title="Chemical Formula" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
                    <correctResponse>
                        <value>H2O</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>What is the chemical formula for water?</p>
                        <textEntryInteraction responseIdentifier="RESPONSE" expectedLength="10">
                            <prompt>Enter the chemical formula:</prompt>
                        </textEntryInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <or>
                                <stringMatch caseSensitive="false">
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="string">H2O</baseValue>
                                </stringMatch>
                                <stringMatch caseSensitive="false">
                                    <variable identifier="RESPONSE"/>
                                    <baseValue baseType="string">H₂O</baseValue>
                                </stringMatch>
                            </or>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.5</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

            <!-- Question 6: Order Interaction -->
            <assessmentItem identifier="order_q6" 
                           title="Historical Timeline" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="ordered" baseType="identifier">
                    <correctResponse>
                        <value>wwi</value>
                        <value>revolution</value>
                        <value>treaty</value>
                        <value>league</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>Arrange the following historical events in chronological order (earliest to latest):</p>
                        <orderInteraction responseIdentifier="RESPONSE" shuffle="true">
                            <prompt>Drag and drop to arrange in chronological order:</prompt>
                            <simpleChoice identifier="wwi">World War I begins (1914)</simpleChoice>
                            <simpleChoice identifier="revolution">Russian Revolution (1917)</simpleChoice>
                            <simpleChoice identifier="treaty">Treaty of Versailles signed (1919)</simpleChoice>
                            <simpleChoice identifier="league">League of Nations established (1920)</simpleChoice>
                        </orderInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <match>
                                <variable identifier="RESPONSE"/>
                                <correct identifier="RESPONSE"/>
                            </match>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">2.5</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

            <!-- Question 7: Hottext Interaction -->
            <assessmentItem identifier="hottext_q7" 
                           title="Grammar Exercise" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">
                    <correctResponse>
                        <value>noun1</value>
                        <value>verb1</value>
                        <value>adjective1</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>Identify the <strong>nouns</strong>, <strong>verbs</strong>, and <strong>adjectives</strong> in the sentence below:</p>
                        <hottextInteraction responseIdentifier="RESPONSE" maxChoices="8">
                            <prompt>Click on the words that are nouns, verbs, or adjectives:</prompt>
                            <p>The <hottext identifier="adjective1">beautiful</hottext> <hottext identifier="noun1">garden</hottext> 
                            <hottext identifier="verb1">bloomed</hottext> with <hottext identifier="adjective2">colorful</hottext> 
                            <hottext identifier="noun2">flowers</hottext> during the <hottext identifier="adjective3">warm</hottext> 
                            <hottext identifier="noun3">spring</hottext> <hottext identifier="noun4">season</hottext>.</p>
                        </hottextInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <match>
                                <variable identifier="RESPONSE"/>
                                <correct identifier="RESPONSE"/>
                            </match>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">2.0</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

        </assessmentSection>

        <!-- Section 3: Advanced Text Questions -->
        <assessmentSection identifier="text_section" 
                          title="Text-Based Questions" 
                          visible="true">

            <!-- Question 8: Fill-in-the-Blank -->
            <assessmentItem identifier="fill_blank_q8" 
                           title="Biology Fill-in-the-Blank" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
                    <correctResponse>
                        <value>mitochondria</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p>The _______ is known as the powerhouse of the cell.</p>
                        <textEntryInteraction responseIdentifier="RESPONSE" expectedLength="20">
                            <prompt>Fill in the blank:</prompt>
                        </textEntryInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <stringMatch caseSensitive="false">
                                <variable identifier="RESPONSE"/>
                                <baseValue baseType="string">mitochondria</baseValue>
                            </stringMatch>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.0</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElseIf>
                            <stringMatch caseSensitive="false">
                                <variable identifier="RESPONSE"/>
                                <baseValue baseType="string">mitochondrion</baseValue>
                            </stringMatch>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.0</baseValue>
                            </setOutcomeValue>
                        </responseElseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

            <!-- Question 9: Extended Text (Essay) -->
            <assessmentItem identifier="essay_q9" 
                           title="Environmental Science Essay" 
                           adaptive="false" 
                           timeDependent="false">
                
                <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string">
                    <correctResponse>
                        <value>Climate change refers to long-term shifts in global temperatures and weather patterns. Key causes include greenhouse gas emissions from burning fossil fuels, deforestation, and industrial processes. Solutions include renewable energy adoption, carbon pricing, reforestation, and international cooperation through agreements like the Paris Climate Accord.</value>
                    </correctResponse>
                </responseDeclaration>

                <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
                    <defaultValue>
                        <value>0</value>
                    </defaultValue>
                </outcomeDeclaration>

                <itemBody>
                    <div>
                        <p><strong>Essay Question:</strong> Explain what climate change is, identify its main causes, and propose at least two solutions.</p>
                        <p><em>Your response should be at least 150 words and include specific examples.</em></p>
                        <extendedTextInteraction responseIdentifier="RESPONSE" expectedLength="1000">
                            <prompt>Write your essay here:</prompt>
                        </extendedTextInteraction>
                    </div>
                </itemBody>

                <responseProcessing>
                    <responseCondition>
                        <responseIf>
                            <gte>
                                <stringLength>
                                    <variable identifier="RESPONSE"/>
                                </stringLength>
                                <baseValue baseType="integer">150</baseValue>
                            </gte>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">3.0</baseValue>
                            </setOutcomeValue>
                        </responseIf>
                        <responseElseIf>
                            <gte>
                                <stringLength>
                                    <variable identifier="RESPONSE"/>
                                </stringLength>
                                <baseValue baseType="integer">50</baseValue>
                            </gte>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">1.5</baseValue>
                            </setOutcomeValue>
                        </responseElseIf>
                        <responseElse>
                            <setOutcomeValue identifier="SCORE">
                                <baseValue baseType="float">0.0</baseValue>
                            </setOutcomeValue>
                        </responseElse>
                    </responseCondition>
                </responseProcessing>
            </assessmentItem>

        </assessmentSection>

    </testPart>

    <!-- Test-level Response Processing for Score Aggregation -->
    <testFeedback outcome="TOTAL_SCORE" identifier="pass_feedback" showHide="show" access="atEnd">
        <p><strong>Congratulations!</strong> You have successfully completed the assessment.</p>
    </testFeedback>

    <testFeedback outcome="TOTAL_SCORE" identifier="fail_feedback" showHide="show" access="atEnd">
        <p><strong>Assessment Complete.</strong> Review your answers and consider retaking the test.</p>
    </testFeedback>

</assessmentTest>