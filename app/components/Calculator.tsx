"use client";

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const {toast} = useToast();

  const handleButtonClick = (value: string) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const calculatedResult = eval(expression);
      setResult(String(calculatedResult));
    } catch (error) {
      setResult('Error');
      toast({
        title: 'Error',
        description: 'Invalid expression',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input
          type="text"
          placeholder="Enter expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
        />
        <Input type="text" placeholder="Result" value={result} readOnly />
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={() => handleButtonClick('7')}>7</Button>
          <Button onClick={() => handleButtonClick('8')}>8</Button>
          <Button onClick={() => handleButtonClick('9')}>9</Button>
          <Button onClick={() => handleButtonClick('+')}>+</Button>
          <Button onClick={() => handleButtonClick('4')}>4</Button>
          <Button onClick={() => handleButtonClick('5')}>5</Button>
          <Button onClick={() => handleButtonClick('6')}>6</Button>
          <Button onClick={() => handleButtonClick('-')}>-</Button>
          <Button onClick={() => handleButtonClick('1')}>1</Button>
          <Button onClick={() => handleButtonClick('2')}>2</Button>
          <Button onClick={() => handleButtonClick('3')}>3</Button>
          <Button onClick={() => handleButtonClick('*')}>*</Button>
          <Button onClick={() => handleButtonClick('0')}>0</Button>
          <Button onClick={() => handleButtonClick('.')}>.</Button>
          <Button onClick={handleCalculate}>=</Button>
          <Button onClick={() => handleButtonClick('/')}>/</Button>
          <Button onClick={() => handleButtonClick('Math.sqrt(')}>
            √
          </Button>
          <Button onClick={() => handleButtonClick('Math.pow(')}>^</Button>
          <Button onClick={() => handleButtonClick('Math.sin(')}>sin</Button>
          <Button onClick={() => handleButtonClick('Math.cos(')}>cos</Button>
          <Button onClick={() => handleButtonClick('Math.tan(')}>tan</Button>
          <Button onClick={() => handleButtonClick('Math.log(')}>log</Button>
          <Button variant="destructive" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
