"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios, { AxiosError } from "axios";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@radix-ui/themes";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";

interface Reaction {
  id?: string;
  user_id?: string;
  image_id?: string;
  gallery_id?: string;
  created_at?: string;
}

export default function Reaction({
  image_id,
  gallery_id,
}: {
  image_id: string;
  gallery_id: string;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [reaction, setReaction] = useState<Reaction | null>(null);

  const fetchReaction = useCallback(async () => {
    const result = await axios.get(`/api/image/${image_id}/reaction`);

    if (result.data !== null) {
      setIsLiked(true);
      setReaction(result.data);
    } else {
      setIsLiked(false);
    }
  }, [isLiked, image_id]);

  useEffect(() => {
    fetchReaction();
  }, [fetchReaction]);

  const handleReaction = async () => {
    try {
      if (isLiked) {
        const result = await axios.delete(
          `/api/image/${image_id}/reaction/${reaction?.id}`
        );

        if (result.status === 200) {
          mutate(`/api/image/${image_id}/reaction/reactions`);
          setIsLiked(false);
          console.log(result);
          return;
        }
        return;
      }

      const result = await axios.post(`/api/image/${image_id}/reaction`, {
        gallery_id: gallery_id,
      });

      if (result.status === 200) {
        mutate(`/api/image/${image_id}/reaction/reactions`);
        setIsLiked(true);
        triggerSuccessToast(result.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast("Something went wrong.");
      }
    }
  };

  return (
    <div
      className="cursor-pointer w-fit flex items-center gap-2 "
      onClick={handleReaction}
    >
      {isLiked ? <Heart fill="red" stroke="red" /> : <Heart />}
      <p>Like</p>
    </div>
  );
}
