"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Copy,
  Moon,
  Sun,
  CheckSquare,
  SquareMinus,
  Square,
} from "lucide-react";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { SKILL_ICONS_URL, TechSchema } from "@/constants";
import { TechCategory, TechId } from "@/enums";
import { Switch } from "@/components/ui/switch";

import { Combobox } from "@/components/utils/Combobox";
import { TooltipIconButton } from "@/components/utils/TooltipIconButton";
import TechIcons from "@/components/TechIcons";
import { DndList } from "@/components/utils/DndList";

export type IconTheme = "light" | "dark";
export type PerLine = "5" | "6" | "7" | "8" | "9" | "10";

export const generateIconUrl = (
  techs: TechSchema[],
  theme: IconTheme,
  perLine: PerLine
) => {
  if (techs.length === 0) return;
  const trimmedSkills = techs.map((tech) => tech.id).join(",");
  const url = `${SKILL_ICONS_URL}/icons?i=${trimmedSkills}&theme=${theme}&perline=${perLine}`;
  return url;
};

export interface SkillIconsGeneratorProps {
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
  const [theme, setTheme] = useState<IconTheme>("dark");
  const [perLine, setPerLine] = useState<PerLine>("10");
  const [inputUrl, setInputUrl] = useState<string>("");

  const filteredTechs = techs.filter((tech) =>
    categories.includes(tech.category)
  );

  const getSelectAllIcon = useMemo(() => {
    switch (selectedTechs.length) {
      case 0:
        return Square;
      case filteredTechs.length:
        return CheckSquare;
      default:
        return SquareMinus;
    }
  }, [selectedTechs.length, filteredTechs.length]);

  const previewIconUrl = generateIconUrl(selectedTechs, theme, perLine);

  const markdown = `
    ### ${title}
    [![${title}](${iconUrl})](${SKILL_ICONS_URL})
    `;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        toast({
          title: "Copied to clipboard.",
          description: "The markdown has been copied to the clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed.",
          description: "Please try again or copy manually.",
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

  const handleSelectAll = () => {
    console.log(selectedTechs === filteredTechs);
    setSelectedTechs((prev) =>
      prev.length === filteredTechs.length ? [] : filteredTechs
    );
  };

  const handleGenerate = () => {
    const url = generateIconUrl(selectedTechs, theme, perLine);
    if (!url) return;
    setIconUrl(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const updateSelectedTechsFromUrl = () => {
    try {
      const url = new URL(inputUrl);
      const params = new URLSearchParams(url.search);
      const skillIds: TechId[] =
        (params
          .get("i")
          ?.split(",")
          .filter((id) =>
            techs.some(
              (tech) => tech.id === id && categories.includes(tech.category)
            )
          ) as TechId[]) || [];

      if (!skillIds.length) throw new Error();
      const newSelectedTechs = techs.filter((tech) =>
        skillIds.includes(tech.id)
      );
      setSelectedTechs(newSelectedTechs);

      toast({
        title: "Selected skills updated",
        description: "Skills were successfully updated from the URL.",
      });
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="text-3xl font-bold">{title}</div>
        <div className="space-y-2 flex flex-col items-end justify-end">
          <Input
            placeholder={`If you want to update an already existing ${title} icons, please enter the URL`}
            value={inputUrl}
            onChange={handleUrlChange}
          />
          <Button onClick={updateSelectedTechsFromUrl}>Apply</Button>
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2">
            <div className="text-sm">Preview</div>
            <Switch
              id="theme-switch"
              checked={theme === "dark"}
              uncheckedIcon={<Sun />}
              checkedIcon={<Moon />}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="relative"
            />
            <Combobox
              items={[
                { value: "5", label: "5" },
                { value: "6", label: "6" },
                { value: "7", label: "7" },
                { value: "8", label: "8" },
                { value: "9", label: "9" },
                { value: "10", label: "10" },
              ]}
              placeholder="per line"
              defaultValue="10"
              disableSearch
              onSelect={(value) => {
                setPerLine(value as PerLine);
              }}
              width="120px"
              height="25px"
            />
          </div>
          <div>
            <TooltipIconButton
              onClick={handleSelectAll}
              icon={getSelectAllIcon}
              tooltipText="Select All"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div>
            <div className="min-h-20 p-3 flex items-center justify-center border rounded-lg bg-muted">
              {previewIconUrl && <TechIcons src={previewIconUrl} />}
            </div>
            <div className="flex flex-row flex-wrap justify-center">
              {filteredTechs.map((tech) => (
                <Toggle
                  key={tech.id}
                  onClick={() => handleTechToggle(tech)}
                  className="m-1"
                  pressed={selectedTechs.includes(tech)}
                >
                  {tech.name}
                </Toggle>
              ))}
            </div>
            <Button
              onClick={handleGenerate}
              className="w-full mt-6"
              disabled={!selectedTechs.length}
            >
              Generate Icon
            </Button>
            {iconUrl && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted">
                  <TechIcons src={iconUrl} />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={markdown}
                    readOnly
                    className="whitespace-pre-wrap"
                  />
                  <Button size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            <DndList
              items={selectedTechs}
              setItems={setSelectedTechs}
              getItemId={(tech) => tech.id}
              renderItem={(tech) => tech.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
