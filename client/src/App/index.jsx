import React, { lazy } from "react";
import { redirect, Routes, Route, useLocation, BrowserRouter } from "react-router-dom"

const Dashboard = lazy(() => {
    import("../pages/Dashboard")
})

const Home = lazy(() => {
    import("../pages/Home")
})

const About = lazy(() => {
    import("../pages/About")
})

const SignIn = lazy(() => {
    import("../pages/SignIn")
})

const Projects = lazy(() => {
    import("../pages/Projects")
})

const SignUp = lazy(() => {
    import("../pages/SignUp")
})

const Header = lazy(() => {
    import("../components/Header")
})

const Footer = lazy(() => {
    import("../components/Footer")
})

const PrivateRoute = lazy(() => {
    import("../components/PrivateRoute")
})

const OnlyAdminPrivateRoute = lazy(() => {
    import("../components/OnlyAdminPrivateRoute")
})

const CreatePost = lazy(() => {
    import("../pages/CreatePost")
})

const UpdatePost = lazy(() => {
    import("../pages/UpdatePost")
})

const PostPage = lazy(() => {
    import("../pages/PostPage")
})

const ScrollToTop = lazy(() => {
    import("../components/OnlyAdminPrivateRoute")
})

const Search = lazy(() => {
    import("../pages/Search")
})

function App() {
    return (
        <BrowserRouter>
        <ScrollToTop />
        </BrowserRouter>
    )
}