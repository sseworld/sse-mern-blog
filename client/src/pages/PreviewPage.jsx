import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

function Stat({ status, data, slug }) {
  return (
    <div>
      {status === "active" ? (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-3 text-center">
              <div className="">
                <h1 className="text-3xl font-bold lg:text-6xl">
                  This Page is live...
                </h1>
                <Button
                  outline
                  gradientDuoTone="purpleToPink"
                  className="rounded-tl-xl rounded-bl-none"
                >
                  <Link to={`/page/${slug}`}>Go to the Page</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="main">
            <div className="" dangerouslySetInnerHTML={{ __html: data }}></div>
          </div>
        </>
      )}
    </div>
  );
}

function Data({ id, mid, slug, mslug, status, data }) {
  const idM = id === mid;
  const slugM = slug === mslug;

  return (
    <div>
      {idM && slugM ? (
        <Stat status={status} data={data} slug={slug} />
      ) : (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-3 text-center">
              <div className="">
                <h1 className="text-3xl font-bold lg:text-6xl">
                  Incomplete Information
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function PreviewPage() {
  const [pageData, setPageData] = useState("");
  const [loadingError, setLoadingError] = useState("");
  const [id, setId] = useState("");
  const [p, setP] = useState(false);

  const { pageSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const idFromUrl = urlParams.get("id");
    const pFromUrl = urlParams.get("p");
    if (idFromUrl) {
      setId(idFromUrl);
    }
    if (pFromUrl) {
      setP(pFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    try {
      const fetchPage = async () => {
        const res = await fetch(`/api/page/getpages?slug=${pageSlug}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setLoadingError(data.message);
          return;
        }
        if (res.ok) {
          setLoadingError(null);
          setPageData(data.pages[0]);
        }
      };
      fetchPage();
    } catch (error) {
      console.log(error.message);
    }
  }, [id, pageSlug]);

  return (
    <div>
      {currentUser.isAdmin ? (
        <Data
          id={pageData._id}
          mid={id}
          slug={pageData.slug}
          mslug={pageSlug}
          status={pageData.status}
          data={pageData.content}
        />
      ) : (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-3 text-center">
              <div className="">
                <h1 className="text-3xl font-bold lg:text-6xl">
                  You are not Admin
                </h1>
                <Button
                  outline
                  gradientDuoTone="purpleToPink"
                  className="rounded-tl-xl rounded-bl-none"
                >
                  <Link to={`/sign-in`}>Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
