import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp, Youtube } from 'lucide-react';

// Curated free YouTube educational videos per subject (GED-focused)
const subjectVideos = {
  math: [
    { title: "GED Math: Order of Operations (PEMDAS)", videoId: "dAgfnK528RA", duration: "8 min" },
    { title: "Fractions & Percentages Made Easy", videoId: "4mX0uPy-4bY", duration: "10 min" },
    { title: "GED Math Word Problems", videoId: "E3lZWn1Z2eQ", duration: "12 min" },
  ],
  english: [
    { title: "GED Reading Comprehension Tips", videoId: "WPcBMBFhB5I", duration: "9 min" },
    { title: "Grammar: Subject-Verb Agreement", videoId: "RvbHqy29WaA", duration: "7 min" },
    { title: "Writing Clear Sentences for the GED", videoId: "4K7OA_R4qeE", duration: "11 min" },
  ],
  science: [
    { title: "GED Science: Photosynthesis Explained", videoId: "wENhHnJI1ys", duration: "6 min" },
    { title: "Newton's Laws of Motion - Simple Explanation", videoId: "cn3dqWZhxmI", duration: "9 min" },
    { title: "The Scientific Method for GED", videoId: "Yi0hyVeZl5Q", duration: "8 min" },
  ],
  social_studies: [
    { title: "The U.S. Constitution Explained", videoId: "AUgNHT03b_o", duration: "10 min" },
    { title: "The Civil Rights Movement Overview", videoId: "URxwe6LPvkM", duration: "12 min" },
    { title: "How a Bill Becomes a Law", videoId: "OgVKvqTItto", duration: "7 min" },
  ],
  health: [
    { title: "Nutrition Basics for Better Health", videoId: "fqhYBTg73fw", duration: "8 min" },
    { title: "Mental Health: Understanding Depression", videoId: "z-IR48Mb3W0", duration: "10 min" },
    { title: "Exercise and Your Body - GED Health", videoId: "2MYEuH-qjKk", duration: "6 min" },
  ],
};

export default function VideoLesson({ subject }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videos = subjectVideos[subject] || subjectVideos.math;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Youtube className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Watch Video Lessons</p>
            <p className="text-sm text-gray-500">{videos.length} videos to help you understand</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {selectedVideo ? (
            <div className="space-y-3">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => setSelectedVideo(null)}
              >
                ← Back to video list
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {videos.map((video, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVideo(video)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{video.title}</p>
                    <p className="text-xs text-gray-500">{video.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}