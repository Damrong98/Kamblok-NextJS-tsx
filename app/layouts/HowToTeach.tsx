"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatTemplate } from "../layouts/ChatTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// Define lesson plan prompt templates
const promptTemplate = {
  standard: `របៀបបង្រៀនអំពី {prompt}" ដោយប្រើវិធីសាស្ត្របង្រៀនស្តង់ដារ`,
  standard2: `របៀបបង្រៀនអំពី {prompt}" ដែលរួមបញ្ចូល (១. បង្រៀនតាមស្តង់ដារ, ២. បង្រៀនដោយប្រៀបធៀបជាមួយជីវិតពិត)`,
};

export function HowToTeach() {
  const [inputValue, setInputValue] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(false);
  const [isFirstGenerated, setIsFirstGenerated] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("standard");
  const [fullPrompt, setFullPrompt] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleGenerate = () => {
    if (inputValue.trim()) {
      const generatedPrompt = promptTemplate[selectedTemplate as keyof typeof promptTemplate].replace("{prompt}", inputValue);
      setTopic(inputValue);
      setFullPrompt(generatedPrompt);
      setIsFirstGenerated(true);
      setIsInputCollapsed(true);
    }
  };

  const toggleInputCollapse = () => {
    setIsInputCollapsed(!isInputCollapsed);
  };

  const cardTitle = {
    standard: "របៀបបង្រៀនទៅទៅ",
    standard2: "របៀបបង្រៀនបែបប្រៀបធៀប",
  }[selectedTemplate];

  const renderHeader = () => (
    <Card className="w-full mt-4">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{cardTitle}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleInputCollapse}
          disabled={!isFirstGenerated}
        >
          {isInputCollapsed ? "បង្ហាញ" : "លាក់"}
        </Button>
      </CardHeader>

      <AnimatePresence>
        {!isInputCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="grid gap-4">
              <p>សូមបញ្ចូលចំណងជើង ឬប្រធានបទ៖</p>
              <Input
                placeholder="បញ្ចូលចំណងជើង ឬប្រធានបទ"
                value={inputValue}
                onChange={handleInputChange}
              />
              <p>សូមជ្រើសរើសប្រភេទណាមួយដែលអ្នកចង់បាន៖</p>
              <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">របៀបបង្រៀនទៅទៅ</SelectItem>
                  <SelectItem value="standard2">របៀបបង្រៀនបែបប្រៀបធៀប</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="btn-primary bg-green-500 round"
                onClick={handleGenerate}
                disabled={!inputValue.trim()}
              >
                បង្កើត
              </Button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );

  return (
    <ChatTemplate
      formHeader={renderHeader()}
      prompt={fullPrompt}
      showformFooter={isInputCollapsed}
    />
  );
}