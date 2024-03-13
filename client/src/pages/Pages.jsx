import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Pages = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageData, setPageData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { pageSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/page/getpages?slug=${pageSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPageData(data.pages[0]);
          setPageTitle(data.pages[0].title);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPage();
  }, [pageSlug]);

  // document.title(pageTitle)

  return (
    <div className="main">
      {pageData.status === "active" ? (
        <div
          // className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: pageData && pageData.content }}
        ></div>
      ) : (
        navigate("/404")
      )}
    </div>
  );
};

export default Pages;
