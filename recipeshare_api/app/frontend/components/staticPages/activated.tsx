import { StaticContentWrapper } from "./common/staticContentWrapper";
import patatasBravas from "../../../assets/images/patatasBravas.png";

export const Activated = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          Thanks for confirming your e-mail address. You can now log into the
          Recipe-Share app.
        </>
      }
      image={patatasBravas}
    />
  );
};
