import { loadProfile } from "@app/lib/actions";
import { Calendar, Mail, Phone, User2 } from "lucide-react";
import { notFound } from "next/navigation";
import { FC } from "react";

type ProfileInformationsParallelPageProps = { params: Promise<{ signature: string }> };

const ProfileInformationsParallelPage: FC<ProfileInformationsParallelPageProps> = async ({ params }) => {
  const { signature } = await params;

  const profile: ProfileDetail | null = await loadProfile(signature != "me" ? signature : undefined);

  if (!profile) notFound();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-8 w-full space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 col-span-full">
          <div className="text-sm font-medium text-muted-foreground">Bio</div>
          <div className="flex items-center gap-2">
            <span>{profile.bio}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Email</div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{profile.email}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Phone</div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{profile.phone}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Birth</div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(profile.birth)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Gender</div>
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{profile.gender}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Joined date</div>
            <div>{formatDate(profile.createdAt)}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Last update</div>
            <div>{formatDate(profile.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformationsParallelPage;
