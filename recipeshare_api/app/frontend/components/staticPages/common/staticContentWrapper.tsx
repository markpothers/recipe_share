import styled from "styled-components";

type OwnProps = {
  content: React.ReactNode;
  image: string;
};

const Wrapper = styled("div")`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 16px;

  @media (max-width: 928px) {
    flex-direction: column;
    overflow-y: auto;
    align-items: center;
    justify-content: flex-start;
  }
`;

const ContentContainer = styled("div")`
  flex: 1;
  width: calc(100% - 500px);

  @media (max-width: 928px) {
    width: 95%;
    height: fit-content;
  }
`;

const ContentWrapper = styled("div")`
  border: 2px solid #104e01;
  background-color: white;
  border-radius: 10px;
  color: #104e01;
  padding: 12px;
  width: 100%;
  height: fit-content;
`;

const ImageWrapper = styled("div")`
  border: 2px solid #104e01;
  border-radius: 10px;
  max-height: 700px;
  width: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: 928px) {
    width: 95%;
  }
`;

const RecipeImage = styled("img")`
  object-fit: cover;
  width: 100%;
`;

export const StaticContentWrapper = ({ content, image }: OwnProps) => {
  return (
    <Wrapper>
      <ContentContainer>
        <ContentWrapper>{content}</ContentWrapper>
      </ContentContainer>
      <ImageWrapper>
        <RecipeImage src={image} alt="image of a recipe" />
      </ImageWrapper>
    </Wrapper>
  );
};
