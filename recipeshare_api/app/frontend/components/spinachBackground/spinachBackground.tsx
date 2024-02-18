import spinach from "../../../assets/images/spinach.jpg";
import styled from "styled-components";

const Wrapper = styled("div")`
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
`;

const BackgroundImage = styled("img")`
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export const SpinachBackground = () => {
  return (
    <Wrapper>
      <BackgroundImage src={spinach} alt="spinach leaves" />
    </Wrapper>
  );
};
