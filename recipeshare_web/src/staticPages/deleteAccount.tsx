import { StaticContentWrapper } from "./common/staticContentWrapper";
import chickenBaconMushroom from "../assets/chickenBaconMushroom.png";

export const DeleteAccount = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          Thanks for visiting. We hope you are getting on well with the app. If
          you have any problems or need support, please e-mail us at{" "}
          <a href="mailto:admin@recipe-share.com">admin@recipe-share.com</a>
        </>
      }
      image={chickenBaconMushroom}
    />
  );
};
