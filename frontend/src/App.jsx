import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch} from "react-router-dom";
import ProductList from './ProductList';
import ProductManagement from './ProductManagement';
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import DepositPage from "./pages/ProductPage/DepositPage";
import SavingPage from "./pages/ProductPage/SavingPage";
import LoanPage from "./pages/ProductPage/LoanPage";
import CheckCardPage from "./pages/ProductPage/CheckCardPage";
import { GlobalStyle } from "./pages/ProductPage/styles";
import DetailedPage from "./pages/DetailedPage/DetailedPage";
import MyPage from "./pages/MyPage/MyPage"; 
import Main from "./pages/Main/Main";

const App = () => {
  return (
    <Router>
      <Routes>
        <Switch>
          <Route path="/" exact component={ProductList} /> 
          <Route path="/product-management" component={ProductManagement} />
        </Switch>
        <Route path="/" element={<Main />} />{" "}
        {/* 기본 경로를 MyPage로 리다이렉트 */}
        <Route path="/mypage" element={<MyPage />} /> {/* MyPage 페이지 */}
        <Route path="/main" element={<Main />} /> {/* Main 페이지 */}
        <Route path="/login" element={<Login />} /> {/* Login 페이지 */}
        <Route path="/signup" element={<SignUp />} /> {/* SignUp 페이지 */}
        <Route path="/deposit" element={<DepositPage />} />{" "}
        {/* DepositPage 페이지 */}
        <Route path="/saving" element={<SavingPage />} />{" "}
        {/* SavingPage 페이지 */}
        <Route path="/loan" element={<LoanPage />} /> {/* LoanPage 페이지 */}
        <Route path="/checkcard" element={<CheckCardPage />} />{" "}
        {/* CheckCardPage 페이지 */}
      </Routes>
    </Router>
  );
};

export default App;


export default App;
