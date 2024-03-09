import { Link, Outlet, RootRoute } from "@tanstack/react-router";

import React from "react";
import spinach from "../../assets/images/spinach.jpg";
import styled from "styled-components";

const Wrapper = styled("div")`
  /* border: 5px solid blue; */
  /* background-color: whitesmoke; */
  /* border-radius: 25px; */
  color: #104e01;
  /* padding: 12px; */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background-image: url(${spinach});
  background-size: cover;
  background-repeat: repeat;
`;

const BodyWrapper = styled("div")`
  /* border: 5px solid blue; */
  background-color: #f5f5f5ee;
  backdrop-filter: blur(5px);
  /* opacity: 0.5; */
  /* background-color: #fff59b; */
  /* border-radius: 25px; */
  /* color: #104e01; */
  /* padding: 12px; */
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  /* right: 0; */
  /* bottom: 0; */
  flex: 1;
  // min-height: 100%;
  /* height: fit-content; */
  width: 80%;
  margin: 0px auto;
  /* margin-top:4px; */
  /* margin-left: auto; */
  /* margin-right: auto; */
  border-radius: 4px;
  /* display: flex; */
  /* flex-direction: column; */
  /* overflow: hidden; */

  @media (max-width: 928px) {
    width: 90%;
  }
`;
const Header = styled("div")`
  /* border: 5px solid red; */
  /* background-color: whitesmoke; */
  /* background-color: whitesmoke; */
  /* background-color: #104e01; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* gap: 16px; */
  padding: 0px 12px;
  align-items: center;
  /* color: #104e01; */
  color: #fff59b;
  border-bottom: solid 1px #104e01;
  /* background-image: url(${spinach}); */
  /* background-size: cover; */
`;

const HeaderLeft = styled("div")`
  /* border: 5px solid green; */
  color: #fff59b;
`;

const HeaderRight = styled("div")`
  /* border: 5px solid blue; */
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 16px;
  /* padding: 0px 16px; */
  align-items: center;
  /* background-color: #fff59b; */
  /* color: #104e01; */
  color: #fff59b;
`;

const TitleBar = styled("div")`
  /* background-color: #fff59b; */
  /* background-color: white; */
  /* border: 5px solid red; */
  padding: 0px 24px;
  border-bottom: solid 1px #104e01;
`;

const Title = styled("h2")`
  /* border: 5px solid #104e01; */
  margin: 8px 0px 8px 0px;
`;

const Body = styled("div")`
  /* border: 1px solid green; */
  /* display: flex; */
  flex: 1;
  position: relative;
  padding: 16px 16px;

  @media (max-width: 928px) {
    padding: 12px;
  }
`;

export const AppRoute = new RootRoute({
  component: () => {
    return (
      <Wrapper>
        <BodyWrapper>
          <Header>
            <HeaderLeft>
              <Link to="/">
                <span>Home</span>
              </Link>
            </HeaderLeft>
            <HeaderRight>
              <Link to="/support">Support</Link>
              {/* <Link to="/activated">Activated</Link>
              <Link to="/reactivated">Reactivated</Link>
              <Link to="/reactivation-confirmed">Reactivation Confirmed</Link>
              <Link to="/reactivation-rejected">Reactivation Rejected</Link>
              <Link to="/rejected">Rejected</Link> */}
              <Link to="/deleteAccount">Delete Account</Link>
            </HeaderRight>
          </Header>
          <TitleBar>
            <Title>Recipe-Share</Title>
          </TitleBar>
          <Body>
            <Outlet />
          </Body>
        </BodyWrapper>
      </Wrapper>
    );
  },
});
