import styled from "styled-components";

type OwnProps = {
  content: React.ReactNode;
  image: string;
};

const Wrapper = styled("div")`
  /* border: 5px solid red; */
  /* flex: 1; */
  /* height: 100%; */
  width: 100%;
  /* position: relative; */
  display: flex;
  justify-content: space-evenly;
  /* align-items: center; */

  @media (max-width: 928px) {
    /* border: 5px solid red; */
    flex-direction: column;
    overflow-y: auto;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    /* height: undefined; */
    /* flex: 1; */
  }
`;

// const StylishLoop = styled("div")`
//   border: 25px solid #fff59b;
//   border-radius: 25px;
//   position: absolute;
//   top: 10%;
//   left: 25%;
//   right: 25%;
//   z-index: -1;
//   /* object-fit: cover; */
//   height: 80%;
//   width: 50%;
// `;

const ContentContainer = styled("div")`
  /* border: 5px solid red; */
  /* background-color: #fff59b; */
  /* border-radius: 25px; */
  /* color: #104e01; */
  /* padding: 12px; */
  /* position: absolute; */
  /* top: 20%; */
  /* left: 0%; */
  /* right: 0%; */
  /* max-height: 500px; */
  height: 750px;
  width: calc(100% - 500px);
  /* height: fit-content; */

  @media (max-width: 928px) {
    width: 95%;
    /* border: 5px solid red; */
    height: fit-content;
    margin: 16px 0px;
  }
`;

const ContentWrapper = styled("div")`
  border: 5px solid #104e01;
  outline: 5px solid #fff59b;
  background-color: #fff59b;
  border-radius: 25px;
  color: #104e01;
  padding: 12px;
  /* position: absolute; */
  /* top: 20%; */
  /* left: 0%; */
  /* right: 0%; */
  /* max-height: 500px; */
  /* height: 800px; */
  width: 100%;
  height: fit-content;

  
`;

const ImageWrapper = styled("div")`
  border: 5px solid #104e01;
  outline: 5px solid #fff59b;
  /* background-color: #fff59b; */
  /* padding: 12px; */
  border-radius: 25px;
  /* position: absolute; */
  /* top: 40%; */
  /* left: 0%; */
  /* right: 0%; */
  height: 700px;
  width: 400px;
  overflow-y: auto;
  @media (max-width: 928px) {
    width: 95%;
  }
`;

const RecipeImage = styled("img")`
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  object-fit: cover;
  /* height: 100%; */
  width: 100%;
`;

export const StaticContentWrapper = ({ content, image }: OwnProps) => {
  return (
    <Wrapper>
      {/* <StylishLoop /> */}
      <ContentContainer>
        <ContentWrapper>{content}</ContentWrapper>
      </ContentContainer>
      <ImageWrapper>
        <RecipeImage src={image} alt="image of a recipe" />
      </ImageWrapper>
    </Wrapper>
  );
};
