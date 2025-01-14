import { CreatePinForm } from "@app/components";
import { FC } from "react";

type CreatePinPageProps = {};

const CreatePinPage: FC<CreatePinPageProps> = ({}) => {
  return (
    <div className="header-spacing">
      <CreatePinForm />
    </div>
  );
};

export default CreatePinPage;
