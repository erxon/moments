"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import People from "./components/people";

export default function Search() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query");

  return (
    <>
      <div className="flex flex-col gap-4 items-center md:block">
        <h3 className="text-xl mb-4">
          Search for <span className="italic">{`"${query}"`}</span>
        </h3>
        <div>
          <Tabs defaultValue="people">
            <TabsList>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="gallery">Galleries</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="labels">Labels</TabsTrigger>
            </TabsList>
            <TabsContent value="people">
              <People query={query} />
            </TabsContent>
            <TabsContent value="gallery"></TabsContent>
            <TabsContent value="tags"></TabsContent>
            <TabsContent value="labels"></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function Gallery({ query }: { query: string }) {
  //useSWR to fetch galleries
  //display profiles
  return <></>;
}

function Tags({ query }: { query: string }) {
  //useSWR to fetch Tags
  //display properties
  return <></>;
}

function Labels({ query }: { query: string }) {
  //useSWR to fetch Labels
  //display properties
  return <></>;
}
