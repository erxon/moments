"use client";

import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFallbackString } from "@/lib/string.util";
import Profile from "@/lib/types/profile.types";
import { Separator } from "@/components/ui/separator";
import {
  localeDateStringFormatter,
  localeTimeStringFormatter,
} from "@/lib/date.util";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";

interface Comment {
  id: string;
  image_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export default function DisplayComments({
  image_id,
  auth_user,
}: {
  image_id: string;
  auth_user: Profile;
}) {
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const { data, isLoading, error } = useSWR(
    `/api/image/${image_id}/comments`,
    fetcher
  );

  if (error)
    return (
      <>
        <div>Something went wrong.</div>
      </>
    );
  if (isLoading)
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="w-full h-[100px]" />
        <Skeleton className="w-full h-[100px]" />
        <Skeleton className="w-full h-[100px]" />
      </div>
    );

  const comments = data as Comment[];

  return (
    <>
      <div className="flex flex-col gap-6 overflow-auto">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment}>
            {auth_user.id === comment.user_id && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size={"icon"}
                  onClick={() => {
                    setCommentToDelete(comment);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Comment>
        ))}
      </div>
      {commentToDelete && (
        <DeleteCommentDialog
          comment={commentToDelete}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
        />
      )}
    </>
  );
}

function Comment({
  comment,
  children,
}: {
  comment: Comment;
  children: React.ReactNode;
}) {
  const createdAt = new Date(comment.created_at);
  const date = localeDateStringFormatter(createdAt.toLocaleDateString());
  const time = localeTimeStringFormatter(createdAt.toLocaleTimeString());

  return (
    <div>
      <div className="mb-4">
        <User user_id={comment.user_id} />
      </div>
      <p className="text-sm">{comment.comment}</p>
      <p className="text-xs text-neutral-500 mb-2">
        {date} {time}
      </p>
      {children}
    </div>
  );
}

/* The user who uploaded the comment */
function User({ user_id }: { user_id: string }) {
  const { data, isLoading, error } = useSWR(`/api/profile/${user_id}`, fetcher);

  if (error) return <div>Something went wrong</div>;
  if (isLoading)
    return (
      <div className="flex gap-2 items-center w-full">
        <Skeleton className="w-[56px] h-[56px] rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-[100px] h-4" />
        </div>
      </div>
    );

  const profile = data[0] as Profile;

  return (
    <div className="flex gap-2">
      <Avatar>
        <AvatarFallback>
          {avatarFallbackString(profile.first_name!, profile.last_name!)}
        </AvatarFallback>
        <AvatarImage className="object-cover" src={profile.avatar} />
      </Avatar>
      <div className="text-sm">
        <p className="font-medium">
          {profile.first_name} {profile.last_name}
        </p>
        <p className="text-neutral-500">{profile.email}</p>
      </div>
    </div>
  );
}

function EditCommentDialog({
  comment,
  open,
  setOpen,
}: {
  comment: Comment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [commentContent, setCommentContent] = useState<Comment | null>(comment);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(
      (prev) => ({ ...prev, comment: event.target.value }) as Comment | null
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your comment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            className="resize-none mb-2"
            value={commentContent ? commentContent.comment : ""}
            placeholder="Type your comment here"
            onChange={handleChange}
          />
        </div>
        <DialogFooter className="mr-auto">
          <DialogClose asChild>
            <Button variant={"secondary"} size={"sm"}>
              Close
            </Button>
          </DialogClose>
          <Button size={"sm"}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCommentDialog({
  open,
  setOpen,
  comment,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comment: Comment;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await axios.delete(`/api/comments/${comment.id}`);

      if (result.status === 200) {
        mutate(`/api/image/${comment.image_id}/comments`);
        setOpen(false);
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-1 lg:gap-0">
          <DialogClose asChild>
            <Button variant={"secondary"} size={"sm"}>
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            onClick={handleDelete}
            size={"sm"}
            variant={"destructive"}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
