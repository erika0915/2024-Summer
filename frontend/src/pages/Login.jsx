import React, { useState } from "react";
import { Header } from "../components/index.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import * as S from "../styles/Login.styles";
import LoginValidationSchema from "../validations/LoginValidationSchema";

export const Login = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginValidationSchema),
  });

  const [isLogin, setIsLogin] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch("http://43.202.58.11:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        password: data.password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success") {
          window.sessionStorage.setItem("token", result.token);
          window.sessionStorage.setItem("role", result.role);
          window.sessionStorage.setItem("userCode", result.userCode);
          setIsLogin(true);

          if (data.userId === "admin" && data.password === "adminpassword") {
            alert("관리자로 로그인 되었습니다");
          } else {
            alert("로그인 되었습니다");
          }

          setIsLogin(true);
          navigate("/");
        } else {
          alert("아이디와 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setShowError(true);
      });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <S.LoginPage>
      <Header isLogin={isLogin} />
      <S.LoginBar>LOGIN</S.LoginBar>
      <S.LoginContainer>
        <S.LoginForm onSubmit={handleSubmit(onSubmit)}>
          <S.LoginFormGroup>
            <S.Label>ID</S.Label>
            <S.Input type="text" {...register("userId")} />
            {errors.userId && (
              <S.ErrorMessage>{errors.userId.message}</S.ErrorMessage>
            )}{" "}
          </S.LoginFormGroup>
          <S.LoginFormGroup>
            <S.Label>PASSWORD</S.Label>
            <S.Input type="password" {...register("password")} />
            {errors.password && (
              <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
            )}{" "}
          </S.LoginFormGroup>
          <S.LoginButtonGroup>
            <S.LoginButton type="submit">LOGIN</S.LoginButton>
          </S.LoginButtonGroup>
        </S.LoginForm>
        <button onClick={handleSignUp} className="signup-link">
          SIGN UP
        </button>
      </S.LoginContainer>
      {showError && (
        <>
          <S.Dimmed />
          <S.Popup>
            <S.PopupContent>
              <p>회원 정보가 일치하지 않습니다.</p>
              <button onClick={handleCloseError}>확인</button>
            </S.PopupContent>
          </S.Popup>
        </>
      )}
    </S.LoginPage>
  );
};

export default Login;
