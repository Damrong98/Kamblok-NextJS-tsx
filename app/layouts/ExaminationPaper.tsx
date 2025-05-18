"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatTemplate } from "./ChatTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// Define examination paper prompt templates
const promptTemplate = {
  standard: `សូមរៀបចំសំណួរប្រលងជាភាសាខ្មែរ សម្រាប់ប្រធានបទ "{prompt}" ដែលមានពិន្ទុសរុបស្មើនឹង "{score}"។ សូមបង្ហាញសំណួរនីមួយៗនៅក្នុងបន្ទាត់ថ្មី ហើយសម្រាប់ចម្លើយ សូមបង្ហាញក្នុងបញ្ជីជជែក (ក., ខ., គ., ឃ.) មួយក្នុងមួយបន្ទាត់។ សូមបង្ហាញចម្លើយនៅខាងក្រោម។`,
  standard1: `សូមរៀបចំសំណួរប្រលងបែបជ្រើសរើសចម្លើយជាភាសាខ្មែរ សម្រាប់ប្រធានបទ "{prompt}" ដោយមានប្រភេទសំណួរដូចជា សំណួរបាទ/ចាស ឬទេ (yes/no question), សំណួរច្រើនជម្រើស (multiple choice question) និងសំណួរឬលំហាត់តាមបែប Bloom ចំនួន 4-8 សំណួរ ដែលអាចមានឬគ្មានលំហាត់ និងមានពិន្ទុសរុបស្មើនឹង "{score}". សូមបង្ហាញចម្លើយនៅខាងក្រោម`,
  standard2: `សូមរៀបចំសំណួរប្រលងបែបផ្គូរផ្គងជាភាសាខ្មែរ សម្រាប់ប្រធានបទ "{prompt}" ដោយមានធាតុ 4-8 គូផ្គូរផ្គង ដែលតម្រូវឱ្យផ្គូរចម្លើយឱ្យត្រូវនឹងសំណួរ​នៅក្នុងតារាងតែមួយ(ធាតុ (A), ធាតុ (B), ចម្លើយ ) និងមានពិន្ទុសរុបស្មើនឹង "{score}". សូមបង្ហាញចម្លើយនៅខាងក្រោម`
};

export function ExaminationPaper() {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputScore, setInputScore] = useState<number>(60);
  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(false);
  const [isFirstGenerated, setIsFirstGenerated] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("standard");
  const [fullPrompt, setFullPrompt] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setInputScore(value);
    }
  };

  const handleGenerate = () => {
    if (inputValue.trim()) {
      const template = promptTemplate[selectedTemplate as keyof typeof promptTemplate];
      const generatedPrompt = template
        .replace("{prompt}", inputValue)
        .replace("{score}", inputScore.toString());
      // setTopic(inputValue);
      setFullPrompt(generatedPrompt);
      setIsFirstGenerated(true);
      setIsInputCollapsed(true);
    }
  };

  const toggleInputCollapse = () => {
    setIsInputCollapsed(!isInputCollapsed);
  };

  const cardTitle = {
    standard: "ក្រដាសប្រឡងស្តង់ដារ",
    standard1: "ក្រដាសប្រឡងបែបសំណួរចម្រុះ",
    standard2: "ក្រដាសប្រឡងបែបសំណួរផ្គូរផ្គង",
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
              <p>សូមបញ្ចូលចំណងជើង ឬប្រធានបទសម្រាប់ក្រដាសប្រឡង៖</p>
              <Input
                placeholder="បញ្ចូលចំណងជើង ឬប្រធានបទ"
                value={inputValue}
                onChange={handleInputChange}
              />
              <p>សូមបញ្ចូលចំនួនពិន្ទុសរុប៖</p>
              <Input
                placeholder="បញ្ចូលចំនួនពិន្ទុសរុប៖"
                value={inputScore}
                type="number"
                step={5}
                onChange={handleInputScore}
              />
              <p>សូមជ្រើសរើសប្រភេទក្រដាសប្រឡង៖</p>
              <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">ក្រដាសប្រឡងស្តង់ដារ</SelectItem>
                  <SelectItem value="standard1">ក្រដាសប្រឡងបែបសំណួរចម្រុះ</SelectItem>
                  <SelectItem value="standard2">ក្រដាសប្រឡងបែបសំណួរផ្គូរផ្គង</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="bg-pink-600 hover:bg-pink-400 rounded"
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