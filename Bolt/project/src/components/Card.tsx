import React, { useState, useRef, useEffect } from 'react'; // Import useRef, useEffect
import { Edit2, Trash2, Clock, AlertCircle, Tag, RotateCw } from 'lucide-react'; // Import RotateCw
import { CardData } from '../types';

interface CardProps {
  card: CardData;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'from-emerald-400 via-green-400 to-[#43A047]',
  medium: 'from-[#43A047] via-[#2E7D32] to-[#1B5E20]',
  high: 'from-[#2E7D32] via-[#1B5E20] to-[#004D40]'
};

const priorityTextColors = {
  low: 'text-white',
  medium: 'text-white',
  high: 'text-white'
};

const priorityIcons = {
  low: <AlertCircle size={16} className="text-white" />,
  medium: <AlertCircle size={16} className="text-white" />,
  high: <AlertCircle size={16} className="text-white" />
};

const Card: React.FC<CardProps> = ({ card, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | string>('auto'); // State for dynamic height
  const frontRef = useRef<HTMLDivElement>(null); // Ref for front content
  const backRef = useRef<HTMLDivElement>(null); // Ref for back content

  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Effect to calculate and set container height
  useEffect(() => {
    const frontHeight = frontRef.current?.scrollHeight || 0;
    const backHeight = backRef.current?.scrollHeight || 0;
    // Remove the fixed +16 padding buffer
    const maxHeight = Math.max(frontHeight, backHeight); 
    setContainerHeight(maxHeight);
  }, [card.description, card.details]); // Recalculate if content changes

  return (
    // Add perspective for 3D effect and move hover effect here
    // Add shiny green drop shadow filter
    <div className="group animate-fadeIn [perspective:1000px] transition-transform duration-300 hover:-translate-y-2 [filter:drop-shadow(0_6px_4px_rgba(50,205,50,0.5))_drop-shadow(0_10px_10px_rgba(60,179,113,0.3))] hover:[filter:drop-shadow(0_8px_6px_rgba(50,205,50,0.6))_drop-shadow(0_12px_12px_rgba(60,179,113,0.4))]">
      {/* Container for the transform and preserving 3D - Apply dynamic height */}
      <div
        className={`relative transform transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ height: `${containerHeight}px` }} // Apply calculated height
      >
        {/* Front Face - Re-add absolute */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl overflow-hidden transition-shadow duration-300">
          {/* Priority gradient banner */}
          <div className={`h-2 bg-gradient-to-r ${priorityColors[card.priority]}`} />
          
          {/* Inner content div for measuring */}
          <div ref={frontRef} className="p-6"> 
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                  bg-clip-text text-transparent mb-2">{card.topic}</h3>
                <div className={`
                  inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm
                  bg-gradient-to-r ${priorityColors[card.priority]}
                  shadow-lg ${priorityTextColors[card.priority]}
                  transform hover:scale-105 transition-transform duration-200
                `}>
                  {priorityIcons[card.priority]}
                  <span className="font-medium capitalize">{card.priority} Priority</span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Flip Button */}
                <button
                  onClick={handleFlip}
                  title="Show Details"
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50
                    hover:from-blue-100 hover:to-indigo-100
                    transition-all duration-200 text-blue-500
                    transform hover:scale-110"
                >
                  <RotateCw size={16} />
                </button>
                {/* Edit Button */}
                <button
                  onClick={() => onEdit(card)}
                  title="Edit Card"
                  className="p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50
                    hover:from-emerald-100 hover:to-green-100
                    transition-all duration-200 text-[#43A047]
                    transform hover:scale-110"
                >
                  <Edit2 size={16} />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => onDelete(card.id)}
                  title="Delete Card"
                  className="p-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50
                    hover:from-red-100 hover:to-rose-100
                    transition-all duration-200 text-red-500
                    transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-gray-100
                transform hover:scale-[1.02] transition-transform duration-200"
              >
                {/* Removed line-clamp-3 */}
                <p className="text-gray-700 text-sm leading-relaxed"> 
                  {card.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm
                      bg-gradient-to-r from-[#43A047] to-[#2E7D32] text-white
                      shadow-sm transform hover:scale-110 transition-transform duration-200
                      animate-float"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center text-sm text-gray-600
              bg-gradient-to-r from-gray-50 to-white
              rounded-xl px-4 py-2 border border-gray-100
              transform hover:scale-[1.02] transition-transform duration-200"
            >
              <Clock size={14} className="mr-2 text-[#43A047]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Back Face - Already absolute */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden transition-shadow duration-300 text-white">
          {/* Inner content div for measuring */}
          <div ref={backRef} className="p-6 h-full flex flex-col"> 
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Details</h3>
              {/* Flip Back Button */}
              <button
                onClick={handleFlip}
                title="Show Front"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white transform hover:scale-110"
              >
                <RotateCw size={16} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
              <p className="text-gray-200 whitespace-pre-wrap">
                {card.details || 'No additional details provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
