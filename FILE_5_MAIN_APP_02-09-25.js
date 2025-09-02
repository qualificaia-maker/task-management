// ========================================
// FILE 5: MAIN APP
// Componente principale che orchestra tutto
// ========================================

window.TaskManagement = function() {
  // Stati principali
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  
  // Mock data
  const assignees = [
    { value: 1, label: 'EF' },
    { value: 2, label: 'GC' },
    { value: 3, label: 'Mario' },
    { value: 4, label: 'Niccolò' },
    { value: 5, label: 'Noemi' }
  ];
  
  const clients = [
    { value: 1, label: 'Minone pino (casa sua)' },
    { value: 2, label: 'Azienda ABC' },
    { value: 3, label: 'Studio Legale XYZ' },
    { value: 4, label: 'Consulting Group' },
    { value: 5, label: 'Tech Solutions' }
  ];
  
  const contacts = [
    { value: 1, label: 'Mario Rossi' },
    { value: 2, label: 'Giuseppe Verdi' },
    { value: 3, label: 'Anna Bianchi' },
    { value: 4, label: 'Luca Neri' },
    { value: 5, label: 'Sofia Romano' }
  ];
  
  // Caricamento iniziale
  React.useEffect(() => {
    loadTasks();
  }, []);
  
  // Funzione caricamento task
  const loadTasks = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTasks = [
        {
          id: 1,
          title: 'App x Sic ecc.',
          description: 'Viene x parlare del da farsi',
          status: 'completed',
          priority: 'high',
          due_date: '2024-10-28',
          client: 'Minone pino (casa sua)',
          assignee: { id: 1, name: 'EF' },
          created_at: '2024-10-28'
        },
        {
          id: 2,
          title: 'Chiamare all\'amministratore',
          description: '',
          status: 'pending',
          priority: 'urgent',
          due_date: '2024-11-23',
          client: '',
          assignee: { id: 1, name: 'EF' },
          created_at: '2024-11-23'
        },
        {
          id: 3,
          title: 'Contatto con il cliente',
          description: 'Discussione requisiti progetto',
          status: 'pending',
          priority: 'normal',
          due_date: '2024-12-28',
          client: 'Azienda ABC',
          assignee: { id: 2, name: 'GC' },
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Attesa documentazione',
          description: '',
          status: 'pending',
          priority: 'low',
          due_date: '2024-12-30',
          client: '',
          assignee: { id: 3, name: 'Mario' },
          created_at: '2024-12-01'
        },
        {
          id: 5,
          title: 'Review del codice',
          description: 'Controllo qualità sprint 3',
          status: 'pending',
          priority: 'high',
          due_date: '2024-12-15',
          client: 'Tech Solutions',
          assignee: { id: 1, name: 'EF' },
          created_at: '2024-12-10'
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Errore caricamento tasks:', error);
      setToast({ message: 'Errore nel caricamento delle attività', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handler aggiunta task
  const handleAddTask = async (taskData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask = {
        ...taskData,
        id: Date.now(),
        status: taskData.status || 'pending',
        priority: taskData.priority || 'normal',
        created_at: new Date().toISOString(),
        assignee: taskData.assignees?.[0] ? 
          assignees.find(a => a.value === taskData.assignees[0]) || null : 
          null
      };
      
      setTasks([newTask, ...tasks]);
      setToast({ message: 'Attività aggiunta con successo', type: 'success' });
      return true;
    } catch (error) {
      setToast({ message: 'Errore nell\'aggiunta dell\'attività', type: 'error' });
      throw error;
    }
  };
  
  // Handler modifica task
  const handleTaskEdit = (task) => {
    console.log('Edit task:', task);
    setToast({ message: 'Funzionalità modifica in sviluppo', type: 'info' });
  };
  
  // Handler eliminazione task
  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa attività?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setTasks(tasks.filter(t => t.id !== taskId));
        setToast({ message: 'Attività eliminata', type: 'success' });
      } catch (error) {
        setToast({ message: 'Errore nell\'eliminazione', type: 'error' });
      }
    }
  };
  
  // Handler cambio stato task
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      ));
      setToast({
        message: newStatus === 'completed' ? 'Attività completata' : 'Stato aggiornato',
        type: 'success'
      });
    } catch (error) {
      setToast({ message: 'Errore nell\'aggiornamento', type: 'error' });
    }
  };
  
  // Handler filtri
  const handleFiltersChange = (filters) => {
    console.log('Filtri applicati:', filters);
    setShowFilters(false);
    setToast({ message: 'Filtri applicati', type: 'success' });
  };
  
  // Componenti
  const { Toast } = window.SharedComponents;
  
  // Render principale
  return React.createElement('div', { className: "min-h-screen bg-gray-50" },
    // Header
    React.createElement('div', { className: "bg-white border-b px-6 py-4 sticky top-0 z-40" },
      React.createElement('div', { className: "flex items-center justify-between" },
        React.createElement('h1', { className: "text-2xl font-semibold text-gray-800" }, 
          "Sistema Gestione Task"
        ),
        React.createElement('div', { className: "flex items-center gap-2" },
          React.createElement('button', {
            className: "px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600"
          }, "ATTIVITÀ"),
          React.createElement('button', {
            className: "px-4 py-2 font-medium text-gray-600 hover:text-gray-800"
          }, "PROGETTI")
        )
      )
    ),
    
    // Quick Add Task
    React.createElement('div', { className: "px-6 py-4 bg-white border-b" },
      React.createElement(window.QuickAddTask, {
        onAdd: handleAddTask,
        assignees: assignees,
        clients: clients,
        contacts: contacts
      })
    ),
    
    // Task Table
    React.createElement(window.TaskTable, {
      tasks: tasks,
      loading: loading,
      onRefresh: loadTasks,
      onTaskEdit: handleTaskEdit,
      onTaskDelete: handleTaskDelete,
      onTaskStatusChange: handleTaskStatusChange,
      onOpenFilters: () => setShowFilters(true)
    }),
    
    // Advanced Filters
    React.createElement(window.AdvancedFilters, {
      isOpen: showFilters,
      onClose: () => setShowFilters(false),
      filters: {},
      onFiltersChange: handleFiltersChange,
      assignees: assignees,
      clients: clients
    }),
    
    // Toast Notifications
    toast && React.createElement(Toast, {
      message: toast.message,
      type: toast.type,
      onClose: () => setToast(null)
    })
  );
};
