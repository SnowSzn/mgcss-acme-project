import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Categories from "./pages/Categories";
import CategoryArticles from "./pages/CategoryArticles";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import MyArticles from "./pages/MyArticles";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import ManageCategories from "./pages/ManageCategories";
import ManageUsers from "./pages/ManageUsers";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "0 20px" }}>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryArticles />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-articles" element={<MyArticles />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/edit-article/:id" element={<EditArticle />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
