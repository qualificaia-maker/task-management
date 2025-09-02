// ========================================
// FILE 1: COMPONENTI CONDIVISI
// Tutti i componenti riutilizzabili
// ========================================

// Esporta tutti i componenti che servono agli altri file
window.SharedComponents = {
  
  // 1. SearchableSelect - Dropdown con ricerca
  SearchableSelect: ({ label, placeholder, value, onChange, options = [], icon: Icon, onSearch, multiple = false, required = false, className = "" }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = React.useState(options);
    const [isSearching, setIsSearching] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
        if (searchTerm) {
          setIsSearching(true);
          if (onSearch) {
            const results = await onSearch(searchTerm);
            setSearchResults(results);
          } else {
            const filtered = options.filter(opt =>
              opt.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
          }
          setIsSearching(false);
        } else {
          setSearchResults(options);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, options, onSearch]);

    const selectedOption = options.find(opt => opt.value === value);
    const { Search, ChevronDown, Check, Loader } = window.LucideIcons;

    return React.createElement('div', { className: `relative ${className}`, ref: dropdownRef },
      label && React.createElement('label', { className: "block text-sm font-medium mb-1" },
        label, required && React.createElement('span', { className: "text-red-500" }, '*')
      ),
      React.createElement('div', { 
        className: "relative cursor-pointer", 
        onClick: () => setIsOpen(!isOpen) 
      },
        React.createElement('input', {
          type: "text",
          placeholder: placeholder,
          value: selectedOption?.label || '',
          readOnly: true,
          className: "w-full px-3 py-2 pr-10 border rounded-lg cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }),
        Icon && !label && React.createElement(Icon, { 
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
        }),
        React.createElement(ChevronDown, { 
          className: `absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}` 
        })
      ),
      isOpen && React.createElement('div', { 
        className: "absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden" 
      },
        React.createElement('div', { className: "p-2 border-b sticky top-0 bg-white" },
          React.createElement('div', { className: "relative" },
            React.createElement(Search, { 
              className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
            }),
            React.createElement('input', {
              type: "text",
              placeholder: `Cerca${label ? ' ' + label.toLowerCase() : ''}...`,
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              onClick: (e) => e.stopPropagation()
            }),
            isSearching && React.createElement(Loader, { 
              className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" 
            })
          )
        ),
        React.createElement('div', { className: "max-h-48 overflow-y-auto" },
          searchResults.length > 0 ? (
            searchResults.map(option => 
              React.createElement('div', {
                key: option.value,
                className: "px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between",
                onClick: () => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }
              },
                React.createElement('span', { className: "text-sm" }, option.label),
                value === option.value && React.createElement(Check, { className: "w-4 h-4 text-blue-600" })
              )
            )
          ) : (
            React.createElement('div', { className: "px-3 py-8 text-center text-gray-500 text-sm" },
              "Nessun risultato trovato"
            )
          )
        )
      )
    );
  },

  // 2. Toast - Notifiche
  Toast: ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const { Check, X, Info } = window.LucideIcons;
    const icon = type === 'success' ? React.createElement(Check, { className: "w-5 h-5" }) :
                 type === 'error' ? React.createElement(X, { className: "w-5 h-5" }) :
                 React.createElement(Info, { className: "w-5 h-5" });

    return React.createElement('div', { 
      className: `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideUp z-50` 
    },
      icon,
      React.createElement('span', null, message),
      React.createElement('button', { onClick: onClose, className: "hover:opacity-80" },
        React.createElement(X, { className: "w-4 h-4" })
      )
    );
  },

  // 3. ExpandableSection - Sezioni espandibili
  ExpandableSection: ({ title, children, defaultOpen = false, icon: Icon }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const { ChevronRight } = window.LucideIcons;

    return React.createElement('div', { className: "border-t pt-4 mt-4" },
      React.createElement('button', {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-2 w-full text-left hover:text-gray-700 transition-colors"
      },
        React.createElement(ChevronRight, { 
          className: `w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}` 
        }),
        Icon && React.createElement(Icon, { className: "w-4 h-4 text-gray-500" }),
        React.createElement('span', { className: "font-medium" }, title)
      ),
      isOpen && React.createElement('div', { className: "mt-4 pl-6 animate-slideDown" }, children)
    );
  },

  // 4. ToggleSwitch - Switch moderni
  ToggleSwitch: ({ checked = false, onChange, label, disabled = false, size = 'default', showIcons = false, variant = 'default' }) => {
    const sizes = {
      small: { switch: 'w-8 h-4', ball: 'w-3 h-3', translate: 'translate-x-4', icon: 'w-2 h-2' },
      default: { switch: 'w-11 h-6', ball: 'w-5 h-5', translate: 'translate-x-5', icon: 'w-3 h-3' },
      large: { switch: 'w-14 h-8', ball: 'w-6 h-6', translate: 'translate-x-6', icon: 'w-4 h-4' }
    };

    const variants = {
      default: { checked: 'bg-blue-600', unchecked: 'bg-gray-300' },
      success: { checked: 'bg-green-600', unchecked: 'bg-gray-300' },
      danger: { checked: 'bg-red-600', unchecked: 'bg-gray-300' },
      ios: { checked: 'bg-green-500', unchecked: 'bg-gray-400' }
    };

    const currentSize = sizes[size];
    const currentVariant = variants[variant];
    const { Check, X } = window.LucideIcons;

    return React.createElement('label', { 
      className: `flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}` 
    },
      React.createElement('div', { className: "relative" },
        React.createElement('input', {
          type: "checkbox",
          className: "sr-only",
          checked: checked,
          onChange: onChange,
          disabled: disabled
        }),
        React.createElement('div', {
          className: `block ${currentSize.switch} rounded-full transition-colors duration-200 ${checked ? currentVariant.checked : currentVariant.unchecked} ${disabled ? '' : 'hover:shadow-md'}`
        }),
        React.createElement('div', {
          className: `absolute top-0.5 left-0.5 ${currentSize.ball} bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${checked ? currentSize.translate : 'translate-x-0'}`
        },
          showIcons && (
            checked ?
            React.createElement(Check, { className: `${currentSize.icon} text-green-600` }) :
            React.createElement(X, { className: `${currentSize.icon} text-gray-400` })
          )
        )
      ),
      label && React.createElement('span', { 
        className: `text-sm select-none ${disabled ? 'text-gray-400' : ''}` 
      }, label)
    );
  },

  // 5. InlineDropdown - Dropdown per modifica inline
  InlineDropdown: ({ value, options = [], onChange, onCancel, renderOption, searchable = false, loading = false }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const dropdownRef = React.useRef(null);
    const { Search, Check, Loader } = window.LucideIcons;

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          onCancel();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    const filteredOptions = searchable && searchTerm
      ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    return React.createElement('div', { ref: dropdownRef, className: "relative" },
      React.createElement('div', { className: "absolute z-50 mt-1 w-48 bg-white rounded-lg shadow-lg border" },
        searchable && React.createElement('div', { className: "p-2 border-b" },
          React.createElement('div', { className: "relative" },
            React.createElement(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
            React.createElement('input', {
              type: "text",
              placeholder: "Cerca...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "w-full pl-8 pr-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500",
              autoFocus: true
            })
          )
        ),
        React.createElement('div', { className: "max-h-60 overflow-y-auto py-1" },
          loading ? (
            React.createElement('div', { className: "px-3 py-4 text-center" },
              React.createElement(Loader, { className: "w-5 h-5 animate-spin mx-auto text-gray-400" })
            )
          ) : filteredOptions.length === 0 ? (
            React.createElement('div', { className: "px-3 py-4 text-center text-sm text-gray-500" }, "Nessun risultato")
          ) : (
            filteredOptions.map((option) =>
              React.createElement('button', {
                key: option.value,
                onClick: () => onChange(option),
                className: "w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between group"
              },
                renderOption ? renderOption(option) : React.createElement('span', { className: "text-sm" }, option.label),
                value === option.value && React.createElement(Check, { className: "w-4 h-4 text-blue-600" })
              )
            )
          )
        ),
        React.createElement('div', { className: "border-t p-2 flex justify-end gap-2" },
          React.createElement('button', {
            onClick: onCancel,
            className: "px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          }, "Annulla")
        )
      )
    );
  },

  // 6. InlinePriorityEdit - Modifica priorità inline
  InlinePriorityEdit: ({ priority, onSave, onCancel }) => {
    const priorityOptions = [
      { value: 'low', label: 'Bassa', color: 'bg-green-100 text-green-700', icon: '🟢' },
      { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-700', icon: '🔵' },
      { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
      { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700', icon: '🔴' }
    ];

    return React.createElement(window.SharedComponents.InlineDropdown, {
      value: priority,
      options: priorityOptions,
      onChange: (option) => onSave(option.value),
      onCancel: onCancel,
      renderOption: (option) => React.createElement('div', { className: "flex items-center gap-2" },
        React.createElement('span', null, option.icon),
        React.createElement('span', { className: `px-2 py-0.5 rounded-full text-xs font-medium ${option.color}` }, option.label)
      )
    });
  },

  // 7. InlineAssigneeEdit - Modifica assegnatario inline
  InlineAssigneeEdit: ({ assigneeId, assignees = [], onSave, onCancel }) => {
    return React.createElement(window.SharedComponents.InlineDropdown, {
      value: assigneeId,
      options: assignees,
      onChange: (option) => onSave(option.value),
      onCancel: onCancel,
      searchable: true,
      renderOption: (option) => React.createElement('div', { className: "flex items-center gap-2" },
        React.createElement('div', { 
          className: "w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs" 
        }, option.label.substring(0, 2).toUpperCase()),
        React.createElement('span', { className: "text-sm" }, option.label)
      )
    });
  }
};