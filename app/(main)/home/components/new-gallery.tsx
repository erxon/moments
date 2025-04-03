"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobeIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import triggerSuccessToast from "@/components/toast/trigger-success-toast";
import triggerErrorToast from "@/components/toast/trigger-error-toast";
import { useSWRConfig } from "swr";
import visibilityDescription from "./visibility-description";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  visibility: z.string(),
});

export default function CreateGallery() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-1" strokeWidth={3} />
            Add
          </Button>
        </DialogTrigger>
        <DialogForm setOpenForm={setOpen} />
      </Dialog>
    </>
  );
}

function DialogForm({
  setOpenForm,
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutate } = useSWRConfig();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "public",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmission = async (values: z.infer<typeof formSchema>) => {
    const { title, description, visibility } = values;

    setIsLoading(true);
    try {
      const result = await axios.post("/api/gallery", {
        title: title,
        description: description,
        visibility: visibility,
      });

      if (result.status === 200) {
        triggerSuccessToast(result.data);
        mutate("/api/gallery");
        form.reset();
        setOpenForm(false);
      } else {
        triggerErrorToast(result.data);
      }
    } catch (error) {
      if (error instanceof Error) triggerErrorToast(error.message);
    }
    setIsLoading(false);
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New gallery</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmission)}>
          <div className="flex flex-col gap-2 mb-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Describe your gallery"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="visibility"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose who may see your gallery" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex gap-1 items-center">
                          <GlobeIcon className="w-4 h-4" /> <p>Public</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex gap-1 items-center">
                          <Lock className="w-4 h-4" />
                          <p>Only me</p>
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
                  <FormDescription>
                    {visibilityDescription(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {!isLoading ? "Save" : "Saving..."}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
