import { Plus } from "lucide-react";
import { FC } from "react";

import { Button, PinListing, Typography } from "@app/components";
import { loadBoard, loadPinByBoard } from "@app/lib/actions";

type BoardDetailPageProps = {
  params: Promise<{ boardSignature: string }>;
};

const BoardDetailPage: FC<BoardDetailPageProps> = async ({ params }) => {
  const { boardSignature } = await params;

  const pins = await loadPinByBoard(boardSignature);
  const board = await loadBoard(boardSignature);

  return (
    <div className="header-spacing container space-y-5 py-5">
      <div className="flex-center justify-between">
        <Typography variant="h2">{board.name}</Typography>

        <div className="flex-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <PinListing initialData={pins} />
    </div>
  );
};

export default BoardDetailPage;
