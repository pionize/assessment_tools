import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  File, 
  Folder, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  FileText,
  Code
} from 'lucide-react';

function CodeEditor({ 
  files = {}, 
  onFilesChange, 
  selectedLanguage = 'javascript',
  onLanguageChange 
}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState('');
  const [fileStructure, setFileStructure] = useState({});
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileParent, setNewFileParent] = useState('');
  const editorRef = useRef(null);

  // Language options
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' }
  ];

  // Build file structure from flat files object
  useEffect(() => {
    const structure = {};
    Object.keys(files).forEach(filePath => {
      const parts = filePath.split('/');
      let current = structure;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { type: 'folder', children: {} };
        }
        current = current[part].children;
      }
      
      const fileName = parts[parts.length - 1];
      current[fileName] = {
        type: 'file',
        content: files[filePath].content || '',
        language: files[filePath].language || selectedLanguage
      };
    });
    
    setFileStructure(structure);
    
    // Auto-select first file if none selected
    if (!selectedFile && Object.keys(files).length > 0) {
      setSelectedFile(Object.keys(files)[0]);
    }
  }, [files, selectedLanguage]);

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    if (selectedFile && onFilesChange) {
      const updatedFiles = {
        ...files,
        [selectedFile]: {
          ...files[selectedFile],
          content: value || ''
        }
      };
      onFilesChange(updatedFiles);
    }
  };

  const addFile = () => {
    if (!newFileName.trim()) return;
    
    const fullPath = newFileParent ? `${newFileParent}/${newFileName}` : newFileName;
    
    if (files[fullPath]) {
      alert('File already exists!');
      return;
    }

    const updatedFiles = {
      ...files,
      [fullPath]: {
        content: getDefaultContent(newFileName),
        language: getLanguageFromExtension(newFileName)
      }
    };
    
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
    
    setSelectedFile(fullPath);
    setNewFileName('');
    setNewFileParent('');
    setShowAddFile(false);
  };

  const deleteFile = (filePath) => {
    if (confirm(`Are you sure you want to delete ${filePath}?`)) {
      const updatedFiles = { ...files };
      delete updatedFiles[filePath];
      
      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }
      
      if (selectedFile === filePath) {
        const remainingFiles = Object.keys(updatedFiles);
        setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : '');
      }
    }
  };

  const getDefaultContent = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return '// Add your JavaScript code here\n\n';
      case 'ts':
      case 'tsx':
        return '// Add your TypeScript code here\n\n';
      case 'py':
        return '# Add your Python code here\n\n';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        // Add your Java code here\n    }\n}\n';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    // Add your C++ code here\n    return 0;\n}\n';
      case 'html':
        return '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <!-- Add your HTML here -->\n</body>\n</html>\n';
      case 'css':
        return '/* Add your CSS styles here */\n\n';
      default:
        return '';
    }
  };

  const getLanguageFromExtension = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const extensionMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'html': 'html',
      'css': 'css'
    };
    return extensionMap[ext] || selectedLanguage;
  };

  const renderFileTree = (structure, basePath = '') => {
    return Object.keys(structure).map(name => {
      const item = structure[name];
      const fullPath = basePath ? `${basePath}/${name}` : name;
      
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.has(fullPath);
        return (
          <div key={fullPath}>
            <div 
              className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-gray-700">{name}</span>
            </div>
            {isExpanded && (
              <div className="ml-4">
                {renderFileTree(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={fullPath}
            className={`flex items-center justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-sm group ${
              selectedFile === fullPath ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedFile(fullPath)}
          >
            <div className="flex items-center">
              <File className="w-4 h-4 mr-2 text-gray-500" />
              <span className={`text-gray-700 ${selectedFile === fullPath ? 'font-medium' : ''}`}>
                {name}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(fullPath);
              }}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-white">
      {/* File Explorer */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-3 border-b bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Files</span>
            <button
              onClick={() => setShowAddFile(true)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Add file"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {Object.keys(fileStructure).length > 0 ? (
            renderFileTree(fileStructure)
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No files yet</p>
              <p>Click + to add a file</p>
            </div>
          )}
        </div>

        {/* Add File Modal */}
        {showAddFile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-80">
              <h3 className="text-lg font-medium mb-3">Add New File</h3>
              <input
                type="text"
                placeholder="filename.js"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddFile(false)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={addFile}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="bg-white border-b px-4 py-2 flex items-center">
              <Code className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{selectedFile}</span>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={files[selectedFile]?.language || selectedLanguage}
                value={files[selectedFile]?.content || ''}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Select a file to start coding</p>
              <p className="text-sm">Choose a file from the explorer or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;
