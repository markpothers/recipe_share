import { StaticContentWrapper } from "./common/staticContentWrapper";
import reverseSearedSteak from "../../../assets/images/reverseSearedSteak.png";

export const ReactivationConfirmed = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          <span>Account reactivated!</span>
          <p>
            We've sent you another e-mail with a new password. Please reset it
            within 24 hrs for added security.
          </p>
          <span>
            When you log in, please update your profile, otherwise you'll
            continue to be anonymous. Your recipes should be there waiting for
            you.
          </span>
        </>
      }
      image={reverseSearedSteak}
    />
  );
};
