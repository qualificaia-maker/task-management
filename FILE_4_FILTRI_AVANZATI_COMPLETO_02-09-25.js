// ========================================
// FILE 4: FILTRI AVANZATI COMPLETO
// Sistema completo di filtri con salvati e preferiti
// ========================================
 
// FilterSection - Sezione filtro espandibile
window.FilterSection = ({ title, isExpanded, onToggle, children }) => {
  const { ChevronRight } = window.LucideIcons;
  
  return React.createElement('div', { className: "border rounded-lg" },
    React.createElement('button', {
      onClick: onToggle,
      className: "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    },
      React.createElement('span', { className: "font-medium" }, title),
      React.createElement(ChevronRight, { 
        className: `w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}` 
      })
    ),
    isExpanded && React.createElement('div', { className: "px-4 pb-3 border-t animate-slideDown" },
      React.createElement('div', { className: "mt-3" }, children)
    )
  );
};
 
// AdvancedFilters - Componente principale filtri COMPLETO
window.AdvancedFilters = ({ 
  isOpen, 
  onClose, 
  filters = {}, 
  onFiltersChange, 
  onSaveFilter,
  assignees = [], 
  clients = [], 
  groups = [], 
  projects = [] 
}) => {
  const [activeTab, setActiveTab] = React.useState('filters');
  const [localFilters, setLocalFilters] = React.useState(filters);
  const [filterName, setFilterName] = React.useState('');
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [savedFilters, setSavedFilters] = React.useState([]);
  const [favoriteFilters, setFavoriteFilters] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Stati sezioni espanse
  const [expandedSections, setExpandedSections] = React.useState({
    statoAttivita: true,
    assegnatario: true,
    utenteSingolo: false,
    utenteGruppo: false,
    dataScadenza: false,
    dataInizio: false,
    collegatoA: false
  });
  
  const { X, Filter, Star, FolderOpen, Search, ChevronDown, ChevronRight, Save } = window.LucideIcons;
  const { SearchableSelect } = window.SharedComponents;
  
  // Mock filtri salvati
  React.useEffect(() => {
    setSavedFilters([
      { id: 1, name: 'Ass. Niccolò', filters: { assignee: 'niccolo' } },
      { id: 2, name: 'Ass. _ Mario', filters: { assignee: 'mario' } },
      { id: 3, name: 'Ass. _ Noemi', filters: { assignee: 'noemi' } },
      { id: 4, name: 'Ass. a _ Niccolò', filters: { assignee: 'niccolo', status: 'pending' } },
      { id: 5, name: 'Ass. a _ Flagiello', filters: { assignee: 'flagiello' } },
      { id: 6, name: 'Ass. Da Me _ Non Completato', filters: { assignee: 'me', status: 'incomplete' } }
    ]);
  }, []);
  
  // Handlers
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };
  
  const handleReset = () => {
    setLocalFilters({});
  };
  
  const handleSaveFilter = () => {
    if (filterName.trim()) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        filters: localFilters,
        created_at: new Date().toISOString()
      };
      setSavedFilters([...savedFilters, newFilter]);
      if (onSaveFilter) onSaveFilter(newFilter);
      setShowSaveDialog(false);
      setFilterName('');
    }
  };
  
  const applySavedFilter = (savedFilter) => {
    setLocalFilters(savedFilter.filters);
    setActiveTab('filters');
  };
  
  const toggleFavorite = (filterId) => {
    if (favoriteFilters.includes(filterId)) {
      setFavoriteFilters(favoriteFilters.filter(id => id !== filterId));
    } else {
      setFavoriteFilters([...favoriteFilters, filterId]);
    }
  };
  
  if (!isOpen) return null;
  
  // Render componente
  return React.createElement('div', { 
    className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  },
    React.createElement('div', { 
      className: "bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
    },
      // Header con ricerca
      React.createElement('div', { className: "px-6 py-4 border-b bg-gray-50" },
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('div', { className: "relative flex-1" },
            React.createElement(Search, { 
              className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            }),
            React.createElement('input', {
              type: "text",
              placeholder: "Filtra le informazioni",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            }),
            React.createElement(ChevronDown, { 
              className: "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            })
          ),
          React.createElement('button', { 
            onClick: onClose, 
            className: "text-gray-400 hover:text-gray-600" 
          },
            React.createElement(X, { className: "w-6 h-6" })
          )
        )
      ),
      
      // Tabs
      React.createElement('div', { className: "flex border-b bg-white" },
        React.createElement('button', {
          onClick: () => setActiveTab('filters'),
          className: `px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'filters'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          }`
        },
          React.createElement(Filter, { className: "w-4 h-4" }),
          "Filtri"
        ),
        React.createElement('button', {
          onClick: () => setActiveTab('custom'),
          className: `px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'custom'
              ? 'text-green-600 border-green-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          }`
        },
          React.createElement(FolderOpen, { className: "w-4 h-4" }),
          "Filtri personalizzati"
        ),
        React.createElement('button', {
          onClick: () => setActiveTab('favorites'),
          className: `px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'favorites'
              ? 'text-yellow-600 border-yellow-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          }`
        },
          React.createElement(Star, { className: "w-4 h-4" }),
          "Preferiti"
        )
      ),
      
      // Content
      React.createElement('div', { 
        className: "p-6 overflow-y-auto", 
        style: { maxHeight: 'calc(90vh - 200px)' } 
      },
        // TAB FILTRI
        activeTab === 'filters' && React.createElement('div', { className: "grid grid-cols-2 gap-6" },
          // Colonna sinistra
          React.createElement('div', { className: "space-y-4" },
            // Stato Attività
            React.createElement(window.FilterSection, {
              title: "Stato Attività",
              isExpanded: expandedSections.statoAttivita,
              onToggle: () => toggleSection('statoAttivita')
            },
              React.createElement('div', { className: "space-y-2" },
                ['Aperto', 'In Corso', 'Completato', 'Annullato'].map(status =>
                  React.createElement('label', { 
                    key: status,
                    className: "flex items-center gap-2 cursor-pointer" 
                  },
                    React.createElement('input', {
                      type: "checkbox",
                      className: "rounded text-blue-600",
                      checked: localFilters.status?.includes(status.toLowerCase()),
                      onChange: (e) => {
                        const statuses = localFilters.status || [];
                        if (e.target.checked) {
                          setLocalFilters({...localFilters, status: [...statuses, status.toLowerCase()]});
                        } else {
                          setLocalFilters({...localFilters, status: statuses.filter(s => s !== status.toLowerCase())});
                        }
                      }
                    }),
                    React.createElement('span', { className: "text-sm" }, status)
                  )
                )
              )
            ),
            
            // Assegnatario
            React.createElement(window.FilterSection, {
              title: "Assegnatario",
              isExpanded: expandedSections.assegnatario,
              onToggle: () => toggleSection('assegnatario')
            },
              React.createElement('div', { className: "space-y-2" },
                ['Assegnato a me', 'Non assegnato', 'Assegnato ad altri'].map(type =>
                  React.createElement('label', { 
                    key: type,
                    className: "flex items-center gap-2 cursor-pointer" 
                  },
                    React.createElement('input', {
                      type: "checkbox",
                      className: "rounded text-blue-600"
                    }),
                    React.createElement('span', { className: "text-sm" }, type)
                  )
                )
              )
            ),
            
            // Utente Singolo
            React.createElement(window.FilterSection, {
              title: "Utente Singolo",
              isExpanded: expandedSections.utenteSingolo,
              onToggle: () => toggleSection('utenteSingolo')
            },
              React.createElement(SearchableSelect, {
                placeholder: "Seleziona utente...",
                value: localFilters.utenteSingolo,
                onChange: (value) => setLocalFilters({...localFilters, utenteSingolo: value}),
                options: assignees
              })
            ),
            
            // Utente Gruppo
            React.createElement(window.FilterSection, {
              title: "Utente Gruppo",
              isExpanded: expandedSections.utenteGruppo,
              onToggle: () => toggleSection('utenteGruppo')
            },
              React.createElement(SearchableSelect, {
                placeholder: "Seleziona gruppo...",
                value: localFilters.utenteGruppo,
                onChange: (value) => setLocalFilters({...localFilters, utenteGruppo: value}),
                options: groups
              })
            )
          ),
          
          // Colonna destra
          React.createElement('div', { className: "space-y-4" },
            // Data Scadenza
            React.createElement(window.FilterSection, {
              title: "Data Scadenza",
              isExpanded: expandedSections.dataScadenza,
              onToggle: () => toggleSection('dataScadenza')
            },
              React.createElement('div', { className: "grid grid-cols-2 gap-2" },
                React.createElement('input', {
                  type: "date",
                  className: "px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500",
                  placeholder: "Da",
                  value: localFilters.dueDateFrom || '',
                  onChange: (e) => setLocalFilters({...localFilters, dueDateFrom: e.target.value})
                }),
                React.createElement('input', {
                  type: "date",
                  className: "px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500",
                  placeholder: "A",
                  value: localFilters.dueDateTo || '',
                  onChange: (e) => setLocalFilters({...localFilters, dueDateTo: e.target.value})
                })
              )
            ),
            
            // Data Inizio
            React.createElement(window.FilterSection, {
              title: "Data Inizio",
              isExpanded: expandedSections.dataInizio,
              onToggle: () => toggleSection('dataInizio')
            },
              React.createElement('div', { className: "grid grid-cols-2 gap-2" },
                React.createElement('input', {
                  type: "date",
                  className: "px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500",
                  placeholder: "Da",
                  value: localFilters.startDateFrom || '',
                  onChange: (e) => setLocalFilters({...localFilters, startDateFrom: e.target.value})
                }),
                React.createElement('input', {
                  type: "date",
                  className: "px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500",
                  placeholder: "A",
                  value: localFilters.startDateTo || '',
                  onChange: (e) => setLocalFilters({...localFilters, startDateTo: e.target.value})
                })
              )
            ),
            
            // Collegato A
            React.createElement(window.FilterSection, {
              title: "Collegato A",
              isExpanded: expandedSections.collegatoA,
              onToggle: () => toggleSection('collegatoA')
            },
              React.createElement(SearchableSelect, {
                placeholder: "Seleziona collegamento...",
                value: localFilters.collegatoA,
                onChange: (value) => setLocalFilters({...localFilters, collegatoA: value}),
                options: projects
              })
            ),
            
            // Salva ricerca corrente
            React.createElement('button', {
              onClick: () => setShowSaveDialog(true),
              className: "w-full px-4 py-3 text-left hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors"
            },
              React.createElement(ChevronRight, { className: "w-4 h-4" }),
              React.createElement('span', { className: "font-medium" }, "Salva ricerca corrente")
            )
          )
        ),
        
        // TAB FILTRI PERSONALIZZATI
        activeTab === 'custom' && React.createElement('div', { className: "space-y-4" },
          savedFilters.length > 0 ? (
            React.createElement('div', { className: "grid grid-cols-2 gap-4" },
              savedFilters.map(filter =>
                React.createElement('div', {
                  key: filter.id,
                  className: "border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                },
                  React.createElement('div', { className: "flex items-center justify-between mb-2" },
                    React.createElement('h4', { className: "font-medium" }, filter.name),
                    React.createElement('div', { className: "flex gap-2" },
                      React.createElement('button', {
                        onClick: () => toggleFavorite(filter.id),
                        className: `p-1 rounded hover:bg-gray-200 ${
                          favoriteFilters.includes(filter.id) ? 'text-yellow-500' : 'text-gray-400'
                        }`
                      },
                        React.createElement(Star, { 
                          className: "w-4 h-4",
                          fill: favoriteFilters.includes(filter.id) ? 'currentColor' : 'none'
                        })
                      ),
                      React.createElement('button', {
                        onClick: () => {
                          if (window.confirm('Eliminare questo filtro?')) {
                            setSavedFilters(savedFilters.filter(f => f.id !== filter.id));
                          }
                        },
                        className: "p-1 rounded hover:bg-gray-200 text-red-500"
                      },
                        React.createElement(X, { className: "w-4 h-4" })
                      )
                    )
                  ),
                  React.createElement('p', { className: "text-sm text-gray-600 mb-3" },
                    `${Object.keys(filter.filters).length} criteri applicati`
                  ),
                  React.createElement('button', {
                    onClick: () => applySavedFilter(filter),
                    className: "w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  }, "Applica filtro")
                )
              )
            )
          ) : (
            React.createElement('div', { className: "text-center py-8" },
              React.createElement(FolderOpen, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }),
              React.createElement('p', { className: "text-gray-500" }, "Nessun filtro personalizzato salvato"),
              React.createElement('button', {
                onClick: () => setActiveTab('filters'),
                className: "mt-3 text-blue-600 hover:text-blue-800 text-sm"
              }, "Crea il tuo primo filtro")
            )
          )
        ),
        
        // TAB PREFERITI
        activeTab === 'favorites' && React.createElement('div', { className: "space-y-4" },
          favoriteFilters.length > 0 ? (
            React.createElement('div', { className: "grid grid-cols-2 gap-4" },
              savedFilters
                .filter(f => favoriteFilters.includes(f.id))
                .map(filter =>
                  React.createElement('div', {
                    key: filter.id,
                    className: "border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  },
                    React.createElement('div', { className: "flex items-center justify-between mb-2" },
                      React.createElement('h4', { className: "font-medium" }, filter.name),
                      React.createElement('button', {
                        onClick: () => toggleFavorite(filter.id),
                        className: "p-1 rounded hover:bg-gray-200 text-yellow-500"
                      },
                        React.createElement(Star, { className: "w-4 h-4", fill: "currentColor" })
                      )
                    ),
                    React.createElement('button', {
                      onClick: () => applySavedFilter(filter),
                      className: "w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    }, "Applica filtro")
                  )
                )
            )
          ) : (
            React.createElement('div', { className: "text-center py-8" },
              React.createElement(Star, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }),
              React.createElement('p', { className: "text-gray-500" }, "Nessun filtro preferito"),
              React.createElement('p', { className: "text-sm text-gray-400 mt-1" },
                "Aggiungi filtri ai preferiti per accedervi rapidamente"
              )
            )
          )
        )
      ),
      
      // Footer con azioni
      React.createElement('div', { className: "px-6 py-4 border-t bg-gray-50 flex justify-between" },
        React.createElement('button', {
          onClick: handleReset,
          className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        }, "Resetta filtri"),
        React.createElement('div', { className: "space-x-2" },
          React.createElement('button', {
            onClick: onClose,
            className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          }, "Annulla"),
          React.createElement('button', {
            onClick: handleApply,
            className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          }, "Applica filtri")
        )
      ),
      
      // Dialog salva filtro
      showSaveDialog && React.createElement('div', { 
        className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
      },
        React.createElement('div', { className: "bg-white rounded-lg p-6 w-96" },
          React.createElement('h3', { className: "text-lg font-semibold mb-4" }, 
            "Salva filtro personalizzato"
          ),
          React.createElement('input', {
            type: "text",
            placeholder: "Nome del filtro...",
            value: filterName,
            onChange: (e) => setFilterName(e.target.value),
            className: "w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500",
            autoFocus: true
          }),
          React.createElement('div', { className: "flex justify-end gap-2" },
            React.createElement('button', {
              onClick: () => {
                setShowSaveDialog(false);
                setFilterName('');
              },
              className: "px-4 py-2 text-gray-600 hover:text-gray-800"
            }, "Annulla"),
            React.createElement('button', {
              onClick: handleSaveFilter,
              disabled: !filterName.trim(),
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            }, "Salva")
          )
        )
      )
    )
  );
};
