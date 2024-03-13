import { Button, FileInput } from "flowbite-react";
import React, { Component } from "react";

export default class ImageConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.convert = this.convert.bind(this);
  }

  convert(e) {
    // check max. file size is not exceeded
    // size is in bytes
    // if (files[0].size > 2000000) {
    //   console.log("File too large");
    //   return;
    // }
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      console.log(reader.result); //base64encoded string
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  // setImage (e) {
  //   setImg()
  // }

  render() {
    // console.log(files);
    return (
      <>
        {/* <input
          accept="image/*"
          //   style={{
          //       display: "none",
          //     }}
          id="button-file"
          type="file"
          onChange={this.convert}
        /> */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={this.convert} />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            // onClick={}
          >Set File</Button>
        </div>
        {/* <label htmlFor="button-file"> */}
          {/* <Button variant="contained" color="primary" component="span">
            Add Additional Images
          </Button> */}
        {/* </label> */}
      </>
    );
  }
}
