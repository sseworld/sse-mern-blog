import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";
import { useEffect, useState } from "react";
// import { CircularProgressbar } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePage() {
  // const [file, setFile] = useState(null);
  //   const [imageUploadProgress, setImageUploadProgress] = useState(null);
  //   const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { pageId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPage = async () => {
        const res = await fetch(`/api/page/getpages?pageId=${pageId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.pages[0]);
        }
      };
      fetchPage();
    } catch (error) {
      console.log(error.message);
    }
  }, [pageId]);

  //   const handleUpdloadImage = async () => {
  //     try {
  //       if (!file) {
  //         setImageUploadError("Please select an image");
  //         return;
  //       }
  //       setImageUploadError(null);
  //       const storage = getStorage(app);
  //       const fileName = new Date().getTime() + "-" + file.name;
  //       const storageRef = ref(storage, fileName);
  //       const uploadTask = uploadBytesResumable(storageRef, file);
  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           setImageUploadProgress(progress.toFixed(0));
  //         },
  //         (error) => {
  //           setImageUploadError("Image upload failed");
  //           setImageUploadProgress(null);
  //         },
  //         () => {
  //           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //             setImageUploadProgress(null);
  //             setImageUploadError(null);
  //             setFormData({ ...formData, image: downloadURL });
  //           });
  //         }
  //       );
  //     } catch (error) {
  //       setImageUploadError("Image upload failed");
  //       setImageUploadProgress(null);
  //       console.log(error);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/page/updatepage/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=pages`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Page</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <TextInput
            type="text"
            placeholder="Slug"
            required
            id="slug"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            value={formData.slug}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            value={formData.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Deactive/Inactive</option>
          </Select>
        </div>
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Page
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
