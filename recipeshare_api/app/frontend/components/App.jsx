import { Link, Outlet, RootRoute } from "@tanstack/react-router";

import React from 'react';
import { SpinachBackground } from "./spinachBackground/spinachBackground";
import styled from "styled-components";

const Wrapper = styled("div")`
  /* border: 5px solid blue; */
  /* background-color: #fff59b; */
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
  overflow: hidden;
`;

const Header = styled("div")`
  /* border: 5px solid red; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* gap: 16px; */
  padding: 0px 16px;
  align-items: center;
  /* background-color: #fff59b; */
  background-color: white;
  /* color: #104e01; */
  border-bottom: solid 1px #104e01;
`;

const HeaderLeft = styled("div")`
  /* border: 5px solid green; */
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
`;

const TitleBar = styled("div")`
  /* background-color: #fff59b; */
  background-color: white;
/* border: 5px solid red; */
  padding: 0px 24px;
`;

const Title = styled("h2")`
  /* border: 5px solid #104e01; */
  margin: 8px 0px;
`;

const Body = styled("div")`
  /* border: 5px solid green; */
  /* display: flex; */
  flex: 1;
  position: relative;
  padding: 24px 0px;

  @media (max-width: 928px) {
    padding: 0px;
  }
`;

export const AppRoute = new RootRoute({
  component: () => {
    return (
      <Wrapper>
        <SpinachBackground />
        <Header>
          <HeaderLeft>
            <Link to="/">Home</Link>
          </HeaderLeft>
          <HeaderRight>
            <Link to="/support">Support</Link>
            {/* <Link to="/activate">Activated</Link>
            <Link to="/reactivate">Reactivated</Link>
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
      </Wrapper>
    );
  },
});
