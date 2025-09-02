// ========================================
// FILE 3: TABELLA TASK
// Visualizzazione e gestione task in tabella
// ========================================
 
// TaskRow - Componente per singola riga
window.TaskRow = ({ task, isSelected, onToggleSelect, onEdit, onDelete, onStatusChange }) => {
  const { CheckCircle, MoreVertical, Edit2, User, Calendar, GripVertical } = window.LucideIcons;
  
  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const priorityConfig = {
    low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Bassa' },
    normal: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normale' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Alta' },
    urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgente' }
  };
  
  const priority = priorityConfig[task.priority || 'normal'];
  const [showActions, setShowActions] = React.useState(false);
  
  return React.createElement('tr', { className: "border-b hover:bg-gray-50" },
    // Grip handle per drag & drop
    React.createElement('td', { className: "p-2 w-8" },
      React.createElement(GripVertical, { className: "w-4 h-4 text-gray-400 cursor-grab" })
    ),
    
    // Checkbox
    React.createElement('td', { className: "p-3" },
      React.createElement('input', {
        type: "checkbox",
        checked: isSelected,
        onChange: onToggleSelect,
        className: "rounded text-blue-600"
      })
    ),
    
    // Status
    React.createElement('td', { className: "p-3" },
      React.createElement('div', {
        onClick: () => onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed'),
        className: "cursor-pointer"
      },
        React.createElement(CheckCircle, { 
          className: task.status === 'completed' ? "w-5 h-5 text-green-500" : "w-5 h-5 text-gray-300 hover:text-gray-400"
        })
      )
    ),
    
    // Titolo
    React.createElement('td', { className: "p-3" },
      React.createElement('span', { className: "font-medium" }, task.title)
    ),
    
    // Priorità
    React.createElement('td', { className: "p-3" },
      React.createElement('span', { 
        className: `px-2 py-1 ${priority.bg} ${priority.text} text-xs rounded-full font-medium`
      }, priority.label)
    ),
    
    // Descrizione
    React.createElement('td', { className: "p-3 max-w-xs truncate", title: task.description },
      task.description || '-'
    ),
    
    // Data scadenza
    React.createElement('td', { className: "p-3" }, formatDate(task.due_date)),
    
    // Cliente
    React.createElement('td', { className: "p-3" }, task.client || '-'),
    
    // Assegnatario
    React.createElement('td', { className: "p-3" },
      task.assignee ? (
        React.createElement('div', { className: "flex items-center gap-2" },
          React.createElement('div', { 
            className: "w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
          }, task.assignee.name.substring(0, 2).toUpperCase()),
          React.createElement('span', { className: "text-sm" }, task.assignee.name)
        )
      ) : '-'
    ),
    
    // Azioni
    React.createElement('td', { className: "p-3 relative" },
      React.createElement('button', {
        onClick: () => setShowActions(!showActions),
        className: "p-1 hover:bg-gray-100 rounded"
      },
        React.createElement(MoreVertical, { className: "w-4 h-4" })
      ),
      showActions && React.createElement(React.Fragment, null,
        React.createElement('div', {
          className: "fixed inset-0 z-10",
          onClick: () => setShowActions(false)
        }),
        React.createElement('div', { 
          className: "absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20"
        },
          React.createElement('button', {
            onClick: () => { onEdit(task); setShowActions(false); },
            className: "w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          }, "Modifica"),
          React.createElement('button', {
            onClick: () => { onDelete(task.id); setShowActions(false); },
            className: "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
          }, "Elimina")
        )
      )
    )
  );
};
 
// TaskTable - Componente principale tabella
window.TaskTable = ({ tasks = [], loading = false, onRefresh, onTaskEdit, onTaskDelete, onTaskStatusChange, onOpenFilters }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTasks, setSelectedTasks] = React.useState([]);
  const [currentView, setCurrentView] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  
  const { Search, RefreshCw, Download, FileText, ChevronDown, ArrowUpDown, X } = window.LucideIcons;
  
  // Filtra i task
  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];
    
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtri vista temporale
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (currentView) {
      case 'overdue':
        filtered = filtered.filter(t => new Date(t.due_date) < today && t.status !== 'completed');
        break;
      case 'today':
        filtered = filtered.filter(t => {
          const dueDate = new Date(t.due_date);
          return dueDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        filtered = filtered.filter(t => {
          const dueDate = new Date(t.due_date);
          return dueDate >= today && dueDate <= weekEnd;
        });
        break;
    }
    
    // Ordinamento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [tasks, searchTerm, currentView, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(t => t.id));
    } else {
      setSelectedTasks([]);
    }
  };
  
  // Contatori per filtri rapidi
  const quickFilterCounts = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return {
      all: tasks.length,
      overdue: tasks.filter(t => new Date(t.due_date) < today && t.status !== 'completed').length,
      today: tasks.filter(t => {
        const dueDate = new Date(t.due_date);
        return dueDate.toDateString() === today.toDateString();
      }).length,
      week: tasks.filter(t => {
        const dueDate = new Date(t.due_date);
        return dueDate >= today && dueDate <= weekEnd;
      }).length
    };
  }, [tasks]);
  
  const quickFilters = [
    { id: 'all', label: 'Tutte', count: quickFilterCounts.all, color: 'bg-gray-500' },
    { id: 'overdue', label: 'Scadute', count: quickFilterCounts.overdue, color: 'bg-red-500' },
    { id: 'today', label: 'Oggi', count: quickFilterCounts.today, color: 'bg-yellow-500' },
    { id: 'week', label: 'Settimana', count: quickFilterCounts.week, color: 'bg-blue-500' }
  ];
  
  return React.createElement('div', null,
    // Header con filtri
    React.createElement('div', { className: "px-6 py-4 bg-white border-b" },
      // Intestazione
      React.createElement('div', { className: "flex items-center justify-between mb-4" },
        React.createElement('div', null,
          React.createElement('h2', { className: "text-xl font-semibold text-gray-800" }, "Elenco Attività"),
          React.createElement('p', { className: "text-sm text-gray-600 mt-1" },
            `${tasks.length} attività totali • ${tasks.filter(t => t.status === 'completed').length} completate`
          )
        ),
        React.createElement('div', { className: "flex items-center gap-2" },
          React.createElement('button', { 
            className: "px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          },
            React.createElement(Download, { className: "w-4 h-4" }),
            "Esporta"
          )
        )
      ),
      
      // Filtri rapidi e ricerca
      React.createElement('div', { className: "flex items-center justify-between" },
        // Filtri rapidi
        React.createElement('div', { className: "flex gap-2" },
          quickFilters.map(filter =>
            React.createElement('button', {
              key: filter.id,
              onClick: () => setCurrentView(filter.id),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === filter.id
                  ? `${filter.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`
            }, `${filter.label} (${filter.count})`)
          )
        ),
        
        // Barra ricerca
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('div', { className: "relative" },
            React.createElement(Search, { 
              className: "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            }),
            React.createElement('input', {
              type: "text",
              placeholder: "Cerca attività...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10 pr-10 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-blue-500"
            }),
            React.createElement('button', {
              onClick: onOpenFilters,
              className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            },
              React.createElement(ChevronDown, { className: "w-4 h-4" })
            )
          ),
          React.createElement('button', {
            onClick: onRefresh,
            disabled: loading,
            className: "p-2 hover:bg-gray-100 rounded-lg"
          },
            React.createElement(RefreshCw, { className: `w-5 h-5 ${loading ? 'animate-spin' : ''}` })
          )
        )
      )
    ),
    
    // Tabella
    React.createElement('div', { className: "px-6 py-4" },
      React.createElement('div', { className: "bg-white rounded-lg shadow-sm border overflow-hidden" },
        React.createElement('div', { className: "overflow-x-auto" },
          React.createElement('table', { className: "w-full" },
            React.createElement('thead', null,
              React.createElement('tr', { className: "bg-gray-50 border-b" },
                React.createElement('th', { className: "p-2 w-8" }),
                React.createElement('th', { className: "p-3 text-left" },
                  React.createElement('input', {
                    type: "checkbox",
                    checked: selectedTasks.length === filteredTasks.length && filteredTasks.length > 0,
                    onChange: (e) => handleSelectAll(e.target.checked),
                    className: "rounded text-blue-600"
                  })
                ),
                React.createElement('th', { className: "p-3 text-left" }, "Stato"),
                React.createElement('th', { className: "p-3 text-left" },
                  React.createElement('button', {
                    onClick: () => handleSort('title'),
                    className: "flex items-center gap-1 hover:text-gray-900 font-medium text-xs uppercase"
                  }, "Titolo", React.createElement(ArrowUpDown, { className: "w-3 h-3" }))
                ),
                React.createElement('th', { className: "p-3 text-left" }, "Priorità"),
                React.createElement('th', { className: "p-3 text-left" }, "Descrizione"),
                React.createElement('th', { className: "p-3 text-left" }, "Scadenza"),
                React.createElement('th', { className: "p-3 text-left" }, "Cliente"),
                React.createElement('th', { className: "p-3 text-left" }, "Assegnato a"),
                React.createElement('th', { className: "p-3 text-center" }, "Azioni")
              )
            ),
            React.createElement('tbody', null,
              loading ? (
                React.createElement('tr', null,
                  React.createElement('td', { colSpan: 10, className: "p-8 text-center" },
                    React.createElement('div', { className: "flex justify-center" },
                      React.createElement(RefreshCw, { className: "w-8 h-8 animate-spin text-gray-400" })
                    )
                  )
                )
              ) : filteredTasks.length === 0 ? (
                React.createElement('tr', null,
                  React.createElement('td', { colSpan: 10, className: "p-8 text-center" },
                    React.createElement(FileText, { className: "w-12 h-12 text-gray-300 mx-auto mb-2" }),
                    React.createElement('p', { className: "text-gray-500" }, "Nessuna attività trovata")
                  )
                )
              ) : (
                filteredTasks.map(task =>
                  React.createElement(window.TaskRow, {
                    key: task.id,
                    task: task,
                    isSelected: selectedTasks.includes(task.id),
                    onToggleSelect: () => {
                      if (selectedTasks.includes(task.id)) {
                        setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                      } else {
                        setSelectedTasks([...selectedTasks, task.id]);
                      }
                    },
                    onEdit: onTaskEdit,
                    onDelete: onTaskDelete,
                    onStatusChange: onTaskStatusChange
                  })
                )
              )
            )
          )
        )
      )
    )
  );
};
