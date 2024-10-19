"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import React from "react";
import { TECH_LIST, SKILL_ICONS_URL, TechSchema } from "@/constants";
import { TechCategory } from "@/enums";
import SkillIconsGenerator, {
  SkillIconsGeneratorProps,
} from "@/components/SkillIconsGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDebouncedCallback } from "use-debounce";

export const generateIconUrl = (techs: TechSchema[]) => {
  if (techs.length === 0) return;
  const trimmedSkills = techs.map((tech) => tech.id).join(",");
  const url = `${SKILL_ICONS_URL}/icons?i=${trimmedSkills}&perline=10`;
  return url;
};

export default function TechStackGenerateContainer() {
  const [filteredTechs, setFilteredTechs] = useState<TechSchema[]>(TECH_LIST);

  const handleSearchTech = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const keyword = value.toLowerCase();
      setFilteredTechs(
        TECH_LIST.filter((tech) => tech.name.toLowerCase().includes(keyword))
      );
    },
    300
  );

  const skillIconsGeneratorPropsList: SkillIconsGeneratorProps[] = [
    {
      title: "Languages",
      techs: filteredTechs,
      categories: [TechCategory.Language],
    },
    {
      title: "Frameworks | Libraries",
      techs: filteredTechs,
      categories: [TechCategory.Framework, TechCategory.Library],
    },
    {
      title: "Platforms",
      techs: filteredTechs,
      categories: [TechCategory.Platform],
    },
    {
      title: "Cloud",
      techs: filteredTechs,
      categories: [TechCategory.Cloud],
    },
    {
      title: "Database | CI/CD | BuildTool",
      techs: filteredTechs,
      categories: [
        TechCategory.Database,
        TechCategory.CICD,
        TechCategory.BuildTool,
      ],
    },
    {
      title: "Other",
      techs: filteredTechs,
      categories: [TechCategory.Other],
    },
    {
      title: "All",
      techs: filteredTechs,
      categories: Object.values(TechCategory),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <Input id="techs" placeholder="Search" onChange={handleSearchTech} />
      </div>
      <div className="space-y-4">
        <Tabs defaultValue={skillIconsGeneratorPropsList[0].title}>
          <ScrollArea className="whitespace-nowrap pb-3 rounded-md">
            <TabsList>
              {skillIconsGeneratorPropsList.map(({ title }) => (
                <TabsTrigger
                  key={title}
                  value={title}
                  className="whitespace-nowrap"
                >
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {skillIconsGeneratorPropsList.map((skillIconsGeneratorProps) => {
            const { title } = skillIconsGeneratorProps;
            return (
              <TabsContent key={title} value={title}>
                <div className="p-4 border rounded-lg">
                  <SkillIconsGenerator
                    key={title}
                    {...skillIconsGeneratorProps}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
