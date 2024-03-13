import React, { useState } from "react";
import {
  Alert,
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Timeline,
  ToggleSwitch,
} from "flowbite-react";

export default function Format() {
  const [isBlog, setIsBlog] = useState(false);
  // const [qList, setQList] = useState({ name: "", isBlog: isBlog });

  const handleToggle = async () => {
    setIsBlog(!isBlog);
  };

  const handleSubmit = async (e) => {};
  const createTrueFalse = async (e) => {};
  const createOption = async (e) => {};
  const createBox = async (e) => {};

  return (
    <>
      <>
        {/* <div className="min-h-screen flex items-center justify-center">
        <form className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* <div className="flex flex-col"> */}
        {/* <div>
            <Label value="Title" />
            <TextInput placeholder="Quiz Title" type="text" id="name" />
          </div>
          <div>
            <Label value="Is it a blog related quiz" />
            {isBlog ? (
              <ToggleSwitch onChange={handleToggle} checked />
            ) : (
              <ToggleSwitch onChange={handleToggle} />
            )}
          </div> */}
        {/* </div> */}
        {/* {isBlog ? (
            <>
              <div>
                <Label value="Inter the Blog Id" />
                <TextInput
                  placeholder="eg: 6845jhdfh487r487"
                  type="text"
                  id="blogId"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label value="Inter the Blog Id" />
                <TextInput
                  placeholder="eg: 6845jhdfh487r487"
                  type="text"
                  id="blogId"
                  disabled
                />
              </div>
            </>
          )}
          <div>
            <Label value="Duration (in Minutes)" />
            <TextInput
              type="number"
              placeholder="Type Time limit of the text"
              min={0}
            />
          </div>
          <div>
            <Label value="Add Question" />
            {/* <TextInput type="button" onClick={createBox} /> */}
        {/* <Select>
              <option onClick={createTrueFalse} value="truefalse">
                Create A True False Question
              </option>
              <option onClick={createOption} value="javascript">
                Create A MultiChoice Question
              </option>
            </Select>
          </div>
        </form>
      </div> */}
      </>
      <>
      {/* <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Quiz Maker</h1>
        <form action="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <div>
              <Label value="Quiz Title" />
              <TextInput placeholder="Quiz Title" type="text" id="name" />
            </div>
            <div>
              <Label value="Is it a blog related quiz" />
              {isBlog ? (
                <ToggleSwitch onChange={handleToggle} checked />
              ) : (
                <ToggleSwitch onChange={handleToggle} />
              )}
            </div>
            {isBlog ? (
              <>
                <div>
                  <Label value="Enter the Blog Id" />
                  <TextInput
                    placeholder="eg: 6845jhdfh487r487"
                    type="text"
                    id="blogId"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label value="Enter the Blog Id" />
                  <TextInput
                    placeholder="eg: 6845jhdfh487r487"
                    type="text"
                    id="blogId"
                    disabled
                  />
                </div>
              </>
            )}
          </div>{" "}
          <br></br>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <div>
              <Label value="Description" />
              <TextInput type="text" placeholder="Description" />
            </div>
            <div>
              <Label value="Tags" />
              <TextInput type="combobox" />
            </div>
          </div>
          <Button type="submit" >Create Quiz</Button>
        </form>
      </div> */}
      </>
      <></>
    </>
  );
}
