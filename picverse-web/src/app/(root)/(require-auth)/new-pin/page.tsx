import { FC } from "react";

import { CreatePinForm } from "@app/components";
import { loadUserBoards } from "@app/lib/actions";

type CreatePinPageProps = {};

const CreatePinPage: FC<CreatePinPageProps> = async ({}) => {
  const boards = await loadUserBoards();

  return (
    <div className="header-spacing">
      <CreatePinForm boards={boards} />
    </div>
  );
};

export default CreatePinPage;
