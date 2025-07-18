import { QTIJsonItem } from './jsonXmlConverter';

export const QTI_JSON_TEMPLATES = {
  choice: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Multiple Choice Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "single",
      "baseType": "identifier",
      "correctResponse": {
        "value": "ChoiceA"
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Enter your question text here."
        },
        {
          "@type": "choiceInteraction",
          "responseIdentifier": "RESPONSE",
          "shuffle": false,
          "maxChoices": 1,
          "prompt": "Select the correct answer:",
          "choices": [
            {
              "identifier": "ChoiceA",
              "text": "Option A"
            },
            {
              "identifier": "ChoiceB",
              "text": "Option B"
            },
            {
              "identifier": "ChoiceC",
              "text": "Option C"
            },
            {
              "identifier": "ChoiceD",
              "text": "Option D"
            }
          ]
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  multipleResponse: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Multiple Response Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "multiple",
      "baseType": "identifier",
      "correctResponse": {
        "value": ["ChoiceA", "ChoiceC"]
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Select all correct answers."
        },
        {
          "@type": "choiceInteraction",
          "responseIdentifier": "RESPONSE",
          "shuffle": false,
          "maxChoices": 0,
          "prompt": "Choose all that apply:",
          "choices": [
            {
              "identifier": "ChoiceA",
              "text": "Option A"
            },
            {
              "identifier": "ChoiceB",
              "text": "Option B"
            },
            {
              "identifier": "ChoiceC",
              "text": "Option C"
            },
            {
              "identifier": "ChoiceD",
              "text": "Option D"
            }
          ]
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  textEntry: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Text Entry Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "single",
      "baseType": "string",
      "correctResponse": {
        "value": "sample answer"
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Enter your answer in the text box below."
        },
        {
          "@type": "textEntryInteraction",
          "responseIdentifier": "RESPONSE",
          "attributes": {
            "expectedLength": "20"
          }
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  extendedText: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Extended Text Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "single",
      "baseType": "string",
      "correctResponse": {
        "value": "Sample extended response"
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Provide a detailed response to the question below."
        },
        {
          "@type": "extendedTextInteraction",
          "responseIdentifier": "RESPONSE",
          "attributes": {
            "expectedLength": "500"
          }
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  hottext: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Hottext Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "multiple",
      "baseType": "identifier",
      "correctResponse": {
        "value": ["hot1", "hot3"]
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Select the correct words or phrases in the text."
        },
        {
          "@type": "hottextInteraction",
          "responseIdentifier": "RESPONSE",
          "attributes": {
            "maxChoices": "0"
          },
          "content": [
            {
              "@type": "paragraph",
              "text": "Click on the ",
              "children": [
                {
                  "@type": "hottext",
                  "text": "correct",
                  "attributes": {
                    "identifier": "hot1"
                  }
                },
                {
                  "@type": "text",
                  "text": " words in this "
                },
                {
                  "@type": "hottext",
                  "text": "sentence",
                  "attributes": {
                    "identifier": "hot2"
                  }
                },
                {
                  "@type": "text",
                  "text": " to "
                },
                {
                  "@type": "hottext",
                  "text": "answer",
                  "attributes": {
                    "identifier": "hot3"
                  }
                },
                {
                  "@type": "text",
                  "text": " the question."
                }
              ]
            }
          ]
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  slider: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Slider Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "single",
      "baseType": "float",
      "correctResponse": {
        "value": "5.0"
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Use the slider to select your answer."
        },
        {
          "@type": "sliderInteraction",
          "responseIdentifier": "RESPONSE",
          "attributes": {
            "lowerBound": "0",
            "upperBound": "10",
            "step": "1",
            "stepLabel": "true"
          }
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  }),

  order: (itemId: string): QTIJsonItem => ({
    "@type": "assessmentItem",
    "identifier": itemId,
    "title": "Order Interaction Question",
    "adaptive": false,
    "timeDependent": false,
    "responseDeclaration": {
      "identifier": "RESPONSE",
      "cardinality": "ordered",
      "baseType": "identifier",
      "correctResponse": {
        "value": ["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"]
      }
    },
    "outcomeDeclaration": [
      {
        "identifier": "SCORE",
        "cardinality": "single",
        "baseType": "float",
        "defaultValue": {
          "value": 0
        }
      }
    ],
    "itemBody": {
      "content": [
        {
          "@type": "paragraph",
          "text": "Arrange the items in the correct order."
        },
        {
          "@type": "orderInteraction",
          "responseIdentifier": "RESPONSE",
          "attributes": {
            "shuffle": "true"
          },
          "choices": [
            {
              "identifier": "ChoiceA",
              "text": "First item"
            },
            {
              "identifier": "ChoiceB",
              "text": "Second item"
            },
            {
              "identifier": "ChoiceC",
              "text": "Third item"
            },
            {
              "identifier": "ChoiceD",
              "text": "Fourth item"
            }
          ]
        }
      ]
    },
    "responseProcessing": {
      "template": "http://www.imsglobal.org/question/qti_v3p0/rptemplates/match_correct"
    }
  })
};

export const generateItemId = (): string => {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getBlankJsonTemplate = (): QTIJsonItem => {
  return QTI_JSON_TEMPLATES.choice(generateItemId());
};