"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import axios from "axios";
import Socials from "@/lib/types/socials.types";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
});

export default function SocialForm({ socials }: { socials: Socials }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook: socials?.facebook ? socials?.facebook : "",
      twitter: socials?.twitter ? socials?.twitter : "",
      instagram: socials?.instagram ? socials?.instagram : "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const data = {
      facebook: values.facebook,
      twitter: values.twitter,
      instagram: values.instagram,
    };
    const result = await axios.post("/api/profile/social", data);

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

    setIsLoading(false);
  };
  return (
    <>
      <div className="w-full mb-3 p-3 rounded-md">
        <p className="font-medium mb-3">Socials</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="md:grid md:grid-cols-3 gap-2 ">
              <FormField
                name="facebook"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="https://www.your-facebook.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="twitter"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.your-twitter.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="instagram"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.your-instagram.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <Button
              disabled={isLoading}
              size={"sm"}
              type="submit"
              className="mt-3 w-full md:w-auto"
            >
              {!isLoading ? "Save" : "Saving..."}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
