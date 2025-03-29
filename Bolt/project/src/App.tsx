import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Search, Bell, Settings, User, Save, FolderOpen } from 'lucide-react';
import CardEditor from './components/CardEditor';
import Card from './components/Card';
import { CardData, CardCollection } from './types';

function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<CardCollection[]>([]);

  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
    const savedCollections = localStorage.getItem('cardCollections');
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  const saveCards = (newCards: CardData[]) => {
    setCards(newCards);
    localStorage.setItem('cards', JSON.stringify(newCards));
  };

  const saveCollection = (name: string) => {
    const newCollection: CardCollection = {
      id: Date.now().toString(),
      name,
      cards,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    localStorage.setItem('cardCollections', JSON.stringify(updatedCollections));
    setIsSaving(false);
  };

  const loadCollection = (collection: CardCollection) => {
    saveCards(collection.cards);
    setIsLoading(false);
  };

  const handleAddCard = () => {
    setIsEditing(true);
    setEditingCard(null);
  };

  const handleSaveCard = (cardData: CardData) => {
    if (editingCard) {
      const updatedCards = cards.map(card => 
        card.id === editingCard.id ? { ...cardData, id: card.id } : card
      );
      saveCards(updatedCards);
    } else {
      const newCard = {
        ...cardData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      saveCards([...cards, newCard]);
    }
    setIsEditing(false);
    setEditingCard(null);
  };

  const handleEditCard = (card: CardData) => {
    setEditingCard(card);
    setIsEditing(true);
  };

  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    saveCards(updatedCards);
  };

  const filteredCards = cards.filter(card =>
    card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                ServiceNow Cards
              </h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#43A047]" size={18} />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
                    w-64 text-gray-700 placeholder-gray-400
                    border border-gray-200 shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {['save', 'folder', 'bell', 'settings', 'user'].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    if (action === 'save') setIsSaving(true);
                    if (action === 'folder') setIsLoading(true);
                  }}
                  className="p-3 rounded-xl bg-white border border-gray-200
                    hover:bg-gray-50 transition-all duration-300 text-[#43A047]
                    shadow-sm hover:shadow-md"
                >
                  {action === 'save' && <Save size={20} />}
                  {action === 'folder' && <FolderOpen size={20} />}
                  {action === 'bell' && <Bell size={20} />}
                  {action === 'settings' && <Settings size={20} />}
                  {action === 'user' && <User size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-8 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                My Task Cards
              </h2>
              <p className="text-sm text-[#43A047] mt-1">
                {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} available
              </p>
            </div>
            <button
              onClick={handleAddCard}
              className="p-4 rounded-full bg-gradient-to-r from-[#43A047] to-[#2E7D32]
                hover:from-[#2E7D32] hover:to-[#1B5E20] transition-all duration-300 text-white
                shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Modal Overlays */}
          {(isEditing || isSaving || isLoading) && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              {isEditing && (
                <CardEditor
                  onSave={handleSaveCard}
                  onClose={() => {
                    setIsEditing(false);
                    setEditingCard(null);
                  }}
                  initialData={editingCard}
                />
              )}

              {isSaving && (
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                      Save Collection
                    </h2>
                    <button
                      onClick={() => setIsSaving(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = (e.target as any).collectionName.value;
                      saveCollection(name);
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Collection Name
                      </label>
                      <input
                        type="text"
                        name="collectionName"
                        className="w-full px-4 py-3 bg-white rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
                          text-gray-700 placeholder-gray-400
                          border border-gray-200"
                        placeholder="Enter collection name..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsSaving(false)}
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
                        Save Collection
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {isLoading && (
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                      Load Collection
                    </h2>
                    <button
                      onClick={() => setIsLoading(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {collections.length === 0 ? (
                      <p className="text-[#43A047] text-center py-4">No saved collections found</p>
                    ) : (
                      collections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => loadCollection(collection)}
                          className="w-full text-left p-4 rounded-xl bg-white
                            hover:bg-gray-50 transition-all duration-300
                            border border-gray-200 shadow-sm hover:shadow-md"
                        >
                          <h3 className="font-medium text-gray-900">{collection.name}</h3>
                          <p className="text-sm text-[#43A047] mt-1">
                            {collection.cards.length} cards • Last updated{' '}
                            {new Date(collection.updatedAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.map(card => (
              <Card
                key={card.id}
                card={card}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#43A047] text-lg">
                {searchQuery ? 'No cards match your search' : 'No cards yet. Click the + button to create one!'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;