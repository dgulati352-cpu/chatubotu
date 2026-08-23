import { VirtualFile, FileLanguage } from '../types/project';

export class LocalFileService {
  private static detectLanguage(path: string): FileLanguage {
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

  private static detectModule(path: string): 'frontend' | 'backend' | 'database' | 'shared' | 'config' | 'root' {
    if (path.startsWith('src/components/') || path.startsWith('frontend/')) return 'frontend';
    if (path.startsWith('src/services/') || path.startsWith('backend/')) return 'backend';
    if (path.startsWith('database/') || path.includes('prisma') || path.includes('schema.sql')) return 'database';
    if (path.startsWith('src/types/') || path.startsWith('shared/') || path.startsWith('contracts/')) return 'shared';
    if (path.startsWith('src/config/') || path.endsWith('.json') || path.endsWith('.config.js') || path.endsWith('.config.ts')) return 'config';
    return 'root';
  }

  /**
   * Open Local Folder using modern File System Access API
   */
  public static async openDirectoryPicker(): Promise<{ folderName: string; files: Record<string, VirtualFile> } | null> {
    if (typeof (window as any).showDirectoryPicker === 'function') {
      try {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite'
        });

        const folderName = dirHandle.name || 'Workspace';
        const files: Record<string, VirtualFile> = {};

        const readDir = async (handle: any, currentPath = '') => {
          for await (const entry of handle.values()) {
            const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

            // Skip heavy internal dirs for fast performance
            if (entry.name === '.git') continue;

            if (entry.kind === 'directory') {
              await readDir(entry, entryPath);
            } else if (entry.kind === 'file') {
              try {
                const file = await entry.getFile();
                // Only read text-based files up to 2MB to prevent browser lockup
                if (file.size < 2 * 1024 * 1024) {
                  const content = await file.text();
                  const language = this.detectLanguage(entry.name);
                  const module = this.detectModule(entryPath);

                  files[entryPath] = {
                    id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    path: entryPath,
                    name: entry.name,
                    content,
                    originalContent: content,
                    language,
                    module,
                    isModified: false,
                    generatedBy: 'user',
                    lastModified: file.lastModified || Date.now()
                  };
                }
              } catch (err) {
                console.warn(`Could not read file ${entryPath}`, err);
              }
            }
          }
        };

        await readDir(dirHandle);
        return { folderName, files };
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error opening directory picker:', err);
        }
        return null;
      }
    }

    // Fallback: Trigger standard directory input
    return this.triggerDirectoryInputFallback();
  }

  /**
   * Fallback using standard input[webkitdirectory]
   */
  public static triggerDirectoryInputFallback(): Promise<{ folderName: string; files: Record<string, VirtualFile> } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      (input as any).webkitdirectory = true;
      input.multiple = true;

      input.onchange = async (e: any) => {
        const fileList: FileList = e.target.files;
        if (!fileList || fileList.length === 0) {
          resolve(null);
          return;
        }

        const files: Record<string, VirtualFile> = {};
        let folderName = 'Workspace';

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const relativePath = file.webkitRelativePath || file.name;
          const parts = relativePath.split('/');
          if (parts.length > 1) {
            folderName = parts[0];
          }

          // Relative path inside folder
          const cleanPath = parts.length > 1 ? parts.slice(1).join('/') : file.name;

          if (cleanPath.startsWith('.git/')) continue;

          try {
            if (file.size < 2 * 1024 * 1024) {
              const content = await file.text();
              const language = this.detectLanguage(file.name);
              const module = this.detectModule(cleanPath);

              files[cleanPath] = {
                id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                path: cleanPath,
                name: file.name,
                content,
                originalContent: content,
                language,
                module,
                isModified: false,
                generatedBy: 'user',
                lastModified: file.lastModified || Date.now()
              };
            }
          } catch (err) {
            console.warn(`Could not read file ${cleanPath}`, err);
          }
        }

        resolve({ folderName, files });
      };

      input.click();
    });
  }

  /**
   * Open Local File Picker for single or multiple files
   */
  public static async openFilesPicker(): Promise<VirtualFile[] | null> {
    if (typeof (window as any).showOpenFilePicker === 'function') {
      try {
        const fileHandles = await (window as any).showOpenFilePicker({
          multiple: true
        });

        const results: VirtualFile[] = [];

        for (const handle of fileHandles) {
          const file = await handle.getFile();
          const content = await file.text();
          const language = this.detectLanguage(file.name);
          const module = this.detectModule(file.name);

          results.push({
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            path: file.name,
            name: file.name,
            content,
            originalContent: content,
            language,
            module,
            isModified: false,
            generatedBy: 'user',
            lastModified: file.lastModified || Date.now()
          });
        }

        return results;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error opening file picker:', err);
        }
        return null;
      }
    }

    // Fallback: standard input[type=file]
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;

      input.onchange = async (e: any) => {
        const fileList: FileList = e.target.files;
        if (!fileList || fileList.length === 0) {
          resolve(null);
          return;
        }

        const results: VirtualFile[] = [];
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          try {
            const content = await file.text();
            const language = this.detectLanguage(file.name);
            const module = this.detectModule(file.name);

            results.push({
              id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              path: file.name,
              name: file.name,
              content,
              originalContent: content,
              language,
              module,
              isModified: false,
              generatedBy: 'user',
              lastModified: file.lastModified || Date.now()
            });
          } catch (err) {
            console.warn(`Could not read file ${file.name}`, err);
          }
        }

        resolve(results);
      };

      input.click();
    });
  }
}
