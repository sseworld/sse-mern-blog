import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import {} from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Post() {
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=12`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
          setLoading(false);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5">Recent articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {recentPosts &&
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
