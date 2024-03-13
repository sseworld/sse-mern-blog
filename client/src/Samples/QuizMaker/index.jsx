import { Button, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import QuestionForm from "./newDesign/QuestionForm";
import QuestionList from "./newDesign/QuestionList";
import PreviewQuiz from "./newDesign/PreviewQuiz";

const QuizMaker = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    duration: 0,
  });

  console.log(questions);

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(null);
  };

  const editQuestion = (index, updatedQuestion) => {
    setQuestions(
      questions.map((question, i) => (i === index ? updatedQuestion : question))
    );
    setCurrentQuestion(null);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setCurrentQuestion(index);
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = () => {
    // Implement logic to save settings (e.g., to local storage or database)
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Maker</h1>
      <Button color="grey" onClick={() => setShowSettings(true)}>
        Setting
      </Button>
      <Modal show={showSettings} onClose={() => setShowSettings(false)}>
        <Modal.Header>Quiz Settings</Modal.Header>
        <Modal.Body>
          <TextInput
            type="text"
            placeholder="Quiz Title"
            name="title"
            value={settings.title}
            onChange={handleSettingsChange}
          />
          <TextInput
            type="text"
            placeholder="Quiz Description (Optional)"
            name="description"
            value={settings.description}
            onChange={handleSettingsChange}
          />
          <TextInput
            type="number"
            placeholder="Duration (Minutes)"
            name="duration"
            value={settings.duration}
            onChange={handleSettingsChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button color="primary" onClick={handleSaveSettings}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <QuestionForm
        onAddQuestion={addQuestion}
        currentQuestion={currentQuestion}
        onEditQuestion={editQuestion}
      />
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Created Questions</h2>
          <QuestionList
            questions={questions}
            onDeleteQuestion={deleteQuestion}
            onEditClick={handleEditClick}
          />
        </div>
      )}
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Preview Quiz</h2>
          <PreviewQuiz questions={questions} />
        </div>
      )}
    </div>
  );
};

export default QuizMaker;
