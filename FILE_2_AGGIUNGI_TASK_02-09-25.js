// ========================================
// FILE 2: AGGIUNGI TASK
// Form per aggiungere nuove attività
// ========================================
 
// Componente SubtaskList - Gestione sottoattività
window.SubtaskList = ({ subtasks = [], onChange }) => {
  const [newSubtask, setNewSubtask] = React.useState('');
  const { Calendar, Users, Phone, X } = window.LucideIcons;
  
  const addSubtask = () => {
    if (newSubtask.trim()) {
      onChange([...subtasks, {
        id: Date.now(),
        title: newSubtask,
        completed: false
      }]);
      setNewSubtask('');
    }
  };
 
  return React.createElement('div', { className: "space-y-2" },
    React.createElement('div', { className: "flex gap-2" },
      React.createElement('input', {
        type: "text",
        placeholder: "Aggiungi sottoattività",
        value: newSubtask,
        onChange: (e) => setNewSubtask(e.target.value),
        onKeyPress: (e) => e.key === 'Enter' && addSubtask(),
        className: "flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      }),
      React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Calendario" },
        React.createElement(Calendar, { className: "w-5 h-5 text-gray-600" })
      ),
      React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Assegnatari" },
        React.createElement(Users, { className: "w-5 h-5 text-gray-600" })
      ),
      React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Telefono" },
        React.createElement(Phone, { className: "w-5 h-5 text-gray-600" })
      )
    ),
    subtasks.map((subtask, index) =>
      React.createElement('div', { key: subtask.id, className: "flex items-center gap-2 p-2 hover:bg-gray-50 rounded" },
        React.createElement('input', {
          type: "checkbox",
          checked: subtask.completed,
          onChange: () => {
            const updated = [...subtasks];
            updated[index].completed = !updated[index].completed;
            onChange(updated);
          },
          className: "rounded text-blue-600"
        }),
        React.createElement('span', { 
          className: `flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}` 
        }, subtask.title),
        React.createElement('button', {
          onClick: () => onChange(subtasks.filter((_, i) => i !== index)),
          className: "text-red-500 hover:text-red-700 opacity-0 hover:opacity-100 transition-opacity"
        },
          React.createElement(X, { className: "w-4 h-4" })
        )
      )
    )
  );
};
 
