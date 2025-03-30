import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Search, Bell, Settings, User, Save, FolderOpen, FilePlus, Palette } from 'lucide-react'; // Added FilePlus, Palette
import CardEditor from './components/CardEditor';
import Card from './components/Card';
import { CardData, CardCollection } from './types';

// Define themes
const themes = ['servicenow', 'youtube', 'facebook', 'snapchat'];
const themeDisplayNames: { [key: string]: string } = {
  servicenow: 'ServiceNow',
  youtube: 'YouTube',
  facebook: 'Facebook',
  snapchat: 'Snapchat'
};


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
  const [currentTheme, setCurrentTheme] = useState('servicenow'); // State for theme
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false); // State for theme dropdown

  // Load initial data and theme
  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
    const savedCollections = localStorage.getItem('cardCollections');
    if (savedCollections) {
       setCollections(JSON.parse(savedCollections));
     }
     // Load saved theme
     const savedTheme = localStorage.getItem('appTheme');
     if (savedTheme && themes.includes(savedTheme)) {
       setCurrentTheme(savedTheme);
     } else {
       // Set default theme attribute if nothing saved
       document.documentElement.setAttribute('data-theme', currentTheme);
     }
   }, []); // Empty dependency array ensures this runs only once on mount
 
   // Apply theme attribute and save preference when theme changes
   useEffect(() => {
     document.documentElement.setAttribute('data-theme', currentTheme);
     localStorage.setItem('appTheme', currentTheme);
   }, [currentTheme]);
 
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
    // Update the currently active collection if one is set
    if (currentCollectionName) {
      const cardsToSave = editingCard 
        ? cards.map(card => card.id === editingCard.id ? { ...cardData, id: card.id } : card)
        : [...cards, { ...cardData, id: Date.now().toString(), createdAt: new Date().toISOString() }];
      saveOrUpdateCollection(currentCollectionName, cardsToSave);
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
     // Update the currently active collection if one is set
     if (currentCollectionName) {
      saveOrUpdateCollection(currentCollectionName, updatedCards);
    }
  };

  const filteredCards = cards.filter(card =>
    card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Use CSS Variable for background
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-end)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-baseline space-x-3">
                 {/* Use CSS Variable for header title gradient */}
                 <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--button-primary-end)] to-[var(--button-primary-start)] bg-clip-text text-transparent">
                  ServiceNow Cards <span className="text-xs font-normal text-gray-500">(Current: {currentTheme})</span>
                 </h1>
                 {/* Removed collection name display from header */}
               </div>
              <div className="relative">
                 {/* Use CSS Variable for icon color */}
                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--icon-color)]" size={18} />
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                   // Use CSS Variable for focus ring
                   className="pl-12 pr-4 py-3 bg-white rounded-xl text-gray-700 placeholder-gray-400 border border-gray-200 shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[var(--icon-color)] focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Action Buttons */}
              {['save', 'folder', 'new', 'bell', 'settings'].map((action) => (
                <button
                  key={action}
                  title={ 
                    action === 'save' ? 'Save Collection' :
                    action === 'folder' ? 'Load Collection' :
                    action === 'new' ? 'New Collection' :
                    action === 'bell' ? 'Notifications' :
                    action === 'settings' ? 'Settings' : ''
                   }
                   onClick={() => {
                     if (action === 'save') handleQuickSave(); 
                     if (action === 'folder') setIsLoading(true);
                     if (action === 'new') handleNewCollection(); 
                   }}
                   // Use CSS Variable for icon color
                   className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-[var(--icon-color)] shadow-sm hover:shadow-md"
                >
                  {action === 'save' && <Save size={20} />}
                  {action === 'folder' && <FolderOpen size={20} />}
                  {action === 'new' && <FilePlus size={20} />} 
                  {action === 'bell' && <Bell size={20} />}
                  {action === 'settings' && <Settings size={20} />}
                </button>
              ))}
              {/* Theme Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
                  title="Change Theme"
                  className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-[var(--icon-color)] shadow-sm hover:shadow-md"
                >
                  <Palette size={20} />
                </button>
                {showThemeSwitcher && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                    {themes.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => {
                          setCurrentTheme(theme);
                          setShowThemeSwitcher(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentTheme === theme ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {themeDisplayNames[theme]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
               {/* User Button - Kept separate as it might have different styling/logic later */}
               <button
                 key="user"
                 title="User Profile"
                 className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-[var(--icon-color)] shadow-sm hover:shadow-md"
               >
                 <User size={20} />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-8 px-6">
        <div className="container mx-auto">
             {/* Display current collection name if set - Use CSS Variable */}
             <div className="flex justify-between items-center">
              {currentCollectionName && (
                <h2 className="text-3xl font-bold text-[var(--header-text-color)] flex items-center w-full"> 
                  {currentCollectionName}
                </h2>
              )}
              <div className="flex items-center">
                <p className="text-base text-[var(--card-count-text-color)] mr-4"> 
                  {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} available
                </p>
              {/* Use CSS Variables for button gradient */}
                <button
                  onClick={handleAddCard}
                  className="p-4 rounded-full bg-gradient-to-r from-[var(--button-primary-start)] to-[var(--button-primary-end)] hover:from-[var(--button-primary-hover-start)] hover:to-[var(--button-primary-hover-end)] transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
           <div className="flex justify-between items-center mb-8">
             <div>
               {/* Use CSS Variables */}
               <h3 className="text-lg font-medium text-[var(--subheader-text-color)]"> 
                 
               </h3>
            </div>
          </div>

          {/* Modal Overlays */}
          {(isEditing || isSaving || isLoading || isCreatingCollection) && ( 
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

              {/* Save/New/Load Modals - Apply CSS Variables */}
              {(isSaving || isCreatingCollection || isLoading) && (
                 <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                   {/* Common Modal Header */}
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--button-primary-end)] to-[var(--button-primary-start)] bg-clip-text text-transparent">
                       {isSaving ? 'Save Collection' : isCreatingCollection ? 'Create New Collection' : 'Load Collection'}
                     </h2>
                     <button
                       onClick={() => {
                         if (isSaving) setIsSaving(false);
                         if (isCreatingCollection) setIsCreatingCollection(false);
                         if (isLoading) setIsLoading(false);
                       }}
                       className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-600"
                     >
                       <X size={24} />
                     </button>
                   </div>

                   {/* Save / Create Form */}
                   {(isSaving || isCreatingCollection) && (
                     <form
                       onSubmit={(e) => {
                         e.preventDefault();
                         const nameInput = e.target as HTMLFormElement;
                         const name = isSaving 
                           ? (nameInput.elements.namedItem('collectionName') as HTMLInputElement).value 
                           : (nameInput.elements.namedItem('newCollectionName') as HTMLInputElement).value;
                         
                         if (isSaving) saveCollection(name);
                         if (isCreatingCollection) confirmNewCollection(name);
                       }}
                       className="space-y-6"
                     >
                       <div>
                         <label className="block text-gray-700 font-medium mb-2">
                           Collection Name
                         </label>
                         <input
                           type="text"
                           name={isSaving ? "collectionName" : "newCollectionName"}
                           className="w-full px-4 py-3 bg-white rounded-xl text-gray-700 placeholder-gray-400 border border-gray-200
                             focus:outline-none focus:ring-2 focus:ring-[var(--icon-color)] focus:ring-opacity-50"
                           placeholder="Enter collection name..."
                           required
                           autoFocus={isCreatingCollection} 
                         />
                       </div>
                       <div className="flex justify-end space-x-4">
                         <button
                           type="button"
                           onClick={() => isSaving ? setIsSaving(false) : setIsCreatingCollection(false)}
                           className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-gray-700"
                         >
                           Cancel
                         </button>
                         <button
                           type="submit"
                           className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--button-primary-start)] to-[var(--button-primary-end)] hover:from-[var(--button-primary-hover-start)] hover:to-[var(--button-primary-hover-end)] transition-all duration-300 text-white shadow-lg"
                         >
                           {isSaving ? 'Save Collection' : 'Create Collection'}
                         </button>
                       </div>
                     </form>
                   )}

                   {/* Load List */}
                   {isLoading && (
                     <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                       {collections.length === 0 ? (
                         <p className="text-[var(--icon-color)] text-center py-4">No saved collections found</p>
                       ) : (
                         collections.map((collection) => (
                           <button
                             key={collection.id}
                             onClick={() => loadCollection(collection)}
                             className="w-full text-left p-4 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
                           >
                             <h3 className="font-medium text-gray-900">{collection.name}</h3>
                             <p className="text-sm text-[var(--icon-color)] mt-1">
                               {collection.cards.length} cards • Last updated{' '}
                               {new Date(collection.updatedAt).toLocaleDateString()}
                             </p>
                           </button>
                         ))
                       )}
                     </div>
                   )}
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

          {/* Use CSS Variable */}
          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--icon-color)] text-lg">
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
