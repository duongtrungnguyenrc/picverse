import { Plus } from "lucide-react";
import { FC } from "react";

import { Button, PinListing, Typography } from "@app/components";
import { loadBoard, loadPinByBoard } from "@app/lib/actions";
import MansoryPinGallery from "@app/components/core/MansoryPinGallery";
import Link from "next/link";

type BoardDetailPageProps = {
  params: Promise<{ boardSignature: string }>;
};

const layoutConfig = {
  xs: 2,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  xxl: 6,
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
          <Link href="/new-pin">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <MansoryPinGallery pins={pins.data} isFetching={false} layoutConfig={layoutConfig} />
    </div>
  );
};

export default BoardDetailPage;
