"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ImageType from "@/lib/types/image.types";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr.util";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, ImageTags } from "@/lib/types/tags.types";
import { TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import clsx from "clsx";
import axios, { AxiosError } from "axios";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";

export default function AddTag({
  open,
  setAddTagDialogOpen,
  image,
}: {
  open: boolean;
  setAddTagDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image: ImageType;
}) {
  const [inputTag, setInputTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isCharLengthError, setIsCharLengthError] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length > 30) {
      setIsCharLengthError(true);
      return;
    }

    setInputTag(value);
    setIsCharLengthError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setAddTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
            <DialogDescription>
              Add a tag to this image. Tags are used to group images together.
            </DialogDescription>
          </DialogHeader>
          <CurrentTags image_id={image.id} selectedTags={selectedTags} />
          <Input
            onChange={handleChange}
            value={inputTag}
            className="w-full"
            placeholder="Please type a tag here"
          />
          <p
            className={clsx("text-xs text-neutral-500 ml-auto", {
              "text-red-500": isCharLengthError,
            })}
          >{`${inputTag.length}/30`}</p>
          {inputTag && (
            <Suggestions
              setInputTag={setInputTag}
              inputTag={inputTag}
              setTags={setSelectedTags}
              image_id={image.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Suggestions({
  setTags,
  setInputTag,
  inputTag,
  image_id,
}: {
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setInputTag: React.Dispatch<React.SetStateAction<string>>;
  inputTag: string;
  image_id: string;
}) {
  const { data, error, isLoading } = useSWR(
    `/api/image/tags?search=${inputTag}`,
    fetcher
  );

  if (error) return <div>Failed to load tags</div>;
  if (isLoading) return <Skeleton className="w-full h-6" />;
  const handleSelectExistingTag = async (tag: Tag) => {
    //Add the tag to the image_tags server
    try {
      const result = await axios.post(`/api/image/${image_id}/tags`, {
        tag_id: tag.id,
      });
      if (result.status === 200) {
        mutate(`/api/image/${image_id}/tags`);
        setInputTag("");
        triggerSuccessToast("Tag created successfully");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
  };

  const handleSelectNewTag = async (inputTag: string) => {
    try {
      const result = await axios.post(`/api/image/${image_id}/tags`, {
        name: inputTag,
      });

      if (result.status === 200) {
        mutate(`/api/image/${image_id}/tags`);
        setInputTag("");
        triggerSuccessToast("Tag created successfully");
      }

      if (result.status === 400) {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        triggerErrorToast(error.message);
      }
    }
  };

  const allTags = data as Tag[];

  return (
    <>
      {allTags.length > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-neutral-500">Suggestions</p>
          {allTags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => handleSelectExistingTag(tag)}
              className="text-sm text-neutral-700 bg-neutral-300 w-fit px-2 py-1 rounded-full cursor-pointer transition hover:bg-neutral-200"
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
      {allTags.filter((tag) => tag.name === inputTag).length > 0 ? (
        <div></div>
      ) : (
        <div className="flex items-center gap-1 mt-2 mb-4">
          <div className="flex items-center gap-2 bg-neutral-100 w-full rounded-md">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleSelectNewTag(inputTag)}
            >
              Create new
            </Button>
            <p className="text-sm h-full rounded-full px-2 py-1 w-fit bg-blue-100">
              {inputTag}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function CurrentTags({
  image_id,
  selectedTags,
}: {
  image_id: string;
  selectedTags: Tag[];
}) {
  const { data, error, isLoading } = useSWR(
    `/api/image/${image_id}/tags`,
    fetcher
  );

  if (error) return <div>Failed to load tags</div>;
  if (isLoading) return <Skeleton className="w-full h-6" />;

  if (data.length === 0 && selectedTags.length === 0)
    return (
      <p className="text-sm text-neutral-500">
        <TagIcon className="inline mr-1" size={16} /> No tags yet
      </p>
    );

  const tags = data as ImageTags[];

  const handleRemove = async (tag_id: string) => {
    try {
      const result = await axios.delete(
        `/api/image/${image_id}/tags?tag_id=${tag_id}`
      );

      if (result.status === 200) {
        triggerSuccessToast(result.data);
      }

      if (result.status === 400) {
        triggerErrorToast(result.data);
      }

      mutate(`/api/image/${image_id}/tags`);
    } catch (error) {
      if (error instanceof AxiosError) {
        triggerErrorToast(error.response?.data);
      }
    }
  };

  return (
    <>
      <p className="text-sm text-neutral-500">Click a tag to remove</p>
      {tags.length > 0 && (
        <div className="flex items-center gap-1 mb-4">
          {" "}
          {tags.map((tag) => (
            <span
              key={tag.tag_id.id}
              onClick={() => handleRemove(tag.tag_id.id)}
              className="text-sm text-neutral-500 bg-neutral-100 w-fit px-2 py-1 rounded-full cursor-pointer transition hover:bg-red-400 hover:text-white"
            >
              {tag.tag_id.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
