// Format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format rating
  export const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };
  
  // Get year from date
  export const getYear = (dateString: string): string => {
    return new Date(dateString).getFullYear().toString();
  };
  
  // Truncate text
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Get YouTube video URL
  export const getYouTubeUrl = (key: string): string => {
    return `https://www.youtube.com/watch?v=${key}`;
  };