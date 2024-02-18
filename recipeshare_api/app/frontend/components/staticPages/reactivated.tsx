import { StaticContentWrapper } from "./common/staticContentWrapper";
import sausageAndLentils from "../../../assets/images/sausageAndLentils.png";

export const Reactivated = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          <span>Thanks for confirming your desire to reactivate this account.</span>
          <p>
            We've sent you a second e-mail with a new password. You can use that
            to log in. Please reset it within 24hrs for added security.
          </p>
        </>
      }
      image={sausageAndLentils}
    />
  );
};
