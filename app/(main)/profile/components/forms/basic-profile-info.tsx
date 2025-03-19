"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Profile from "@/lib/types/profile.types";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import SocialForm from "./social-form";
import Socials from "@/lib/types/socials.types";
import UpdateAvatarForm from "./update-avatar";
import { useState } from "react";

/**
 * Todo
 * - update profile info
 * - Image input
 * - About
 * - Social media links
 */

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name is required",
  }),
  middle_name: z.string({
    invalid_type_error: "Middle name must be a string",
  }),
  last_name: z.string().min(1, {
    message: "Last name is required",
  }),
  about: z.string().min(1, {
    message: "Please tell us more about yourself",
  }),
});

export default function BasicProfileInfo({
  profile,
  socials,
}: {
  profile: Profile;
  socials: Socials;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name ? profile?.first_name : "",
      middle_name: profile?.middle_name ? profile?.middle_name : "",
      last_name: profile?.last_name ? profile?.last_name : "",
      about: profile?.about ? profile?.about : "",
    },
  });

  const handleSubmission = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const data = {
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      about: values.about,
    };

    try {
      const result = await axios.post("/api/profile", data);

      if (result.status === 200) {
        toast.success(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      } else {
        toast.error(result.data, {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <UpdateAvatarForm avatar={profile?.avatar} />
      <div className="my-5 bg-neutral-50 p-3 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmission)}>
            <div className="md:grid md:grid-cols-3 gap-4 mb-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Middle Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full md:w-[500px] mb-3 resize-none"
                        placeholder="Please tell us about your self"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              size="sm"
              type="submit"
              variant="default"
              className="mt-3 w-full md:w-auto"
              disabled={isLoading}
            >
              {!isLoading ? "Save" : "Saving..."}
            </Button>
          </form>
        </Form>
      </div>
      <SocialForm socials={socials} />
      <Toaster richColors />
    </>
  );
}
