import { StaticContentWrapper } from "./common/staticContentWrapper";
import sausageSweetPotato from "../../../assets/images/sausageSweetPotato.png";

export const ReactivationRejected = () => {
  return (
    <StaticContentWrapper
      content={
        <>
          <span>
            We're sorry but your reactivation token didn't match our records.&nbsp;
          </span>
          <span>Please contact us at </span>
          <a href="<%= Rails.application.credentials.email[:admin_email] %>">
            admin@recipe-share.com
          </a>
          <span> and we'll fix the problem as soon as possible.</span>
        </>
      }
      image={sausageSweetPotato}
    />
  );
};
