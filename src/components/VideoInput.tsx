
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface VideoInputProps {
  onVideoSubmit: (videoUrl: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSubmit }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("VideoInput submit:", videoUrl);
    
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    
    // Appeler directement la fonction de soumission
    onVideoSubmit(videoUrl);
    
    toast.success("Video URL submitted successfully");
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
        type="submit" 
        className="w-full bg-primary hover:bg-primary-600"
        disabled={!videoUrl}
      >
        Load Video
      </Button>
    </form>
  );
};

export default VideoInput;
