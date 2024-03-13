import React, { useState } from "react";
import { Select, TextInput, Button } from "flowbite-react";

const QuestionForm = ({ onAddQuestion, currentQuestion, onEditQuestion }) => {
  const [text, setText] = useState(currentQuestion ? currentQuestion.text : "");
  const [type, setType] = useState(
    currentQuestion ? currentQuestion.type : "multiple-choice"
  );
  const [options, setOptions] = useState(
    currentQuestion ? currentQuestion.options : []
  );
  const [answer, setAnswer] = useState(
    currentQuestion ? currentQuestion.answer : ""
  );

  const handleOptionChange = (index, value) => {
    setOptions([
      ...options.slice(0, index),
      value,
      ...options.slice(index + 1),
    ]);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index) => {
    setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      text,
      type,
      options,
    };

    if (type === "multiple-choice") {
      newQuestion.answer === answer;
    }

    if (currentQuestion) {
      onEditQuestion(currentQuestion, newQuestion);
    } else {
      onAddQuestion(newQuestion);
    }

    setText("");
    setType("multiple-choice");
    setOptions([]);
    setAnswer("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <TextInput
        type="text"
        placeholder="Enter question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="true-false">True/False</option>
        <option value="one-ended">Open Ended</option>
      </Select>
      {type === "multiple-choice" && (
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <TextInput
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 1 && (
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteOption(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button color="success" size="sm" onClick={handleAddOption}>
            Add Option
          </Button>
          <TextInput
            type="text"
            placeholder="Enter answer (index starts from 0)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
      )}
      <Button type="submit" color="primary">
        {currentQuestion ? "Update Question" : "Add Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;
