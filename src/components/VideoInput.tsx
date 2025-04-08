
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
    console.log("VideoInput mounted with props:", { onVideoSubmit: !!onVideoSubmit });
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

  // For testing - add a sample URL
  useEffect(() => {
    // Sample video URLs for testing
    const sampleUrls = [
      "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      "https://www.w3schools.com/html/mov_bbb.mp4",
      "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    ];
    
    // Set a random sample URL for easier testing
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    console.log("Setting sample video URL for testing:", randomUrl);
    setVideoUrl(randomUrl);
  }, []);

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
        <p className="text-xs text-gray-500 italic">
          Astuce: Une URL d'exemple a été ajoutée pour tester la fonctionnalité
        </p>
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
