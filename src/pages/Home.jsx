import React, { useState } from 'react';
import TestResult from '../components/TestResult';
import SendEmailForm from '../components/SendEmailForm';

export default function Home() {
  const [result, setResult] = useState({
      "totalSender": 0,
      "totalReceiver": 0,
      "totalReceiverFailed": 0,
      "totalSenderFailed": 0,
      "failedReasons": [],
      "totalTime": 0.0
  
  });
  console.log(result,"rsult");
  return (
    
    <div className="container">
      <div className="test-result">
        <TestResult  result={result}/>
      </div>
      <div className="send-email-form">
        <SendEmailForm setResult={setResult}/>
      </div>
    </div>
  );
}
