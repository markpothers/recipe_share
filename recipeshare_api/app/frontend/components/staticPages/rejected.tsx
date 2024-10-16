import { StaticContentWrapper } from "./common/staticContentWrapper";
import toadInTheHole from "../../../assets/images/toadInTheHole.png";

export const Rejected = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          <span>
            We're sorry but your activation token didn't match our records.
            Please re-register or click the activation link.
          </span>
          <br />
          <span>
            If you need additional support, please feel free to contact us at:{" "}
            <a href="<%= Rails.application.credentials.email[:admin_email] %>">
              admin@recipe-share.com
            </a>
            .
          </span>
        </>
      }
      image={toadInTheHole}
    />
  );
};
