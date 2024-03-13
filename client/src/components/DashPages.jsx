import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaEye } from "react-icons/fa";

export default function DashPages() {
  const { currentUser } = useSelector((state) => state.user);
  const [pages, setPages] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pageIdToDelete, setPageIdToDelete] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`/api/page/getpages`);
        const data = await res.json();
        if (res.ok) {
          // console.log(data);
          setPages(data.pages);
          if (data.pages.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPages();
    }
  }, []);

  const handleShowMore = async () => {
    const startIndex = pages.length;
    try {
      const res = await fetch(`/api/page/getpages?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setPages((prev) => [...prev, ...data.pages]);
        if (data.pages.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePage = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/page/deletepage/${pageIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setPages((prev) => {
          prev.filter((page) => page._id !== pageIdToDelete);
        });
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    // <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
    //   <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
    //     <h1 className="text-center p-2">All Pages</h1>
    //     <Button outline gradientDuoTone="purpleToPink">
    //       <Link to={"/create-page"}>Create Page</Link>
    //     </Button>

    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && pages.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Page Id</Table.HeadCell>
              <Table.HeadCell>Page title</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Preview</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {pages.map((page) => (
              <Table.Body className="divide-y" key={page._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {page.status === "active" ? (
                      <Link to={`/page/${page.slug}`}>
                        <p>{page._id}</p>
                      </Link>
                    ) : (
                      <Link to={`/preview/${page.slug}?p=true&&id=${page._id}`}>
                        <p>{page._id}</p>
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {page.status === "active" ? (
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/page/${page.slug}`}
                      >
                        <p>{page.title}</p>
                      </Link>
                    ) : (
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/preview/${page.slug}?p=true&&id=${page._id}`}
                      >
                        <p>{page.title}</p>
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>{page.status}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/preview/${page.slug}?p=true&&id=${page._id}`}>
                      {FaEye} Preview
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPageIdToDelete(page._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-page/${page._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no pages yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePage}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
    //   </div>
    // </div>
  );
}
