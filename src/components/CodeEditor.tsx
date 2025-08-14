import Editor from "@monaco-editor/react";
import { ChevronDown, ChevronRight, Code, File, FileText, Folder, Trash2 } from "lucide-react";
import type * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

interface FileTreeNode {
	type: "file" | "folder";
	children?: Record<string, FileTreeNode>;
	content?: string;
	language?: string;
}

interface CodeEditorProps {
	files?: Record<string, { content: string; language: string }>;
	onFilesChange?: (files: Record<string, { content: string; language: string }>) => void;
	selectedLanguage?: string;
	onLanguageChange?: (language: string) => void;
}

function CodeEditor({
	files = {},
	onFilesChange,
	selectedLanguage = "javascript",
	onLanguageChange,
}: CodeEditorProps) {
	const [expandedFolders, setExpandedFolders] = useState(new Set());
	const [selectedFile, setSelectedFile] = useState("");
	const [fileStructure, setFileStructure] = useState<Record<string, FileTreeNode>>({});
	const [showAddFile, setShowAddFile] = useState(false);
	const [showAddFolder, setShowAddFolder] = useState(false);
	const [newFileName, setNewFileName] = useState("");
	const [newFolderName, setNewFolderName] = useState("");
	const [newFileParent, setNewFileParent] = useState("");
	const [newFolderParent, setNewFolderParent] = useState("");
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		folderPath: string;
	} | null>(null);
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	// Language options
	const languages = [
		{ value: "javascript", label: "JavaScript" },
		{ value: "typescript", label: "TypeScript" },
		{ value: "html", label: "HTML" },
		{ value: "java", label: "Java" },
		{ value: "go", label: "Go" },
		{ value: "php", label: "PHP" },
	];

	// Build file structure from flat files object
	useEffect(() => {
		const structure: Record<string, FileTreeNode> = {};
		Object.keys(files).forEach((filePath) => {
			const parts = filePath.split("/");
			let current = structure;

			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i];
				if (!current[part]) {
					current[part] = { type: "folder", children: {} };
				}
				current = current[part].children || {};
			}

			const fileName = parts[parts.length - 1];
			current[fileName] = {
				type: "file",
				content: files[filePath].content || "",
				language: files[filePath].language || selectedLanguage,
			};
		});

		setFileStructure(structure);

		// Auto-select first file if none selected
		if (!selectedFile && Object.keys(files).length > 0) {
			setSelectedFile(Object.keys(files)[0]);
		}
	}, [files, selectedLanguage, selectedFile]);

	const toggleFolder = (path: string) => {
		const newExpanded = new Set(expandedFolders);
		if (newExpanded.has(path)) {
			newExpanded.delete(path);
		} else {
			newExpanded.add(path);
		}
		setExpandedFolders(newExpanded);
	};

	const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
		editorRef.current = editor;
	};

	const handleEditorChange = (value: string | undefined) => {
		if (selectedFile && onFilesChange) {
			const updatedFiles = {
				...files,
				[selectedFile]: {
					...files[selectedFile],
					content: value || "",
				},
			};
			onFilesChange(updatedFiles);
		}
	};

	const addFile = () => {
		if (!newFileName.trim()) return;

		const fullPath = newFileParent ? `${newFileParent}/${newFileName}` : newFileName;

		if (files[fullPath]) {
			alert("File already exists!");
			return;
		}

		const updatedFiles = {
			...files,
			[fullPath]: {
				content: getDefaultContent(newFileName),
				language: getLanguageFromExtension(newFileName),
			},
		};

		if (onFilesChange) {
			onFilesChange(updatedFiles);
		}

		setSelectedFile(fullPath);
		setNewFileName("");
		setNewFileParent("");
		setShowAddFile(false);
	};

	const addFolder = () => {
		if (!newFolderName.trim()) return;

		const fullPath = newFolderParent ? `${newFolderParent}/${newFolderName}` : newFolderName;

		// Check if folder already exists
		const existingFolderFiles = Object.keys(files).filter((filePath) =>
			filePath.startsWith(`${fullPath}/`)
		);

		if (existingFolderFiles.length > 0) {
			alert("Folder already exists!");
			return;
		}

		// Create a placeholder file to represent the folder
		const placeholderFile = `${fullPath}/.gitkeep`;
		const updatedFiles = {
			...files,
			[placeholderFile]: {
				content: "# This file keeps the folder in the file tree\n",
				language: "markdown",
			},
		};

		if (onFilesChange) {
			onFilesChange(updatedFiles);
		}

		// Auto-expand the new folder
		setExpandedFolders((prev) => new Set([...prev, fullPath]));

		setNewFolderName("");
		setNewFolderParent("");
		setShowAddFolder(false);
		setContextMenu(null);
	};

	const deleteFile = (filePath: string) => {
		if (confirm(`Are you sure you want to delete ${filePath}?`)) {
			const updatedFiles = { ...files };
			delete updatedFiles[filePath];

			if (onFilesChange) {
				onFilesChange(updatedFiles);
			}

			if (selectedFile === filePath) {
				const remainingFiles = Object.keys(updatedFiles);
				setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : "");
			}
		}
	};

	const getDefaultContent = (fileName: string) => {
		const ext = fileName.split(".").pop()?.toLowerCase();
		switch (ext) {
			case "js":
			case "jsx":
				return "// Add your JavaScript code here\n\n";
			case "ts":
			case "tsx":
				return "// Add your TypeScript code here\n\n";
			case "py":
				return "# Add your Python code here\n\n";
			case "java":
				return "public class Main {\n    public static void main(String[] args) {\n        // Add your Java code here\n    }\n}\n";
			case "cpp":
				return "#include <iostream>\n\nint main() {\n    // Add your C++ code here\n    return 0;\n}\n";
			case "html":
				return "<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <!-- Add your HTML here -->\n</body>\n</html>\n";
			case "css":
				return "/* Add your CSS styles here */\n\n";
			default:
				return "";
		}
	};

	const getLanguageFromExtension = (fileName: string) => {
		const ext = fileName.split(".").pop()?.toLowerCase();
		const extensionMap = {
			js: "javascript",
			jsx: "javascript",
			ts: "typescript",
			tsx: "typescript",
			java: "java",
			go: "go",
			php: "php",
			html: "html",
		};
		return extensionMap[ext as keyof typeof extensionMap] || selectedLanguage;
	};

	const handleContextMenu = (e: React.MouseEvent, folderPath: string) => {
		e.preventDefault();
		e.stopPropagation();
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			folderPath,
		});
	};

	const handleAddFileToFolder = (folderPath: string) => {
		setNewFileParent(folderPath);
		setShowAddFile(true);
		setContextMenu(null);
	};

	const handleAddFolderToFolder = (folderPath: string) => {
		setNewFolderParent(folderPath);
		setShowAddFolder(true);
		setContextMenu(null);
	};

	const deleteFolder = (folderPath: string) => {
		if (
			confirm(`Are you sure you want to delete the folder "${folderPath}" and all its contents?`)
		) {
			const updatedFiles = { ...files };

			// Delete all files in the folder
			Object.keys(updatedFiles).forEach((filePath) => {
				if (filePath.startsWith(`${folderPath}/`)) {
					delete updatedFiles[filePath];
				}
			});

			if (onFilesChange) {
				onFilesChange(updatedFiles);
			}

			// If selected file was in deleted folder, clear selection
			if (selectedFile.startsWith(`${folderPath}/`)) {
				const remainingFiles = Object.keys(updatedFiles).filter((f) => !f.endsWith("/.gitkeep"));
				setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : "");
			}
		}
	};

	const renderFileTree = (structure: Record<string, FileTreeNode>, basePath = "") => {
		return Object.keys(structure)
			.filter((name) => name !== ".gitkeep") // Hide .gitkeep files
			.map((name) => {
				const item = structure[name];
				const fullPath = basePath ? `${basePath}/${name}` : name;

				if (item.type === "folder") {
					const isExpanded = expandedFolders.has(fullPath);
					return (
						<div key={fullPath}>
							<button
								type="button"
								className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-sm group border-none bg-transparent w-full text-left"
								onClick={() => toggleFolder(fullPath)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggleFolder(fullPath);
									}
								}}
								onContextMenu={(e) => handleContextMenu(e, fullPath)}
							>
								<div className="flex items-center">
									{isExpanded ? (
										<ChevronDown className="w-4 h-4 mr-1" />
									) : (
										<ChevronRight className="w-4 h-4 mr-1" />
									)}
									<Folder className="w-4 h-4 mr-2 text-blue-500" />
									<span className="text-gray-700">{name}</span>
								</div>
								<div className="opacity-0 group-hover:opacity-100 flex">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleAddFileToFolder(fullPath);
										}}
										className="p-1 hover:bg-gray-200 rounded mr-1"
										title="Add file"
									>
										<File className="w-3 h-3 text-gray-600" />
									</button>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleAddFolderToFolder(fullPath);
										}}
										className="p-1 hover:bg-gray-200 rounded mr-1"
										title="Add folder"
									>
										<Folder className="w-3 h-3 text-gray-600" />
									</button>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											deleteFolder(fullPath);
										}}
										className="p-1 hover:bg-gray-200 rounded"
										title="Delete folder"
									>
										<Trash2 className="w-3 h-3 text-red-600" />
									</button>
								</div>
							</button>
							{isExpanded && (
								<div className="ml-4">{renderFileTree(item.children || {}, fullPath)}</div>
							)}
						</div>
					);
				} else {
					return (
						<button
							key={fullPath}
							type="button"
							className={`flex items-center justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-sm group border-none bg-transparent w-full text-left ${
								selectedFile === fullPath ? "bg-blue-50 border-l-2 border-blue-500" : ""
							}`}
							onClick={() => setSelectedFile(fullPath)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setSelectedFile(fullPath);
								}
							}}
						>
							<div className="flex items-center">
								<File className="w-4 h-4 mr-2 text-gray-500" />
								<span className={`text-gray-700 ${selectedFile === fullPath ? "font-medium" : ""}`}>
									{name}
								</span>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									deleteFile(fullPath);
								}}
								className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
							>
								<Trash2 className="w-3 h-3" />
							</button>
						</button>
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
						<div className="flex space-x-1">
							<button
								type="button"
								onClick={() => setShowAddFile(true)}
								className="p-1 hover:bg-gray-200 rounded"
								title="Add file"
							>
								<File className="w-4 h-4 text-gray-600" />
							</button>
							<button
								type="button"
								onClick={() => setShowAddFolder(true)}
								className="p-1 hover:bg-gray-200 rounded"
								title="Add folder"
							>
								<Folder className="w-4 h-4 text-gray-600" />
							</button>
						</div>
					</div>

					{/* Language Selector */}
					<select
						value={selectedLanguage}
						onChange={(e) => onLanguageChange?.(e.target.value)}
						className="w-full text-xs border border-gray-300 rounded px-2 py-1"
					>
						{languages.map((lang) => (
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
							{newFileParent && (
								<div className="text-sm text-gray-600 mb-2">
									Creating in: <span className="font-medium">{newFileParent}/</span>
								</div>
							)}
							<input
								type="text"
								placeholder="filename.js"
								value={newFileName}
								onChange={(e) => setNewFileName(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
							/>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => {
										setShowAddFile(false);
										setNewFileParent("");
										setNewFileName("");
									}}
									className="px-3 py-1 text-gray-600 hover:text-gray-800"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={addFile}
									className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
								>
									Add File
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Add Folder Modal */}
				{showAddFolder && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white p-4 rounded-lg w-80">
							<h3 className="text-lg font-medium mb-3">Add New Folder</h3>
							{newFolderParent && (
								<div className="text-sm text-gray-600 mb-2">
									Creating in: <span className="font-medium">{newFolderParent}/</span>
								</div>
							)}
							<input
								type="text"
								placeholder="folder-name"
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
								className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
							/>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => {
										setShowAddFolder(false);
										setNewFolderParent("");
										setNewFolderName("");
									}}
									className="px-3 py-1 text-gray-600 hover:text-gray-800"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={addFolder}
									className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
								>
									Add Folder
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Context Menu */}
				{contextMenu && (
					<>
						<button
							type="button"
							className="fixed inset-0 z-40 bg-transparent border-none p-0 m-0"
							onClick={() => setContextMenu(null)}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									setContextMenu(null);
								}
							}}
							aria-label="Close context menu"
						/>
						<div
							className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
							style={{
								left: contextMenu.x,
								top: contextMenu.y,
								minWidth: "150px",
							}}
						>
							<button
								type="button"
								onClick={() => handleAddFileToFolder(contextMenu.folderPath)}
								className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
							>
								<File className="w-4 h-4 mr-2" />
								Add File
							</button>
							<button
								type="button"
								onClick={() => handleAddFolderToFolder(contextMenu.folderPath)}
								className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
							>
								<Folder className="w-4 h-4 mr-2" />
								Add Folder
							</button>
							<hr className="my-1" />
							<button
								type="button"
								onClick={() => {
									deleteFolder(contextMenu.folderPath);
									setContextMenu(null);
								}}
								className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600 hover:bg-red-50"
							>
								<Trash2 className="w-4 h-4 mr-2" />
								Delete Folder
							</button>
						</div>
					</>
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
								value={files[selectedFile]?.content || ""}
								onChange={handleEditorChange}
								onMount={handleEditorDidMount}
								theme="vs"
								options={{
									minimap: { enabled: false },
									fontSize: 14,
									lineNumbers: "on",
									automaticLayout: true,
									scrollBeyondLastLine: false,
									wordWrap: "on",
									tabSize: 2,
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
