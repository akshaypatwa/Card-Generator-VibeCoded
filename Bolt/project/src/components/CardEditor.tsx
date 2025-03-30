import React, { useState } from 'react';
import { X, AlertCircle, Plus, Tag } from 'lucide-react';
import { CardData } from '../types';

interface CardEditorProps {
  onSave: (card: CardData) => void;
  onClose: () => void;
  initialData?: CardData | null;
}

const CardEditor: React.FC<CardEditorProps> = ({ onSave, onClose, initialData }) => {
  const [formData, setFormData] = useState<Omit<CardData, 'id' | 'createdAt'>>({
    topic: initialData?.topic || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'low',
    tags: initialData?.tags || [],
    details: initialData?.details || '', // Added details state
    label: initialData?.label || '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as CardData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
          {initialData ? 'Edit Card' : 'New Card'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Topic
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
              text-gray-700 placeholder-gray-400
              border border-gray-200 shadow-sm"
            placeholder="Enter additional details..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Label
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
              text-gray-700 placeholder-gray-400
              border border-gray-200 shadow-sm"
            placeholder="Enter label..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
              text-gray-700 placeholder-gray-400
              border border-gray-200 shadow-sm"
            rows={1}
            placeholder="Enter description..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Details (Optional)
          </label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
              text-gray-700 placeholder-gray-400
              border border-gray-200 shadow-sm"
            rows={3}
            placeholder="Enter additional details..."
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full
                  bg-gradient-to-r from-[#43A047] to-[#2E7D32] text-white
                  shadow-sm animate-float"
              >
                <Tag size={14} className="mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 bg-white rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
                text-gray-700 placeholder-gray-400
                border border-gray-200 shadow-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#43A047] to-[#2E7D32]
                hover:from-[#2E7D32] hover:to-[#1B5E20] transition-all duration-300
                text-white shadow-lg"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Priority
          </label>
          <div className="relative">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-4 py-3 bg-white rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
                text-gray-700 placeholder-gray-400
                border border-gray-200 appearance-none pr-10 shadow-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <AlertCircle 
              size={18} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#43A047]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-100
              hover:bg-gray-200 transition-all duration-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#43A047] to-[#2E7D32]
              hover:from-[#2E7D32] hover:to-[#1B5E20] transition-all duration-300
              text-white shadow-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CardEditor;
