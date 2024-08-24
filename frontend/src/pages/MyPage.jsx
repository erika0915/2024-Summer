import React, { useState, useEffect } from "react";
import {
  MyPageContainer,
  Sidebar,
  Content,
  SectionTitle,
  UserInfo,
  UserInfoRow,
  UserInfoLabel,
  UserInfoValue,
  ScrapSection,
  ScrapItems,
  ScrapItem,
  ScrapItemIcon,
  ScrapItemText,
} from "../styles/MyPage.styles";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [scrapItems, setScrapItems] = useState([]); // 스크랩 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    const userCode = window.sessionStorage.getItem("userCode");

    if (token && userCode) {
      fetchUserData(token, userCode);
      loadScrapItems(token, userCode);
    } else {
      console.warn("토큰이나 userCode가 세션에 없습니다.");
      setLoading(false);
    }
  }, []);

  const fetchUserData = (token, userCode) => {
    fetch(`http://43.202.58.11:8080/api/users/${userCode}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data.data); // 사용자 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setError("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      });
  };

  const loadScrapItems = (token, userCode) => {
    // 세션 스토리지에서 스크랩 상태 불러오기
    const storedScrapItems = JSON.parse(window.sessionStorage.getItem("bookmarkedItems")) || {};
    const storedScrapCodes = Object.keys(storedScrapItems);

    if (storedScrapCodes.length > 0) {
      const scrapItemsFromStorage = storedScrapCodes.map(code => ({
        productCode: parseInt(code, 10),
        scrapCode: storedScrapItems[code].scrapCode,
        scrapMemo: "", // 필요 시 추가적인 정보를 불러올 수 있음
      }));
      setScrapItems(scrapItemsFromStorage);
      setLoading(false);
    } else {
      fetchScrapItems(token, userCode);
    }
  };

  const fetchScrapItems = (token, userCode) => {
    fetch(`http://43.202.58.11:8080/api/users/${userCode}/scraps`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setScrapItems(data.data); // 스크랩 데이터를 상태에 저장
        // 세션 스토리지에 스크랩 상태 저장
        const storedBookmarks = {};
        data.data.forEach((item) => {
          storedBookmarks[item.productCode] = {
            scrapCode: item.scrapCode,
            bookmarked: true,
          };
        });
        window.sessionStorage.setItem("bookmarkedItems", JSON.stringify(storedBookmarks));
      })
      .catch((error) => {
        console.error("스크랩 목록을 가져오는 중 오류 발생:", error);
        setError("스크랩 목록을 가져오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false); // 로딩 상태 해제
      });
  };

  const handleLogoClick = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  const handleItemClick = (url) => {
    window.open(url, "_blank"); // 상품명 클릭 시 새 탭에서 상품 홈페이지로 이동
  };

  if (loading) {
    return <div>Loading...</div>; // 데이터 로드 전 로딩 표시
  }

  if (error) {
    return <div>Error: {error}</div>; // 에러 발생 시 표시할 내용
  }

  if (!userData) {
    return <div>Loading...</div>; // 사용자 데이터 로드 전 로딩 표시
  }

  return (
    <MyPageContainer>
      <Sidebar>
        <img
          src={`${process.env.PUBLIC_URL}/logo.dark.png`}
          alt="Ewha Logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer", width: "100px" }}
        />
        <SectionTitle>MY PAGE</SectionTitle>
      </Sidebar>
      <Content>
        <SectionTitle>내 정보</SectionTitle>
        <UserInfo>
          <UserInfoRow>
            <UserInfoLabel>NAME</UserInfoLabel>
            <UserInfoValue>{userData.userName}</UserInfoValue>
          </UserInfoRow>
          <UserInfoRow>
            <UserInfoLabel>e-mail</UserInfoLabel>
            <UserInfoValue>{userData.email}</UserInfoValue>
          </UserInfoRow>
          <UserInfoRow>
            <UserInfoLabel>ID</UserInfoLabel>
            <UserInfoValue>{userData.userId}</UserInfoValue>
          </UserInfoRow>
        </UserInfo>
        <SectionTitle>MY 스크랩</SectionTitle>
        <ScrapSection>
          {scrapItems.length > 0 ? (
            <ScrapItems>
              {scrapItems.map((item, index) => (
                <ScrapItem
                  key={index}
                  onClick={() =>
                    handleItemClick(`https://example.com/product/${item.productCode}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <ScrapItemIcon />
                  <ScrapItemText>{item.scrapMemo}</ScrapItemText>
                </ScrapItem>
              ))}
            </ScrapItems>
          ) : (
            <div>스크랩한 항목이 없습니다.</div> // 스크랩 목록이 없을 때 보여줄 내용
          )}
        </ScrapSection>
      </Content>
    </MyPageContainer>
  );
};

export default MyPage;
