import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Header,
  FooterCom,
  PrivateRoute,
  OnlyAdminPrivateRoute,
  ScrollToTop,
  DashPages,
} from "./components";
import {
  Home,
  About,
  SignIn,
  SignUp,
  Dashboard,
  Projects,
  CreatePost,
  UpdatePost,
  PostPage,
  Search,
  Post,
  Pages,
  CreatePages,
  UpdatePage,
  PreviewPage,
} from "./pages";
import Player from "./player";

import useNetwork from "./utils/useNetwork";
import QuizMaker from "./Samples/QuizMaker";

function App() {
  const { isOnline: isNetwork } = useNetwork();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post" element={<Post />} />
        <Route path="/blog" element={<Post />} />
        <Route path="/createQ" element={<QuizMaker />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/my/video" element={<Player />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-page" element={<CreatePages />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/update-page/:pageId" element={<UpdatePage />} />
          <Route path="/preview/:pageSlug" element={<PreviewPage />} />
        </Route>

        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/page/:pageSlug" element={<Pages />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
