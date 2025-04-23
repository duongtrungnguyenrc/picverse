import { FC } from "react";

import { CreatePinForm } from "@app/components";
import { loadUserBoards } from "@app/lib/actions";

type CreatePinPageProps = {
  searchParams: Promise<{ resource: string }>;
};

const CreatePinPage: FC<CreatePinPageProps> = async ({ searchParams }) => {
  const query = await searchParams;
  const boards = await loadUserBoards();

  return (
    <div className="header-spacing">
      <CreatePinForm resourceId={query.resource} boards={boards} />
    </div>
  );
};

export default CreatePinPage;