// Componente principale QuickAddTask
window.QuickAddTask = ({ onAdd, clients = [], contacts = [], assignees = [] }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [quickTitle, setQuickTitle] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const quickInputRef = React.useRef(null);
  
  const { Plus, CheckCircle, Calendar, Users, Phone, ChevronDown, Building, UserPlus, Eye, Paperclip, X, FileText, Loader } = window.LucideIcons;
  const { SearchableSelect, ExpandableSection, ToggleSwitch } = window.SharedComponents;
 
  // Form data state
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    priority: 'normal',
    assignees: [],
    due_date: new Date().toISOString().split('T')[0],
    due_time: '23:59',
    observer_id: null,
    client_id: null,
    contact_id: null,
    feedback_requested: false,
    is_private: false,
    repeat_task: false,
    documents: [],
    subtasks: []
  });
 
  // Reset form quando chiudi
  React.useEffect(() => {
    if (!isExpanded) {
      setFormData({
        title: '',
        description: '',
        priority: 'normal',
        assignees: [],
        due_date: new Date().toISOString().split('T')[0],
        due_time: '23:59',
        observer_id: null,
        client_id: null,
        contact_id: null,
        feedback_requested: false,
        is_private: false,
        repeat_task: false,
        documents: [],
        subtasks: []
      });
    }
  }, [isExpanded]);
 
  // Handler aggiunta rapida
  const handleQuickAdd = async () => {
    if (quickTitle.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAdd({
          title: quickTitle,
          assignee_id: 'current_user',
          status: 'pending',
          priority: 'normal'
        });
        setQuickTitle('');
        quickInputRef.current?.focus();
      } catch (error) {
        console.error('Errore:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
 
  // Handler submit form completo
  const handleSubmit = async () => {
    if (formData.title.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAdd(formData);
        setIsExpanded(false);
      } catch (error) {
        console.error('Errore:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
 
  // Funzioni ricerca asincrona
  const searchClients = async (term) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return clients.filter(c => c.label.toLowerCase().includes(term.toLowerCase()));
  };
 
  const searchContacts = async (term) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return contacts.filter(c => c.label.toLowerCase().includes(term.toLowerCase()));
  };
 
  // Render modalità rapida
  if (!isExpanded) {
    return React.createElement('div', { className: "flex gap-2" },
      React.createElement('input', {
        ref: quickInputRef,
        type: "text",
        placeholder: "Nome attività",
        value: quickTitle,
        onChange: (e) => setQuickTitle(e.target.value),
        onKeyPress: (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleQuickAdd();
          }
        },
        disabled: isSubmitting,
        className: "flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      }),
      React.createElement('button', {
        onClick: () => setIsExpanded(true),
        className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
        title: "Aggiungi attività dettagliata"
      },
        React.createElement(Plus, { className: "w-5 h-5" })
      )
    );
  }
 
  // Render modalità espansa
  return React.createElement('div', { className: "bg-white rounded-lg shadow-lg border p-6 animate-fadeIn" },
    React.createElement('h3', { className: "text-lg font-semibold mb-4" }, "Nuova Attività"),
    
    // Titolo del lavoro
    React.createElement('div', { className: "mb-4" },
      React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Titolo del lavoro"),
      React.createElement('div', { className: "flex items-center gap-2" },
        React.createElement(CheckCircle, { className: "w-5 h-5 text-gray-400" }),
        React.createElement('input', {
          type: "text",
          placeholder: "ad es. Attività da fare",
          value: formData.title,
          onChange: (e) => setFormData({...formData, title: e.target.value}),
          className: "flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500",
          autoFocus: true
        }),
        React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Calendario" },
          React.createElement(Calendar, { className: "w-5 h-5 text-gray-600" })
        ),
        React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Assegnatari" },
          React.createElement(Users, { className: "w-5 h-5 text-gray-600" })
        ),
        React.createElement('button', { className: "p-2 hover:bg-gray-100 rounded", title: "Telefono" },
          React.createElement(Phone, { className: "w-5 h-5 text-gray-600" })
        ),
        React.createElement('span', { className: "text-gray-400" }, "0)")
      )
    ),
 
    // Campo Priorità
    React.createElement('div', { className: "mb-4" },
      React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Priorità"),
      React.createElement('div', { className: "grid grid-cols-4 gap-2" },
        [
          { value: 'low', label: 'Bassa', color: 'bg-green-100 text-green-700 border-green-300' },
          { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-700 border-blue-300' },
          { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-300' },
          { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-300' }
        ].map((priority) =>
          React.createElement('button', {
            key: priority.value,
            type: "button",
            onClick: () => setFormData({...formData, priority: priority.value}),
            className: `px-3 py-2 rounded-lg border-2 font-medium transition-all ${
              formData.priority === priority.value
                ? priority.color + ' border-opacity-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`
          }, priority.label)
        )
      )
    ),
 
    // Descrizione
    React.createElement('div', { className: "mb-4" },
      React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Descrizione"),
      React.createElement('textarea', {
        placeholder: "Descrizione...",
        value: formData.description,
        onChange: (e) => setFormData({...formData, description: e.target.value}),
        className: "w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500",
        rows: 3
      })
    ),
 
    // Assegnatari
    React.createElement('div', { className: "mb-4" },
      React.createElement(SearchableSelect, {
        label: "Assegnatari",
        placeholder: "Seleziona assegnatari...",
        value: formData.assignees[0],
        onChange: (value) => setFormData({...formData, assignees: [value]}),
        options: assignees,
        icon: Users
      })
    ),
 
    // Data e Ora
    React.createElement('div', { className: "grid grid-cols-2 gap-4 mb-4" },
      React.createElement('div', null,
        React.createElement('label', { className: "block text-sm font-medium mb-1" },
          React.createElement(Calendar, { className: "w-4 h-4 inline mr-1" }),
          "Data"
        ),
        React.createElement('input', {
          type: "date",
          value: formData.due_date,
          onChange: (e) => setFormData({...formData, due_date: e.target.value}),
          className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        })
      ),
      React.createElement('div', null,
        React.createElement('label', { className: "block text-sm font-medium mb-1" },
          React.createElement(window.LucideIcons.Clock, { className: "w-4 h-4 inline mr-1" }),
          "Ora"
        ),
        React.createElement('input', {
          type: "time",
          value: formData.due_time,
          onChange: (e) => setFormData({...formData, due_time: e.target.value}),
          className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        })
      )
    ),
 
    // Sezioni espandibili
    React.createElement(ExpandableSection, {
      title: "Altro (Cliente, Contatto, Richiesta feedback, Attività privata, Ripeti attività)",
      icon: ChevronDown
    },
      React.createElement('div', { className: "space-y-4" },
        React.createElement(SearchableSelect, {
          label: "Osservatore",
          placeholder: "Seleziona osservatore...",
          value: formData.observer_id,
          onChange: (value) => setFormData({...formData, observer_id: value}),
          options: assignees,
          icon: Eye
        }),
        React.createElement(SearchableSelect, {
          label: "Cliente",
          placeholder: "Seleziona cliente...",
          value: formData.client_id,
          onChange: (value) => setFormData({...formData, client_id: value}),
          options: clients,
          onSearch: searchClients,
          icon: Building
        }),
        React.createElement(SearchableSelect, {
          label: "Contatto",
          placeholder: "Seleziona contatto...",
          value: formData.contact_id,
          onChange: (value) => setFormData({...formData, contact_id: value}),
          options: contacts,
          onSearch: searchContacts,
          icon: UserPlus
        }),
        React.createElement('div', { className: "space-y-3 pt-2" },
          React.createElement(ToggleSwitch, {
            checked: formData.feedback_requested,
            onChange: (e) => setFormData({...formData, feedback_requested: e.target.checked}),
            label: "Feedback Richiesto",
            variant: "default"
          }),
          React.createElement(ToggleSwitch, {
            checked: formData.is_private,
            onChange: (e) => setFormData({...formData, is_private: e.target.checked}),
            label: "Attività Privata",
            variant: "danger",
            showIcons: true
          }),
          React.createElement(ToggleSwitch, {
            checked: formData.repeat_task,
            onChange: (e) => setFormData({...formData, repeat_task: e.target.checked}),
            label: "Ripeti Attività",
            variant: "success"
          })
        )
      )
    ),
 
    React.createElement(ExpandableSection, {
      title: "Sottoattività",
      icon: CheckCircle,
      defaultOpen: false
    },
      React.createElement(window.SubtaskList, {
        subtasks: formData.subtasks,
        onChange: (subtasks) => setFormData({...formData, subtasks})
      })
    ),
 
    // Pulsanti azione
    React.createElement('div', { className: "flex justify-between mt-6 pt-4" },
      React.createElement('button', {
        onClick: () => setIsExpanded(false),
        disabled: isSubmitting,
        className: "px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
      }, "Annulla"),
      React.createElement('button', {
        onClick: handleSubmit,
        disabled: !formData.title.trim() || isSubmitting,
        className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
      },
        isSubmitting ? (
          React.createElement(React.Fragment, null,
            React.createElement(Loader, { className: "w-4 h-4 animate-spin" }),
            "Salvataggio..."
          )
        ) : (
          'Aggiungi'
        )
      )
    )
  );
};
