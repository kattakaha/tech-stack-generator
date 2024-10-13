"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import { SKILL_ICONS_URL, TechSchema } from "@/constants";
import { TechCategory } from "@/enums";

export const generateIconUrl = (techs: TechSchema[]) => {
  if (techs.length === 0) return;
  const trimmedSkills = techs.map((tech) => tech.id).join(",");
  const url = `${SKILL_ICONS_URL}/icons?i=${trimmedSkills}&perline=10`;
  return url;
};

interface SkillIconsGeneratorProps {
  title: string;
  techs: TechSchema[];
  categories: TechCategory[];
}

export default function SkillIconsGenerator({
  title,
  techs,
  categories,
}: SkillIconsGeneratorProps) {
  const [iconUrl, setIconUrl] = useState<string>("");
  const [selectedTechs, setSelectedTechs] = useState<TechSchema[]>([]);

  const filteredSelectedTechs = selectedTechs.filter((tech) =>
    categories.includes(tech.category)
  );
  const previewIconUrl = generateIconUrl(filteredSelectedTechs);

  const copyToClipboard = () => {
    const markdown = `[![My Skills](${iconUrl})](${SKILL_ICONS_URL})`;
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        toast({
          title: "クリップボードにコピーしました",
          description: "マークダウンがクリップボードにコピーされました。",
        });
      })
      .catch(() => {
        toast({
          title: "コピーに失敗しました",
          description: "もう一度お試しいただくか、手動でコピーしてください。",
          variant: "destructive",
        });
      });
  };

  const handleTechToggle = (tech: TechSchema) => {
    setSelectedTechs((prev) =>
      prev.some((prev_tech) => prev_tech === tech)
        ? prev.filter((prev_tech) => prev_tech !== tech)
        : [...prev, tech]
    );
  };

  const handleGenerate = () => {
    const url = generateIconUrl(selectedTechs);
    if (!url) return;
    setIconUrl(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-sm">Preview</div>
        <div className="min-h-20 p-3 flex items-center justify-center border rounded-lg bg-muted">
          {previewIconUrl && (
            <Image
              src={previewIconUrl}
              width={100}
              height={100}
              alt="技術スタックアイコン"
              className="m-auto w-auto h-auto"
            />
          )}
        </div>
        <div className="flex flex-row flex-wrap justify-center">
          {techs
            .filter((tech) => categories.includes(tech.category))
            .map((tech) => (
              <Toggle
                key={tech.id}
                onClick={() => handleTechToggle(tech)}
                className="m-1"
              >
                {tech.name}
              </Toggle>
            ))}
        </div>
      </div>
      <Button
        onClick={handleGenerate}
        className="w-full"
        disabled={!selectedTechs.length}
      >
        Generate Icon
      </Button>
      {iconUrl && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted">
            <Image
              src={iconUrl}
              width={100}
              height={100}
              alt="技術スタックアイコン"
              className="mx-auto w-auto h-auto"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={`[![${title}](${iconUrl})](${SKILL_ICONS_URL})`}
              readOnly
            />
            <Button size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
