 "use client"
import React from 'react'
import { useState } from 'react'
import  Editor  from '@monaco-editor/react'

const CodeEditor = ({language,onCodeChange}:{language:string,onCodeChange:(value:string)=>void;}) => {
  return (
    <Editor 
    height="400px"
      defaultLanguage={language}
      defaultValue="// Write your code here"
      theme="vs-dark"
      onChange={(value) => onCodeChange(value || "")}/>
  )
}

export default CodeEditor;
