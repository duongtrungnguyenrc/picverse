import { CommentForm } from "./CommentForm";
import CommentThread from "./CommentThread";

const dummyComments: Cmt[] = [
  {
    _id: "1",
    by: {
      _id: "user1",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://avatar.vercel.sh/john",
    },
    pinId: "pin1",
    content: "This is a great post!",
    createdAt: new Date("2024-02-17T10:00:00").toString(),
  },
  {
    _id: "2",
    by: {
      _id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://avatar.vercel.sh/jane",
    },
    pinId: "pin1",
    replyFor: {
      _id: "1",
      by: {
        _id: "user1",
        firstName: "John",
        lastName: "Doe",
        avatar: "https://avatar.vercel.sh/john",
      },
      pinId: "pin1",
      content: "This is a great post!",
      createdAt: new Date("2024-02-17T10:00:00").toString(),
    },
    content: "I totally agree with you!",
    createdAt: new Date("2024-02-17T10:30:00").toString(),
  },
];

export default function CommentsSection() {
  const handleSubmitComment = async (content: string) => {
    console.log("Submitting comment:", content);
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <CommentForm onSubmit={handleSubmitComment} />
      <CommentThread comments={dummyComments} />
    </div>
  );
}
