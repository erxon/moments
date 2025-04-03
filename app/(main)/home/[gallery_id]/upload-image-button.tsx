"use client";

import { Button } from "@/components/ui/button";
import { GlobeIcon, Image, Lock, UsersRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import visibilityDescription from "../components/visibility-description";
import VisibilitySelection from "../components/visibility-selection";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { get } from "http";
import axios from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { mutate } from "swr";

interface ImageData {
  title: string;
  description: string;
  label: string;
  image: File;
  visibility: string;
}

interface ValidationError {
  title: string;
  description: string;
  label: string;
  image: string;
  visibility: string;
}

export default function UploadImageButton({
  gallery_id,
}: {
  gallery_id: string;
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">
            <Image className="w-4 h-4 mr-1" /> Upload Image
          </Button>
        </DialogTrigger>
        <DialogForm gallery_id={gallery_id} />
      </Dialog>
    </>
  );
}

function FormLabel({
  children,
  htmlFor,
  error,
}: {
  children: React.ReactNode;
  htmlFor: string;
  error: boolean;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className={clsx("mb-1", { "text-red-500": error })}
    >
      {children}
    </Label>
  );
}

function FormMessage({ message, show }: { message: string; show: boolean }) {
  if (show) return <p className="text-sm text-red-500">{message}</p>;
}

function DialogForm({ gallery_id }: { gallery_id: string }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [validationError, setValidationError] = useState<ValidationError>({
    title: "",
    description: "",
    label: "",
    image: "",
    visibility: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const errors = {
    title: "Title is required",
    description: "Description is required",
    label: "Label is required",
    image: "Image is required",
    visibility: "Visibility is required",
    get: function get(key: string) {
      if (key === "title") {
        return this.title;
      } else if (key === "description") {
        return this.description;
      } else if (key === "label") {
        return this.label;
      } else if (key === "image") {
        return this.image;
      } else if (key === "visibility") {
        return this.visibility;
      }
    },
  };

  const [attemptSubmit, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (
      !formData.get("title") ||
      !formData.get("description") ||
      !formData.get("label") ||
      !formData.get("image")
    ) {
      const image = formData.get("image") as File;

      setValidationError({
        title: !formData.get("title") ? errors.title : "",
        description: !formData.get("description") ? errors.description : "",
        label: !formData.get("label") ? errors.label : "",
        image: !image.name ? errors.image : "",
        visibility: !formData.get("visibility") ? errors.visibility : "",
      });

      return;
    }

    setValidationError({
      title: "",
      description: "",
      label: "",
      image: "",
      visibility: "",
    });

    setSubmitting(false);

    formData.append("gallery_id", gallery_id);

    setIsLoading(true);

    try {
      const result = await axios.post("/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        mutate(`/api/gallery/${gallery_id}/images`);
        formRef.current?.reset();
        triggerSuccessToast(result.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        triggerErrorToast(error.message);
      }
    }

    setIsLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const error = value === "" ? errors.get(name)! : "";

    if (attemptSubmit) {
      setValidationError((prevState) => ({
        ...prevState,
        [name]: error,
      }));
    }
  };

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const error = value === "" ? errors.get(name)! : "";

    if (attemptSubmit) {
      setValidationError((prevState) => ({
        ...prevState,
        description: error,
      }));
    }
  };

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new image</DialogTitle>
          <DialogDescription>
            Upload new image to this gallery
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
          ref={formRef}
        >
          <div>
            <FormLabel htmlFor="title" error={!!validationError.title}>
              Title
            </FormLabel>
            <Input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="Title"
            />{" "}
            <FormMessage
              show={!!validationError.title}
              message={validationError.title}
            />
          </div>
          <div>
            <FormLabel htmlFor="title" error={!!validationError.description}>
              Description
            </FormLabel>
            <Textarea
              onChange={handleDescription}
              name="description"
              placeholder="Description"
            />
            <FormMessage
              show={!!validationError.description}
              message={validationError.description}
            />
          </div>
          <div>
            <FormLabel htmlFor="label" error={!!validationError.label}>
              Label
            </FormLabel>
            <Input
              onChange={handleChange}
              name="label"
              type="text"
              placeholder="Label"
            />
            <FormMessage
              show={!!validationError.label}
              message={validationError.label}
            />
          </div>
          <div>
            <FormLabel
              htmlFor="visibility"
              error={!!validationError.visibility}
            >
              Visibility
            </FormLabel>
            <VisibilitySelection name="visibility" />
            <FormMessage
              show={!!validationError.visibility}
              message={validationError.visibility}
            />
          </div>
          <div>
            <FormLabel htmlFor="image" error={!!validationError.image}>
              Image
            </FormLabel>
            <Input onChange={handleChange} name="image" type="file" />
            <FormMessage
              show={!!validationError.image}
              message={validationError.image}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {!isLoading ? "Add Image" : "Uploading..."}
          </Button>
        </form>
      </DialogContent>
    </>
  );
}
