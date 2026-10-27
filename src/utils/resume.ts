import aboutData from '../data/about.json';

export interface ResumeInfo {
  fileName: string;
  filePath: string;
  lastUpdated?: string;
  fileSize?: string;
}

/**
 * Get resume information from about data
 */
export const getResumeInfo = (): ResumeInfo | null => {
  return aboutData.resume || null;
};

/**
 * Download resume file
 */
export const downloadResume = (): void => {
  const resumeInfo = getResumeInfo();
  
  if (!resumeInfo || !resumeInfo.filePath) {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:nhnishantharkut@gmail.com?subject=Resume%20Request%20-%20Nishant%20Harkut';
    }
    return;
  }

  const isExternal = resumeInfo.filePath.startsWith('http://') || resumeInfo.filePath.startsWith('https://');
  if (isExternal) {
    window.open(resumeInfo.filePath, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // Create a link to download the resume
  const link = document.createElement('a');
  link.href = resumeInfo.filePath;
  link.download = resumeInfo.fileName;
  link.style.display = 'none';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if resume file exists (client-side check)
 */
export const checkResumeExists = async (): Promise<boolean> => {
  const resumeInfo = getResumeInfo();
  
  if (!resumeInfo) {
    return false;
  }
  
  try {
    const response = await fetch(resumeInfo.filePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking resume file:', error);
    return false;
  }
};
