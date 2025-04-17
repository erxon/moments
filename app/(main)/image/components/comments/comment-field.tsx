"use client";

import triggerErrorToast from "@/components/toast/trigger-error-toast";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { avatarFallbackString } from "@/lib/string.util";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { mutate } from "swr";

interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
}

export default function CommentField({
  user,
  image_id,
}: {
  user: User;
  image_id: string;
}) {
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await axios.post(`/api/image/${image_id}/comments`, {
        comment: comment,
      });

      if (result.status === 200) {
        setComment("");
        mutate(`/api/image/${image_id}/comments`);
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
    <div className="flex gap-2">
      <Avatar>
        <AvatarFallback>
          {avatarFallbackString(user.first_name, user.last_name)}
        </AvatarFallback>
        <AvatarImage src={user.avatar} className="object-cover" />
      </Avatar>
      <div className="flex flex-col w-full gap-2 md:items-start">
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="resize-none"
          placeholder="Type your comment here"
        />
        <Button onClick={handleSubmit} disabled={isLoading} size={"sm"}>
          {!isLoading ? "Post" : "Posting..."}
        </Button>
      </div>
    </div>
  );
}
