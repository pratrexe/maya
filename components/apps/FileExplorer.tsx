import React, { useState } from 'react';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Music,
  Folder,
  Search,
  HardDrive,
  Plus,
  Trash2,
  Wallpaper,
} from 'lucide-react';
import { FileItem, SystemMetrics, ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface FileExplorerProps {
  theme: ThemeConfig;
  metrics: SystemMetrics;
  initialFolder?: string;
  files: FileItem[];
  onAddFile: (file: FileItem) => void;
  onDeleteFile: (fileId: string) => void;
  onSetWallpaper: (imageUrl: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  theme,
  metrics,
  initialFolder = 'Downloads',
  files,
  onAddFile,
  onDeleteFile,
  onSetWallpaper,
}) => {
  const [currentFolder, setCurrentFolder] = useState(initialFolder);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const folders = [
    { name: 'Downloads', icon: Download },
    { name: 'Documents', icon: FileText },
    { name: 'Pictures', icon: ImageIcon },
    { name: 'Music', icon: Music },
  ];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (currentFolder === 'Downloads') return matchesSearch;
    if (currentFolder === 'Documents') return matchesSearch && f.type === 'document';
    if (currentFolder === 'Pictures') return matchesSearch && f.type === 'image';
    if (currentFolder === 'Music') return matchesSearch && f.type === 'audio';
    return matchesSearch;
  });

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    playUiClick();
    const created: FileItem = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith('.txt') ? newFileName : `${newFileName}.txt`,
      type: 'document',
      size: `${Math.round(newFileContent.length / 1024 + 1)} KB`,
      date: 'Just now',
      path: `/documents/${newFileName}`,
      content: newFileContent,
    };
    onAddFile(created);
    setNewFileName('');
    setNewFileContent('');
    setIsCreatingFile(false);
  };

  const storagePercent = Math.round((metrics.cDriveUsedGB / metrics.cDriveTotalGB) * 100);

  return (
    <div className="flex h-full flex-col md:flex-row text-sm">
      {/* Left Sidebar */}
      <div
        className="w-full md:w-56 p-4 border-r border-black/5 flex flex-col justify-between"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
            Locations
          </div>
          {folders.map((fld) => {
            const Icon = fld.icon;
            const isSelected = currentFolder === fld.name;
            return (
              <button
                key={fld.name}
                onClick={() => {
                  playUiClick();
                  setCurrentFolder(fld.name);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-xs text-black'
                    : 'hover:bg-black/5 opacity-80'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{fld.name}</span>
              </button>
            );
          })}
        </div>

        {/* Disk Info */}
        <div className="pt-4 border-t border-black/5">
          <div className="flex items-center gap-2 mb-1.5 font-bold text-xs opacity-70">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local Disk (C:)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden mb-1">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="text-[11px] opacity-70">
            {metrics.cDriveUsedGB} GB of {metrics.cDriveTotalGB} GB used
          </div>
        </div>
      </div>

      {/* Main Files Area */}
      <div className="flex-1 p-5 flex flex-col overflow-hidden">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/5 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 opacity-60" />
            <input
              type="text"
              placeholder={`Search in ${currentFolder}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none w-full"
            />
          </div>

          <button
            onClick={() => {
              playUiClick();
              setIsCreatingFile(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c85252] text-white text-xs font-bold hover:bg-[#b04242] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Document</span>
          </button>
        </div>

        {/* New File Modal / Popover */}
        {isCreatingFile && (
          <div className="p-4 mb-4 rounded-3xl bg-white border border-black/10 shadow-md space-y-3 animate-in fade-in duration-150">
            <div className="font-bold text-xs">Create New Document</div>
            <input
              type="text"
              placeholder="Filename (e.g. MyIdeas.txt)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
            />
            <textarea
              placeholder="Document content..."
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              className="w-full h-20 p-2.5 rounded-xl border border-gray-200 text-xs outline-none resize-none font-sans"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreatingFile(false)}
                className="px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Save File
              </button>
            </div>
          </div>
        )}

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
              <Folder className="w-10 h-10 stroke-1" />
              <span className="text-xs">No files in this folder</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile?.id === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      playUiClick();
                      setSelectedFile(file);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                        : 'bg-white/80 hover:bg-white border-black/5 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center text-gray-700">
                        {file.type === 'image' && <ImageIcon className="w-5 h-5 text-rose-500" />}
                        {file.type === 'audio' && <Music className="w-5 h-5 text-emerald-500" />}
                        {file.type === 'document' && <FileText className="w-5 h-5 text-blue-500" />}
                        {file.type === 'folder' && <Folder className="w-5 h-5 text-amber-500" />}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playUiClick();
                          onDeleteFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="font-bold text-xs truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-[10px] opacity-60 flex justify-between mt-1">
                        <span>{file.size}</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected File Details / Preview Drawer */}
        {selectedFile && (
          <div className="mt-4 p-4 rounded-3xl bg-white border border-black/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-3">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.path}
                  alt={selectedFile.name}
                  className="w-14 h-14 rounded-xl object-cover shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {selectedFile.type.toUpperCase().slice(0, 3)}
                </div>
              )}
              <div>
                <div className="font-bold text-xs">{selectedFile.name}</div>
                <div className="text-[11px] text-gray-500">
                  {selectedFile.size} • {selectedFile.date}
                </div>
                {selectedFile.content && (
                  <div className="text-xs text-gray-700 italic mt-1 line-clamp-2">
                    "{selectedFile.content}"
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedFile.type === 'image' && (
                <button
                  onClick={() => {
                    playUiClick();
                    onSetWallpaper(selectedFile.path);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <Wallpaper className="w-3.5 h-3.5" />
                  <span>Set as Wallpaper</span>
                </button>
              )}

              <button
                onClick={() => setSelectedFile(null)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
