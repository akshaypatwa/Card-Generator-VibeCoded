import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Search, Bell, Settings, User, Save, FolderOpen, FilePlus } from 'lucide-react'; // Added FilePlus
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
  const [isCreatingCollection, setIsCreatingCollection] = useState(false); // State for new collection modal
  const [collections, setCollections] = useState<CardCollection[]>([]);
  const [currentCollectionName, setCurrentCollectionName] = useState<string | null>(null); // State for current collection name

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
  
    // Helper function to save/update a collection entry
    const saveOrUpdateCollection = (name: string, cardsToSave: CardData[]) => {
     const existingCollectionIndex = collections.findIndex(c => c.name === name);
     let updatedCollections;
 
     if (existingCollectionIndex > -1) {
       // Update existing collection
       updatedCollections = collections.map((collection, index) => 
         index === existingCollectionIndex 
           ? { ...collection, cards: cardsToSave, updatedAt: new Date().toISOString() } 
           : collection
       );
     } else {
       // Add new collection
       const newCollection: CardCollection = {
         id: Date.now().toString(),
         name,
         cards: cardsToSave,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString()
       };
       updatedCollections = [...collections, newCollection];
     }
     
     setCollections(updatedCollections);
     localStorage.setItem('cardCollections', JSON.stringify(updatedCollections));
   };
 
   // Modified saveCollection (called by Save modal)
   const saveCollection = (name: string) => {
     saveOrUpdateCollection(name, cards); // Use the helper
     setIsSaving(false); // Close the modal now
   };
 
   const loadCollection = (collection: CardCollection) => {
    saveCards(collection.cards);
    setCurrentCollectionName(collection.name); // Set the current collection name
    setIsLoading(false);
  };

  // Function to open the new collection modal
  const handleNewCollection = () => {
    setIsCreatingCollection(true); // Open the modal
  };

   // Function to confirm and create the new collection
   const confirmNewCollection = (name: string) => {
     const trimmedName = name.trim();
     if (trimmedName) { // Ensure name is not empty
       const newCards: CardData[] = []; // Start with empty cards
       setCards(newCards); 
       setCurrentCollectionName(trimmedName); 
       saveOrUpdateCollection(trimmedName, newCards); // Save the new empty collection immediately
       setIsCreatingCollection(false); // Close the modal
     }
   };
 
   // Function to quickly save the current collection if it has a name
   const handleQuickSave = () => {
     if (currentCollectionName) {
       saveOrUpdateCollection(currentCollectionName, cards);
       // Optionally add a visual confirmation like a toast message here
       console.log(`Collection '${currentCollectionName}' saved.`); 
     } else {
       // If no current collection name, open the Save As modal
       setIsSaving(true);
     }
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
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-baseline space-x-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                  ServiceNow Cards
                </h1>
                {/* Removed collection name display from header */}
              </div>
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
              {/* Added 'new' action */}
              {['save', 'folder', 'new', 'bell', 'settings', 'user'].map((action) => (
                <button
                  key={action}
                  title={ // Added tooltips
                    action === 'save' ? 'Save Collection' :
                    action === 'folder' ? 'Load Collection' :
                    action === 'new' ? 'New Collection' :
                    action === 'bell' ? 'Notifications' :
                    action === 'settings' ? 'Settings' :
                     action === 'user' ? 'User Profile' : ''
                   }
                   onClick={() => {
                     if (action === 'save') handleQuickSave(); // Use quick save or open modal
                     if (action === 'folder') setIsLoading(true);
                     if (action === 'new') handleNewCollection(); // Call new function
                   }}
                   className="p-3 rounded-xl bg-white border border-gray-200
                    hover:bg-gray-50 transition-all duration-300 text-[#43A047]
                    shadow-sm hover:shadow-md"
                >
                  {action === 'save' && <Save size={20} />}
                  {action === 'folder' && <FolderOpen size={20} />}
                  {action === 'new' && <FilePlus size={20} />} {/* Added icon */}
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
          {/* Display current collection name if set */}
          {currentCollectionName && (
            <h3 className="text-lg font-semibold text-green-200 mb-4">
              Current Collection: {currentCollectionName}
            </h3>
          )}
          <div className="flex justify-between items-center mb-8">
            <div>
              {/* Changed text color for visibility */}
              <h2 className="text-xl font-bold text-gray-100"> 
                My Task Cards
              </h2>
              {/* Changed text color for visibility */}
              <p className="text-sm text-green-300 mt-1"> 
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
          {(isEditing || isSaving || isLoading || isCreatingCollection) && ( // Added isCreatingCollection
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

              {/* New Collection Modal */}
              {isCreatingCollection && (
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                      Create New Collection
                    </h2>
                    <button
                      onClick={() => setIsCreatingCollection(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = (e.target as any).newCollectionName.value;
                      confirmNewCollection(name);
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Collection Name
                      </label>
                      <input
                        type="text"
                        name="newCollectionName"
                        className="w-full px-4 py-3 bg-white rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-[#43A047] focus:ring-opacity-50
                          text-gray-700 placeholder-gray-400
                          border border-gray-200"
                        placeholder="Enter new collection name..."
                        required
                        autoFocus // Focus on input when modal opens
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCollection(false)}
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
                        Create Collection
                      </button>
                    </div>
                  </form>
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
