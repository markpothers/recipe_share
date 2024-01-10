import { useEffect, useState } from "react";

import { StaticContentWrapper } from "./common/staticContentWrapper";
import chickenAndMushroomMarsala from "../assets/chickenAndMushroomMarsala.png";
import chickenBaconMushroom from "../assets/chickenBaconMushroom.png";
import filters from "../assets/filters.png";
import getItOnAppleAppstore from "../assets/getItOnAppleAppstore.png";
import getItOnGooglePlay from "../assets/getItOnGooglePlay.png";
import login from "../assets/login.png";
import newRecipe from "../assets/toadInTheHole.png";
import patatasBravas from "../assets/patatasBravas.png";
import recipeList from "../assets/recipeList.png";
import register from "../assets/register.png";
import reverseSearedSteak from "../assets/reverseSearedSteak.png";
import sausageAndLentils from "../assets/sausageAndLentils.png";
import styled from "styled-components";
import toadInTheHole from "../assets/toadInTheHole.png";

const ImageWrapper = styled("div")`
  /* border: 1px solid red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  max-width: 400px;
  margin-left: auto;
  max-height: 70px;
`;

const AppStoreLink = styled("a")`
  /* border: 1px solid green; */
  /* flex: 1; */
  height: 100%;
  width: 50%;
`;

const AppStoreImage = styled("img")`
  /* height: 100%; */
  /* flex: 1; */
  width: 100%;
  /* margin-left: auto; */
  /* max-height: 100%; */
  /* height: 60px; */
  /* margin: 16px; */
  /* margin-left: calc(100% - 200px); */
`;

const WelcomeContent = () => {
  return (
    <>
      Welcome to Recipe-Share a brand new app for posting and sharing your
      favorite recipes. Find us in your app store.
      <ImageWrapper>
        <AppStoreLink href="https://play.google.com/store/apps/details?id=com.recipe_share.recipe_share&hl=en_US&gl=US">
          <AppStoreImage
            src={getItOnGooglePlay}
            alt="Recipe share on Google Play"
          />
        </AppStoreLink>
        <AppStoreLink href="https://apps.apple.com/us/app/recipe-share/id1537260513">
          <AppStoreImage
            src={getItOnAppleAppstore}
            alt="Recipe share on the Apple App store"
          />
        </AppStoreLink>
      </ImageWrapper>
    </>
  );
};

export const Welcome = () => {
  const [currentImage, setCurrentImage] = useState(chickenAndMushroomMarsala);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      const images = [
        chickenAndMushroomMarsala,
        chickenBaconMushroom,
        patatasBravas,
        reverseSearedSteak,
        sausageAndLentils,
        toadInTheHole,
        login,
        register,
        filters,
        recipeList,
        newRecipe,
      ];
      const randomIndex = Math.floor(Math.random() * images.length);
      const image = images[randomIndex];
      setCurrentImage(image);
    }, 2000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);
  return (
    <StaticContentWrapper content={<WelcomeContent />} image={currentImage} />
  );
};
