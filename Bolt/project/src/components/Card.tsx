import React, { useState, useRef, useEffect } from 'react'; 
import { Edit2, Trash2, Clock, AlertCircle, Tag, RotateCw } from 'lucide-react'; 
import { CardData } from '../types';

interface CardProps {
  card: CardData;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
}

// Use CSS variables for priority gradients
const priorityGradientVars = {
  low: 'from-[var(--priority-low-start)] to-[var(--priority-low-end)]',
  medium: 'from-[var(--priority-medium-start)] to-[var(--priority-medium-end)]',
  high: 'from-[var(--priority-high-start)] to-[var(--priority-high-end)]'
};

// Text colors might need theme-specific adjustments, keeping white for now
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
  const [containerHeight, setContainerHeight] = useState<number | string>('auto');
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleFlip = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    const frontHeight = frontRef.current?.scrollHeight || 0;
    const backHeight = backRef.current?.scrollHeight || 0;
    const maxHeight = Math.max(frontHeight, backHeight); 
    setContainerHeight(maxHeight);
  }, [card.description, card.details]); 

  return (
    // Use CSS variables for drop shadow filter
    <div className={`group animate-fadeIn [perspective:1000px] transition-transform duration-300 hover:-translate-y-2 
      [filter:drop-shadow(0_6px_4px_var(--card-shadow-color-1))_drop-shadow(0_10px_10px_var(--card-shadow-color-2))] 
      hover:[filter:drop-shadow(0_8px_6px_var(--card-shadow-hover-color-1))_drop-shadow(0_12px_12px_var(--card-shadow-hover-color-2))]`}>
      {/* Container for the transform and preserving 3D */}
      <div
        className={`relative transform transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={{ height: `${containerHeight}px` }} 
      >
        {/* Front Face */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl overflow-hidden transition-shadow duration-300">
          {/* Priority gradient banner - Use CSS Variable */}
          <div className={`h-1 bg-gradient-to-r ${priorityGradientVars[card.priority]}`} />
          {/* Label at top right corner */}
          <div className={`absolute top-0 right-0 h-6 px-2 bg-gradient-to-br ${priorityGradientVars[card.priority]} text-white rounded-bl-xl [filter:drop-shadow(-2px_2px_2px_rgba(0,0,0,0.5))] group-hover:opacity-50 transition-opacity duration-200`}>
            {card.label}
          </div>
          <div ref={frontRef} className="p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                {/* Title color might need theme adjustment, keeping dark for now */}
                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">{card.topic}</h3>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Flip Button */}
                <button
                  onClick={handleFlip}
                  title="Show Details"
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 text-blue-500 transform hover:scale-110"
                >
                  <RotateCw size={16} />
                </button>
                {/* Edit Button - Use CSS Variable */}
                <button
                  onClick={() => onEdit(card)}
                  title="Edit Card"
                  className="p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-200 text-[var(--icon-color)] transform hover:scale-110"
                >
                  <Edit2 size={16} />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => onDelete(card.id)}
                  title="Delete Card"
                  className="p-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-200 text-red-500 transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-2">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200 h-24 overflow-hidden">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line h-16"> 
                  {card.description}
                </p>
              </div>
            </div>

            {/* Tags - Use CSS Variable */}
            {card.tags && card.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-sm bg-gradient-to-r from-[var(--tag-start)] to-[var(--tag-end)] text-white shadow-sm transform hover:scale-110 transition-transform duration-200 animate-float"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date and Priority - Use CSS Variable */}
            <div className="flex justify-between items-center text-sm text-gray-600 transform hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-white rounded-xl px-3 py-1 border border-gray-100">
                <Clock size={14} className="mr-2 text-[var(--icon-color)]" />
                <span>{formattedDate}</span>
              </div>
              {/* Priority Badge - Use CSS Variable */}
              <div className={`
                inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm
                bg-gradient-to-r ${priorityGradientVars[card.priority]}
                shadow-sm ${priorityTextColors[card.priority]}
                transform hover:scale-105 transition-transform duration-200
              `}>
                {priorityIcons[card.priority]}
                <span className="font-medium capitalize">{card.priority} Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden transition-shadow duration-300 text-white">
          <div ref={backRef} className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">Details</h3>
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
};

export default Card;
