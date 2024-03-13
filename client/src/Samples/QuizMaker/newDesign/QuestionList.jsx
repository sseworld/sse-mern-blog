import React from "react";
import { Table, Button } from "flowbite-react";

const QuestionList = ({ questions, onDeleteQuestion, onEditClick }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th className="text-left">Text</th>
          <th className="text-left">Type</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question, index) => (
          <tr key={index}>
            <td className="text-left">{question.text}</td>
            <td className="text-left">{question.type}</td>
            <td className="text-right">
              <Button color="gray" size="sm" onClick={() => onEditClick(index)}>
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => onDeleteQuestion(index)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default QuestionList;
