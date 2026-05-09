"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Star, Flag } from "lucide-react";

interface ReviewCardProps {
  id: string;
  course: string;
  date: string;
  rating: number;
  comment: string;
  upvotes: number;
  teachingQuality?: number;
  difficulty?: number;
  examDifficulty?: number;
}

export default function ReviewCard({ 
  id, 
  course, 
  date, 
  rating, 
  comment, 
  upvotes: initialUpvotes,
  teachingQuality = 5,
  difficulty = 3,
  examDifficulty = 4
}: ReviewCardProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [currentUpvotes, setCurrentUpvotes] = useState(initialUpvotes);

  const handleVote = (type: "up" | "down") => {
    if (vote === type) {
      // Oyu geri çek
      setVote(null);
      setCurrentUpvotes(prev => type === "up" ? prev - 1 : prev + 1);
    } else {
      // Yeni oy veya oy değiştirme
      let diff = 0;
      if (type === "up") {
        diff = vote === "down" ? 2 : 1;
      } else {
        diff = vote === "up" ? -2 : -1;
      }
      setCurrentUpvotes(prev => prev + diff);
      setVote(type);
    }
  };

  return (
    <div className="group bg-[#FCFBF7] rounded-2xl py-4 px-6 md:py-5 md:px-8 border border-kk-blue/5 shadow-[0_10px_30px_-15px_rgba(6,40,58,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(6,40,58,0.1)] transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-kk-blue-light font-bold text-sm mb-1">{course}</div>
          <div className="text-kk-text-muted text-[11px] font-medium uppercase tracking-wider">{date}</div>
        </div>
        <div className="flex items-center gap-1 bg-kk-gold/10 text-kk-gold px-3 py-1 rounded-full font-bold text-sm">
          <Star size={14} fill="currentColor" />
          {rating}
        </div>
      </div>
      
      <p className="text-kk-text leading-relaxed font-medium mb-6 text-[15px]">
        "{comment}"
      </p>

      {/* Detaylı Puanlar (Badge Tarzı) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Anlatım", val: teachingQuality },
          { label: "Ders Zorluğu", val: difficulty },
          { label: "Sınav Zorluğu", val: examDifficulty }
        ].map((stat) => (
          <div key={stat.label} className="bg-kk-beige/50 border border-kk-blue/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[11px] font-bold text-kk-text-muted uppercase tracking-tight">{stat.label}</span>
            <span className="text-xs font-black text-kk-blue">{stat.val}/5</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-kk-blue/5">
        {/* Reddit Tarzı Oylama Sistemi - Orta Boyut ve Sayfa Arka Planı Renginde */}
        <div className="flex items-center bg-kk-beige rounded-xl px-1 py-1 border border-kk-blue/10 shadow-sm">
          <button 
            onClick={() => handleVote("up")}
            className={`p-1.5 rounded-lg transition-all ${
              vote === "up" ? "text-kk-blue-light bg-white" : "text-kk-text-muted hover:text-kk-blue-light hover:bg-white/50"
            }`}
          >
            <ChevronUp size={20} strokeWidth={3} />
          </button>
          
          <span className={`px-2 text-sm font-black min-w-[2rem] text-center ${
            vote === "up" ? "text-kk-blue-light" : vote === "down" ? "text-red-600" : "text-kk-blue"
          }`}>
            {currentUpvotes}
          </span>

          <button 
            onClick={() => handleVote("down")}
            className={`p-1.5 rounded-lg transition-all ${
              vote === "down" ? "text-red-600 bg-white" : "text-kk-text-muted hover:text-red-600 hover:bg-white/50"
            }`}
          >
            <ChevronDown size={20} strokeWidth={3} />
          </button>
        </div>

        <button className="text-kk-text-muted hover:text-kk-blue flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">
          <Flag size={14} />
          <span>Şikayet Et</span>
        </button>
      </div>
    </div>
  );
}
