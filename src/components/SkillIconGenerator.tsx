"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function SkillIconGenerator() {
  const [skills, setSkills] = useState<string>("");
  const [iconUrl, setIconUrl] = useState<string>("");

  const generateIconUrl = () => {
    const trimmedSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .join(",");
    const url = `https://skillicons.dev/icons?i=${encodeURIComponent(
      trimmedSkills
    )}`;
    setIconUrl(url);
  };

  const copyToClipboard = () => {
    const markdown = `[![My Skills](${iconUrl})](https://skillicons.dev)`;
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        GitHub README スキルアイコンジェネレーター
      </h1>
      <div className="space-y-4">
        <Label htmlFor="skills">スキルを入力してください（カンマ区切り）</Label>
        <Input
          id="skills"
          placeholder="js,html,css,react,nodejs"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <Button onClick={generateIconUrl} className="w-full">
          アイコンを生成
        </Button>
      </div>
      {iconUrl && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted">
            <img src={iconUrl} alt="スキルアイコン" className="mx-auto" />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={`[![My Skills](${iconUrl})](https://skillicons.dev)`}
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
