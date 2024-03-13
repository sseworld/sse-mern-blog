import React from "react";

const PreviewQuiz = ({ questions }) => {
  return (
    <div>
      {questions.map((question, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-bold">{question.text}</h3>
          {question.type === "multiple-choice" && (
            <ul className="list-none">
              {question.options.map((option, i) => (
                <li key={i}>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={i}
                      disabled
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          )}
          {question.type === "true-false" && (
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question_${index}`}
                  value="true"
                  disabled
                />
                True
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question_${index}`}
                  value="false"
                  disabled
                />
                False
              </label>
            </div>
          )}
          {question.type === "open-ended" && (
            <textarea
              className="w-full rounded-md border border-gray-300 p-2"
              disabled
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewQuiz;
