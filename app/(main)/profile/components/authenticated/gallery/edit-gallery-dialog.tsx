"use state";

import VisibilitySelection from "@/app/(main)/home/components/visibility-selection";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type Gallery from "@/lib/types/gallery.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { GlobeIcon, Lock, UsersRound } from "lucide-react";
import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Please add some description to your gallery"),
  visibility: z.string(),
});

export default function EditGalleryDialog({
  open,
  setOpen,
  gallery,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gallery: Gallery;
}) {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit gallery</DialogTitle>
            <DialogDescription>{gallery.description}</DialogDescription>
          </DialogHeader>
          <EditForm gallery={gallery} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditForm({
  gallery,
  setOpen,
}: {
  gallery: Gallery;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery.title,
      description: gallery.description,
      visibility: gallery.visibility,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { title, description, visibility } = values;

      const result = await axios.put(`/api/gallery/${gallery.id}`, {
        title: title,
        description: description,
        visibility: visibility,
      });

      if (result.status === 200) {
        mutate(`/api/gallery`);
        setOpen(false);
        triggerSuccessToast(result.data);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error && error instanceof AxiosError) {
        triggerErrorToast(error.response!.data);
      }
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Input {...field} placeholder="Type your title here" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...field}
                placeholder="Type your description here"
                className="resize-none"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                {...field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex gap-1 items-center">
                      <GlobeIcon className="w-4 h-4" />
                      <p>Public</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex gap-1 items-center">
                      <Lock className="w-4 h-4" />
                      <p>Private</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="followers">
                    <div className="flex gap-1 items-center">
                      <UsersRound className="w-4 h-4" />
                      <p>Followers</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" size={"sm"}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
