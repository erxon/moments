import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ImageType from "@/lib/types/image.types";
import { MessageSquare } from "lucide-react";
import { SetStateAction, useState } from "react";
import FeedImage from "../feed/feed-image";
import FeedHeader from "../feed/feed-header";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import User from "@/components/user";
import { Separator } from "@/components/ui/separator";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Comment from "@/components/comment";
import type CommentType from "@/lib/types/comment.types";

export default function CommentTrigger({ image }: { image: ImageType }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClick = () => setOpenDialog(true);
  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleClick}
      >
        <MessageSquare />
        <p>Comment</p>
      </div>
      {/*Comment Dialog*/}
      <CommentDialog image={image} open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}

function CommentDialog({
  image,
  open,
  setOpen,
}: {
  image: ImageType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <ScrollArea className="h-[540px]">
            <DialogHeader className="mb-4">
              <DialogTitle>{image.title}</DialogTitle>
              <DialogDescription>{image.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <FeedHeader image={image} />
              <FeedImage image={image} />
              <Separator />
              <CommentField image={image} />
              <Comments image_id={image.id} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Comments({ image_id }: { image_id: string }) {
  const { data, isLoading, error } = useSWR(
    `/api/image/${image_id}/comments?number=3`,
    fetcher
  );

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[40px]" />
        <Skeleton className="h-[40px]" />
        <Skeleton className="h-[40px]" />
      </div>
    );
  }

  const comments = data as CommentType[];

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentField({ image }: { image: ImageType }) {
  const [commentInput, setCommentInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (commentInput.length === 0) return;

    setSubmitting(true);
    try {
      const result = await axios.post(`/api/image/${image.id}/comments`, {
        comment: commentInput,
      });

      if (result.status === 200) {
        mutate(`/api/image/${image.id}/comments?number=3`);
        setCommentInput("");
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <UserAvatar user_id={image.user_id!} />
        <div className="flex flex-col gap-2 items-start w-full">
          <Textarea
            className="resize-none h-"
            placeholder="Type your comment here..."
            onChange={handleChange}
            value={commentInput}
          />
          <Button disabled={submitting} onClick={handleSubmit} size={"sm"}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </>
  );
}
