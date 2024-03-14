import { Link, Outlet, RootRoute } from "@tanstack/react-router";

import React from "react";
import spinach from "../../assets/images/spinach.jpg";
import styled from "styled-components";

const Wrapper = styled("div")`
  color: #104e01;
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
  background-color: #f5f5f5ee;
  backdrop-filter: blur(5px);
  flex: 1;
  width: 80%;
  margin: 0px auto;
  border-radius: 4px;

  @media (max-width: 928px) {
    width: 90%;
  }
`;
const Header = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 12px;
  align-items: center;
  color: #fff59b;
  border-bottom: solid 1px #104e01;
`;

const HeaderLeft = styled("div")`
  color: #fff59b;
`;

const HeaderRight = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  color: #fff59b;
`;

const TitleBar = styled("div")`
  padding: 0px 24px;
  border-bottom: solid 1px #104e01;
`;

const Title = styled("h2")`
  margin: 8px 0px 8px 0px;
`;

const Body = styled("div")`
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
