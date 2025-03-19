
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface VideoInputProps {
  onVideoSubmit: (videoUrl: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit }) => {
  const [videoUrl, setVideoUrl] = useState('');

  // Debug props
  useEffect(() => {
    console.log("VideoInput props:", { onVideoSubmit: !!onVideoSubmit });
  }, [onVideoSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("VideoInput form submitted:", videoUrl);
    
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    
    // Call the callback explicitly
    try {
      console.log("Calling onVideoSubmit with:", videoUrl);
      onVideoSubmit(videoUrl);
      toast.success("Video URL submitted successfully");
    } catch (error) {
      console.error("Error submitting video URL:", error);
      toast.error("Failed to submit video URL");
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Video submit button clicked with:", videoUrl);
    
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    
    // Call the callback explicitly
    try {
      console.log("Calling onVideoSubmit with:", videoUrl);
      onVideoSubmit(videoUrl);
      toast.success("Video URL submitted successfully");
    } catch (error) {
      console.error("Error submitting video URL:", error);
      toast.error("Failed to submit video URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto">
      <div className="flex flex-col space-y-2">
        <Input
          type="text"
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full"
        />
      </div>
      <Button 
        type="button" 
        className="w-full bg-primary hover:bg-primary-600"
        disabled={!videoUrl}
        onClick={handleButtonClick}
      >
        Load Video
      </Button>
    </form>
  );
};

export default VideoInput;
