import JSZip from 'jszip';
import { VirtualFile, FileLanguage } from '../types/project';

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  module?: 'frontend' | 'backend' | 'database' | 'shared' | 'config' | 'root';
  language?: FileLanguage;
  children?: FileTreeNode[];
}

export class VirtualFileSystem {
  private files: Map<string, VirtualFile> = new Map();

  constructor(initialFiles: Record<string, VirtualFile> = {}) {
    Object.values(initialFiles).forEach(file => {
      this.files.set(file.path, { ...file });
    });
  }

  public getFiles(): Record<string, VirtualFile> {
    const result: Record<string, VirtualFile> = {};
    this.files.forEach((file, path) => {
      result[path] = { ...file };
    });
    return result;
  }

  public getFile(path: string): VirtualFile | undefined {
    return this.files.get(path);
  }

  public writeFile(path: string, content: string, generatedBy: 'frontend' | 'backend' | 'architect' | 'database' | 'reviewer' | 'user' = 'user'): VirtualFile {
    const existing = this.files.get(path);
    const language = this.detectLanguage(path);
    const module = this.detectModule(path);
    const name = path.split('/').pop() || path;

    const file: VirtualFile = {
      id: existing ? existing.id : `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      path,
      name,
      content,
      originalContent: existing ? existing.originalContent || existing.content : content,
      language,
      module,
      isModified: existing ? existing.content !== content : false,
      generatedBy: generatedBy,
      lastModified: Date.now()
    };

    this.files.set(path, file);
    return file;
  }

  public deleteFile(path: string): boolean {
    return this.files.delete(path);
  }

  public detectLanguage(path: string): FileLanguage {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'sql': return 'sql';
      case 'prisma': return 'prisma';
      case 'md': return 'markdown';
      case 'yaml':
      case 'yml': return 'yaml';
      case 'env': return 'env';
      default: return 'typescript';
    }
  }

  public detectModule(path: string): 'frontend' | 'backend' | 'database' | 'shared' | 'config' | 'root' {
    if (path.startsWith('frontend/')) return 'frontend';
    if (path.startsWith('backend/')) return 'backend';
    if (path.startsWith('database/') || path.includes('prisma') || path.includes('schema.sql')) return 'database';
    if (path.startsWith('shared/') || path.startsWith('contracts/')) return 'shared';
    if (path.endsWith('.json') || path.endsWith('.config.js') || path.endsWith('.config.ts')) return 'config';
    return 'root';
  }

  public buildTree(): FileTreeNode[] {
    const root: FileTreeNode[] = [];

    this.files.forEach((file) => {
      const parts = file.path.split('/');
      let currentLevel = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1;

        let existing = currentLevel.find(node => node.name === part);

        if (!existing) {
          existing = {
            id: isFile ? file.id : `folder_${currentPath}`,
            name: part,
            path: currentPath,
            isFolder: !isFile,
            module: isFile ? file.module : (part as any),
            language: isFile ? file.language : undefined,
            children: isFile ? undefined : []
          };
          currentLevel.push(existing);
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children;
        }
      });
    });

    // Sort folders first, then files alphabetically
    const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
      nodes.sort((a, b) => {
        if (a.isFolder === b.isFolder) {
          return a.name.localeCompare(b.name);
        }
        return a.isFolder ? -1 : 1;
      });
      nodes.forEach(node => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
      return nodes;
    };

    return sortNodes(root);
  }

  public async exportZip(projectName: string): Promise<Blob> {
    const zip = new JSZip();

    this.files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    return await zip.generateAsync({ type: 'blob' });
  }
}
