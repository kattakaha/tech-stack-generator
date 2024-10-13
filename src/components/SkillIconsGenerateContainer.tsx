"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import React from "react";
import { TECH_LIST, SKILL_ICONS_URL, TechSchema } from "@/constants";
import { TechCategory } from "@/enums";
import SkillIconsGenerator from "@/components/SkillIconsGenerator";

export const generateIconUrl = (techs: TechSchema[]) => {
  if (techs.length === 0) return;
  const trimmedSkills = techs.map((tech) => tech.id).join(",");
  const url = `${SKILL_ICONS_URL}/icons?i=${trimmedSkills}&perline=10`;
  return url;
};

export default function SkillIconsGenerateContainer() {
  const searchWordRef = useRef<HTMLInputElement | null>(null);
  const [filteredTechs, setFilteredTechs] = useState<TechSchema[]>(TECH_LIST);

  const handleSearchTech = () => {
    if (!searchWordRef.current) return;
    const keyword = searchWordRef.current.value.toLowerCase();
    setFilteredTechs(
      TECH_LIST.filter((tech) => tech.name.toLowerCase().includes(keyword))
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        GitHub README Skill Icon Generator
      </h1>
      <div className="space-y-4">
        <Input
          id="techs"
          placeholder="Search"
          ref={searchWordRef}
          onChange={handleSearchTech}
        />
      </div>
      <div className="space-y-4">
        <SkillIconsGenerator
          title={"Languages"}
          techs={filteredTechs}
          categories={[TechCategory.Language]}
        />
        <SkillIconsGenerator
          title={"Frameworks | Libraries"}
          techs={filteredTechs}
          categories={[TechCategory.Framework, TechCategory.Library]}
        />
        <SkillIconsGenerator
          title={"Platforms"}
          techs={filteredTechs}
          categories={[TechCategory.Platform]}
        />
        <SkillIconsGenerator
          title={"Cloud"}
          techs={filteredTechs}
          categories={[TechCategory.Cloud]}
        />
        <SkillIconsGenerator
          title={"Database | CI/CD | BuildTool "}
          techs={filteredTechs}
          categories={[
            TechCategory.Database,
            TechCategory.CICD,
            TechCategory.BuildTool,
          ]}
        />
        <SkillIconsGenerator
          title={"Other"}
          techs={filteredTechs}
          categories={[TechCategory.Other]}
        />
      </div>
    </div>
  );
}
