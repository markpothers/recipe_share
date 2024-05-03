import { useEffect, useState } from "react";

import { StaticContentWrapper } from "./common/staticContentWrapper";
import areYouSure from "../../../assets/images/areYouSure.png";
import deleteProfile from "../../../assets/images/deleteProfile.png";
import lastChance from "../../../assets/images/lastChance.png";

export const DeleteAccount = () => {
  const [currentImage, setCurrentImage] = useState(deleteProfile);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      const images = [deleteProfile, areYouSure, lastChance];
      const randomIndex = Math.floor(Math.random() * images.length);
      const image = images[randomIndex];
      setCurrentImage(image);
    }, 2000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);
  return (
    <StaticContentWrapper
      content={
        <>
          Sorry you are thinking about leaving but it's easy to do. To delete your account <strong>within the app</strong>, simply
          follow these steps:
          <ol>
            <li>
              In the app, switch to your <strong>Profile</strong> page.
            </li>
            <li>
              Open the '3 dot' menu and select the{" "}
              <strong>Delete Profile</strong> option.
            </li>
            <li>
              If you choose to <strong>Delete everything</strong>, then all
              recipes you've created and your account will be deleted.
              Alternatively, you can deactivate your account, and{" "}
              <strong>Leave recipes</strong> you've created behind. Your recipes
              will be anonymized and you will no longer be able to log in. (You
              can reactivate your account any time in the future.)
            </li>
            <li>
              Confirm your choice; you will be logged out and your account will
              be deactivated.
            </li>
          </ol>
Alternatively please <strong>e-mail</strong> us at <a href="admin@recipe-share.com">admin@recipe-share.com</a>, and we'll be happy to delete your account and send you are confirmation.
        </>
      }
      image={currentImage}
    />
  );
};
