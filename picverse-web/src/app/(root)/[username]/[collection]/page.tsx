import { CollectionListing } from "@app/components";
import { FC } from "react";

type UserCollectionPageProps = {};

const UserCollectionPage: FC<UserCollectionPageProps> = ({}) => {
  return (
    <div className="container">
      <CollectionListing />
    </div>
  );
};

export default UserCollectionPage;
